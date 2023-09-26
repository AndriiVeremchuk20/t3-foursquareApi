import redisClient from "@/db/redisClient";
import type Position from "@/types/Position";
import isValidCoordinates from "@/utils/isValidCoordinates";
import { middleware, publicProcedure } from "../trpc";
import config from "@/appConfig";
import { errorHandler } from "./errorHandler";
import type Place from "@/types/Place";
import {env} from "@/env.mjs";

const REDIS_KEY= env.REDIS_KEY;

const checkLocationInCache = middleware(async (opts) => {
  const { location } = opts.rawInput as { location: Position };
  if (!location || !isValidCoordinates(location)) {
    throw new Error(
      `Invalid coordinates Lon:${location.longitude}, Lat: ${location.latitude}`
    );
  }
  const mbLocation = await redisClient.geosearch(
    REDIS_KEY,
    "FROMLONLAT",
    location.longitude,
    location.latitude,
    "BYRADIUS",
    config.maxSearchRadius,
    "m",
    "ASC"
  ) as string[];

  console.log(mbLocation);

  if (mbLocation.length && mbLocation[0]) {
    const place: Place = JSON.parse(mbLocation[0]);
    console.log("Get from cashe.");

    return opts.next({
      ctx: {
        ...opts.ctx,
        place,
      },
    });
  }
  return opts.next();
});

export const checkedLocationProcedure = publicProcedure
  .use(errorHandler)
  .use(checkLocationInCache);
