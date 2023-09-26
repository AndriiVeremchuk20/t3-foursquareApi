import type Place from "@/types/Place";
import type Position from "@/types/Position";

type SearchPlaceApiResponse = { places: Place[]; nextLink: string | null };

abstract class AbstractApiProvider {
  abstract searchPlacesByLocation: (
    userPosition: Position,
    radius: number
  ) => Promise<SearchPlaceApiResponse>;
  abstract searchByNextLink: (url: string) => Promise<SearchPlaceApiResponse>;
}

export default AbstractApiProvider;
