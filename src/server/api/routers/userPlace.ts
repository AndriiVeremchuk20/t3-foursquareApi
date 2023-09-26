import { z } from "zod";
import { createTRPCRouter } from "@/server/trpc/trpc";
import redisClient from "@/db/redisClient";
import config from "@/appConfig";
import { checkedLocationProcedure } from "@/server/trpc/middleware/checkLocationInCache";
import type Place from "@/types/Place";
import type AbstractPlaceFinder from "@/services/algorithm/AbstractPlaceFinder";

const REDIS_KEY = config.redisKey;

export const userPlace = createTRPCRouter({
  getPossiblePlace: checkedLocationProcedure
    .input(
      z.object({
        location: z.object({ longitude: z.number(), latitude: z.number() }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { place, placeFinderService } = ctx as { place: Place|null, placeFinderService: AbstractPlaceFinder };

      if (place) {
        return place;
      }

      const result = await placeFinderService.find(input.location);

      if (result) {
        const foundPlace = {
          place: JSON.stringify(result),
          latitude: result.geocodes.main.latitude,
          longitude: result.geocodes.main.longitude,
        };

        await redisClient
          .geoadd(
            REDIS_KEY,
            foundPlace.longitude as number,
            foundPlace.latitude as number,
            foundPlace.place
          )
          .then(() => console.log("New place added"))
          .catch(() => console.log("Error adding"));
        console.log("New place saved");
      }

      return result;
    }),
});
