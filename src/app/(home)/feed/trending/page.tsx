import { DEFAULT_LIMIT } from "@/constants";
import HomeView from "@/modules/home/ui/views/home-view";
import TrendingView from "@/modules/home/ui/views/trending-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = 'force-dynamic'

export default async function Page() {
  void trpc.videos.getManyTrending.prefetchInfinite({limit: DEFAULT_LIMIT});
  
  return (
    <HydrateClient>
      <TrendingView />
    </HydrateClient>
  );
}
