import appConfig from "@/appConfig";
import type Place from "@/types/Place";
import type Position from "@/types/Position";
import parseHeaderLink from "@/utils/parseHeaderLink";
import type AbstractApiProvider from "../api/ApiProvider";
import isValidCoordinates from "@/utils/isValidCoordinates";
import AbstractPlaceFinder from "./AbstractPlaceFinder";

const EARTH_RADIUS_KM = appConfig.earthRadiusMeters ?? 6371000; // Average radius of the Earth in meters

class PlaceFinder extends AbstractPlaceFinder {
  constructor(api: AbstractApiProvider) {
    super(api);
  }

  private degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private getDistance(p1: Position, p2: Position): number {
    if (!isValidCoordinates(p1) || !isValidCoordinates(p2)) {
      throw new Error(
        `Invalid coordinates. ${(p1.latitude, p1.longitude)}, ${
          (p2.latitude, p2.longitude)
        }`
      );
    }

    const dLat = this.degreesToRadians(p2.latitude - p1.latitude);
    const dLon = this.degreesToRadians(p2.longitude - p1.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(p1.latitude)) *
        Math.cos(this.degreesToRadians(p2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = EARTH_RADIUS_KM * c; // distance km
    return distance;
  }

  private getPlaceWithMinDistance(
    p1: Place | null,
    p2: Place | null,
    userLocation: Position
  ): Place | null {
    if (!p1 || !p2) {
      return p1 ?? p2 ?? null;
    }

    return this.getDistance(p1.geocodes.main as Position, userLocation) <
      this.getDistance(p2.geocodes.main as Position, userLocation)
      ? p1
      : p2;
  }

  private getNearestPlace(
    places: Place[],
    userLocation: Position
  ): Place | null {
    if (!places.length) return null;

    return places.reduce((acc, place) => {
      return this.getPlaceWithMinDistance(acc, place, userLocation);
    }, places[0] ?? null);
  }

  private async searchByNextLink(
    nextLink: string,
    userLocation: Position
  ): Promise<Place | null> {
    let tempLink: string | null = nextLink;
    let possiblePlace: Place | null = null;

    while (tempLink) {
      const url = parseHeaderLink(tempLink);
      if (!url) break;

      try {
        const { places, nextLink } = await this.api.searchByNextLink(url);
        const tempPlace = this.getNearestPlace(places, userLocation);
        possiblePlace = this.getPlaceWithMinDistance(
          tempPlace,
          possiblePlace,
          userLocation
        );
        tempLink = nextLink;
      } catch (error) {
        console.error("Error fetching next link:", error);
        break;
      }
    }

    return possiblePlace;
  }

  private async searchByRadius(
    userPosition: Position,
    radius: number
  ): Promise<Place | null> {
    try {
      let possiblePlace: Place | null = null;
      console.log(`Radius: ${radius}`);

      const { places, nextLink } = await this.api.searchPlacesByLocation(
        userPosition,
        radius
      );

      if (!places.length) return null;

      let tempPlace: Place | null = null;
      const nextPlacesLink: string | null = nextLink;

      tempPlace = this.getNearestPlace(places, userPosition);

      if (nextPlacesLink) {
        try {
          const temp = await this.searchByNextLink(
            nextPlacesLink,
            userPosition
          );
          console.log(temp);
          possiblePlace = this.getPlaceWithMinDistance(
            temp,
            possiblePlace,
            userPosition
          );
        } catch (error) {
          console.error("Error fetching next link:", error);
        }
      }

      possiblePlace = this.getPlaceWithMinDistance(
        tempPlace,
        possiblePlace,
        userPosition
      );

      return possiblePlace;
    } catch (error) {
      console.error("Error searching by radius:", error);
      throw error;
    }
  }

  public async find(position: Position): Promise<Place | null> {
    try {
      const maxRadius = appConfig.maxSearchRadius; // max search radius
      const minRadius = appConfig.minSearchRadius;

      let possiblePlace: Place | null = null;

      // try to get places by user current location
      possiblePlace = await this.searchByRadius(position, minRadius);
      if (possiblePlace) {
        return possiblePlace;
      }

      // check if there are places within the maximum radius
      possiblePlace = await this.searchByRadius(position, maxRadius);
      if (!possiblePlace) return null;

      for (
        let i = maxRadius - minRadius * 2;
        i >= Math.floor(maxRadius / 2);
        i -= minRadius
      ) {
        let temp = await this.searchByRadius(position, i);

        if (!temp) break;

        possiblePlace = this.getPlaceWithMinDistance(
          temp,
          possiblePlace,
          position
        );

        temp = await this.searchByRadius(position, maxRadius - i);

        if (temp) {
          possiblePlace = this.getPlaceWithMinDistance(
            temp,
            possiblePlace,
            position
          );
          return possiblePlace;
        }
      }

      console.log(possiblePlace);
      if (possiblePlace) {
        const distance = this.getDistance(
          possiblePlace.geocodes.main as Position,
          position
        );
        return { ...possiblePlace, distance };
      }
      return possiblePlace;
    } catch (error) {
      console.error("Error getting possible place:", error);
      throw error;
    }
  }
}

export default PlaceFinder;
