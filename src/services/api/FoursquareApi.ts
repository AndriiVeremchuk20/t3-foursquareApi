import type Place from "@/types/Place";
import type Position from "@/types/Position";
import config from "@/appConfig";
import axios, { type AxiosInstance } from "axios";
import type AbstractApiProvider from "./ApiProvider";
import { z } from "zod";

const envSchema = z.object({
  FoursquareBaseUrl: z.string(),
  FoursquareApiKey: z.string(),
});

const env = envSchema.parse({
  FoursquareBaseUrl: process.env.FOURSQUARE_BASE_URL,
  FoursquareApiKey: process.env.FOURSQUARE_API_KEY,
});

class FoursquareApi implements AbstractApiProvider {
  private client: AxiosInstance;
  constructor() {
    this.client = axios.create({
      baseURL: env.FoursquareBaseUrl,
      headers: {
        "Content-type": "application/json",
        Authorization: env.FoursquareApiKey,
      },
    });
  }

  public async searchPlacesByLocation(
    position: Position,
    radius: number = config.minSearchRadius || 100,
    limit: number = config.limitPlaces || 10
  ) {
    try {
      const paramsObj = {
        ll: `${position.latitude},${position.longitude}`,
        limit: `${limit}`, // Adjust the limit as needed
        radius: radius.toString(),
      };

      const searchParams = new URLSearchParams(paramsObj);

      const response = await this.client.get<{ results: Place[] }>(
        `/search?${searchParams.toString()}`
      );

      return {
        places: response.data.results,
        nextLink: response.headers.link as string,
      };
    } catch (error) {
      console.error("error when requesting location:", error);
      throw new Error(`Server Error.. Try later`);
    }
  }

  public async searchByNextLink(url: string) {
    try {
      const response = await this.client.get<{ results: Place[] }>(url);

      return {
        places: response.data.results,
        nextLink: response.headers.link as string | null,
      };
    } catch (error) {
      console.error("error when requesting location:", error);
      throw new Error(`Server Error.. Try later`);
    }
  }
}

const foursquareApi = new FoursquareApi();
export default foursquareApi;
