export enum Apis {
  FoursquareApi,
}
export enum Algorithms {
  Default,
}

interface AppConfig {
  limitPlaces: number;
  maxSearchRadius: number;
  minSearchRadius: number;
  earthRadiusMeters: number;
  iconSize: number;
  redisKey: string;
  defaultApi: Apis;
  defaultAlgorithmFoundPlace: Algorithms;
}

const appConfig: AppConfig = {
  limitPlaces: 10,
  maxSearchRadius: 1000,
  minSearchRadius: 100,
  earthRadiusMeters: 6371000,
  iconSize: 64,
  redisKey: "GEO_CACHE",
  defaultApi: Apis.FoursquareApi,
  defaultAlgorithmFoundPlace: Algorithms.Default,
};

export default appConfig;
