import UserView from "@/modules/users/ui/views/user-view";
import { trpc, HydrateClient } from "@/trpc/server";
import React from "react";

interface UserPageProps {
  params: Promise<{
    userId: string;
  }>;
}

const Page = async ({ params }: UserPageProps) => {
  const { userId } = await params;

  void trpc.users.getOne.prefetch({ id: userId });

  return (
    <HydrateClient>
      <UserView userId={userId} />
    </HydrateClient>
  );
};

export default Page;
