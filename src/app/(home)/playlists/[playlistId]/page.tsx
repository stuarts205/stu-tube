import { DEFAULT_LIMIT } from '@/constants'
import VidoesView from '@/modules/playlists/ui/views/videos-view'
import { HydrateClient, trpc } from '@/trpc/server'
import React from 'react'

export const dynamic = 'force-dynamic'

interface PageProps {
    params: Promise<{playlistId: string}>
}

const Page = async ({params}: PageProps) => {
    const {playlistId} = await params;
    void trpc.playlists.getOne.prefetch({id: playlistId})
void trpc.playlists.getVideos.prefetchInfinite({playlistId, limit: DEFAULT_LIMIT})
  return (
    <HydrateClient>
        <VidoesView playlistId={playlistId} />
    </HydrateClient>
  )
}

export default Page