import { db } from "@/db";
import { users } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { initTRPC, TRPCError } from "@trpc/server";
import { cache } from "react";
import superjson from "superjson";
import { eq } from "drizzle-orm";
import { ratelimit } from "@/lib/ratelimit";

export const createTRPCContext = cache(async () => {
  const { userId } = await auth();
  return { clerkUserId: userId };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;



export const protectedProcedure = t.procedure.use(async function isAuthed(
  opts
) {
  const { ctx } = opts;
  if (!ctx.clerkUserId) {
    throw new TRPCError({ message: "Not authenticated", code: "UNAUTHORIZED" });
  }

  let [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, ctx.clerkUserId));

  if (!user) {
    // The Clerk webhook may not have arrived (e.g. localhost without a tunnel),
    // so create the row from the Clerk session instead of rejecting the user.
    const clerkUser = await currentUser();

    if (!clerkUser || clerkUser.id !== ctx.clerkUserId) {
      throw new TRPCError({ message: "Not authenticated", code: "UNAUTHORIZED" });
    }

    const name =
      [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
      clerkUser.username ||
      clerkUser.primaryEmailAddress?.emailAddress ||
      "Unknown";

    // clerk_id is unique, so this is safe if the webhook or a parallel batched
    // request inserts the same user first.
    await db
      .insert(users)
      .values({
        clerkId: clerkUser.id,
        name,
        imageUrl: clerkUser.imageUrl,
      })
      .onConflictDoNothing({ target: users.clerkId });

    [user] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, ctx.clerkUserId));

    if (!user) {
      throw new TRPCError({ message: "Not authenticated", code: "UNAUTHORIZED" });
    }
  }

  const { success } = await ratelimit.limit(user.id);

  if(!success) {
    throw new TRPCError({ message: "Rate limited", code: "TOO_MANY_REQUESTS" });
  }

  return opts.next({
    ctx: {
      ...ctx,
      user,
    },
  });
});
