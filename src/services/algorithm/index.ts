import appConfig, { Algorithms } from "@/appConfig";
import placeApi from "../api";
import type AbstractApiProvider from "../api/ApiProvider";
import type AbstractPlaceFinder from "./AbstractPlaceFinder";
import PlaceFinder from "./PlaceFinder";

const { defaultAlgorithmFoundPlace } = appConfig;
let algorithmFoundPlace: AbstractPlaceFinder;

switch (defaultAlgorithmFoundPlace) {
  case Algorithms.Default:
    algorithmFoundPlace = new PlaceFinder(placeApi as AbstractApiProvider);
    break;

  default:
    throw new Error("Choose an algorithm");
}

export default algorithmFoundPlace;
