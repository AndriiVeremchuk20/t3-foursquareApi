import { createTRPCRouter } from "@/server/trpc/trpc";
import { userPlace } from "./routers/userPlace";

export const appRouter = createTRPCRouter({
  place: userPlace,
});

export type AppRouter = typeof appRouter;
