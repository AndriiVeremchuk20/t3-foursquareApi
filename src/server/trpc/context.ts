import type Place from "@/types/Place";
import type AbstractPlaceFinder from "@/services/algorithm/AbstractPlaceFinder";
import algorithmFoundPlase from "@/services/algorithm";

interface ContextReturnType {
  placeFinderService: AbstractPlaceFinder;
  place: Place | null;
}

export function createContext(): ContextReturnType {
  const placeFinder = algorithmFoundPlase;
  return {
    placeFinderService: placeFinder,
    place: null,
  };
}

export type Context = typeof createContext;
