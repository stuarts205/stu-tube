"use client";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import React, { use } from "react";
import { usePathname } from "next/navigation";
import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";
import UserAvatar from "@/components/user-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ListIcon } from "lucide-react";

export const LoadingSkeleton = () => {
  return (
    <>
      {[1, 2, 3, 4].map((i) => (
        <SidebarMenuItem key={i}>
          <SidebarMenuButton disabled>
            <Skeleton className="size-6 rounded-full shrink-0" />
            <Skeleton className="w-full h-4" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
};

const SubscriptionSection = () => {
    const pathName = usePathname();
    const { data, isLoading } = trpc.subscriptions.getMany.useInfiniteQuery({
      limit: DEFAULT_LIMIT,
    }, {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    })    

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Subscriptions</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {isLoading && <LoadingSkeleton />}
          {!isLoading && data?.pages.flatMap((page) => page.items).map((subscription) => (
            <SidebarMenuItem key={`${subscription.creatorId}-${subscription.viewerId}`}>
              <SidebarMenuButton
                tooltip={subscription.user.name}
                asChild
                isActive={pathName === `/users/${subscription.user.id}`}
              >
                <Link className="flex items-center gap-4" href={`/users/${subscription.user.id}`}>
                  <UserAvatar
                    size='xs'
                    imageUrl={subscription.user.imageUrl}
                    name={subscription.user.name} 
                  />
                  <span className="text-sm">{subscription.user.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          {!isLoading && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathName === '/subscriptions'}>
              <Link href='/subscriptions' className="flex items-center gap-4">
                <ListIcon className="size-4" />
                <span className="text-sm">View all subscriptions</span>
              </Link>
              </SidebarMenuButton>                
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SubscriptionSection;
