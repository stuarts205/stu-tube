import { categoriesRouter } from '@/modules/categories/server/procedures';
import { baseProcedure, createTRPCRouter, protectedProcedure } from '../init';

export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
});

export type AppRouter = typeof appRouter;