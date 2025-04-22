import { DEFAULT_LIMIT } from '@/constants'
import SubscriptionsView from '@/modules/subscriptions/ui/views/subscriptions-view'
import { trpc, HydrateClient } from '@/trpc/server'
import React from 'react'

const Page = async () => {
    void trpc.subscriptions.getMany.prefetchInfinite({
        limit: DEFAULT_LIMIT
    })
  return (
    <HydrateClient>
        <SubscriptionsView />
    </HydrateClient>
  )
}

export default Page