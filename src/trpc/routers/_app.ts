import { z } from 'zod';
import { baseProcedure, createTRPCRouter, protectedProcedure } from '../init';
import { auth } from '@clerk/nextjs/server';

export const appRouter = createTRPCRouter({
  hello: protectedProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      console.log({ dbUser: opts.ctx.user });
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
});

export type AppRouter = typeof appRouter;