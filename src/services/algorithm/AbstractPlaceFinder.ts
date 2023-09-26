import type Place from "@/types/Place";
import type Position from "@/types/Position";
import type AbstractApiProvider from "../api/ApiProvider";

abstract class AbstractPlaceFinder {
  protected api: AbstractApiProvider;

  constructor(api: AbstractApiProvider) {
    this.api = api;
  }

  abstract find(position: Position): Promise<Place | null>;
}

export default AbstractPlaceFinder;
