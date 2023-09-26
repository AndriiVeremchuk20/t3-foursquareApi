import { TRPCError } from "@trpc/server";
import { middleware, publicProcedure } from "../trpc";

export const errorHandler = middleware(async (opts) => {
  try {
    return await opts.next({ ...opts });
  } catch (error) {
    console.log(error);
    if (error instanceof TRPCError) throw error;
    else throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", cause: error });
  }
});

export const errorHandleProcedure = publicProcedure.use(errorHandler);
