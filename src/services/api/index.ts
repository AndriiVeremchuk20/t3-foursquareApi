import appConfig, { Apis } from "@/appConfig";
import AbstractApiProvider from "./ApiProvider";
import foursquareApi from "./FoursquareApi";

const { defaultApi } = appConfig;

let placeApi: AbstractApiProvider = foursquareApi;

switch (defaultApi) {
  case Apis.FoursquareApi:
    placeApi = foursquareApi;
    break;

  default:
    throw new Error("Choose an Api");
}

export default placeApi;
