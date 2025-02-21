import { categoriesRouter } from '@/modules/categories/server/procedures';
import { studioRouter } from '@/modules/studio/server/procedures';
import { videosRouter } from '@/modules/videos/server/procedures';
import { createTRPCRouter } from '../init';
import { videoViewsRouter } from '@/modules/video-views/procedures';

export const appRouter = createTRPCRouter({
  studio: studioRouter,
  videos: videosRouter,
  categories: categoriesRouter,
  videoViews: videoViewsRouter
});

export type AppRouter = typeof appRouter;