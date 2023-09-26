import type Position from "./Position";

interface Category {
  id: string;
  name: string;
  icon: {
    prefix: string;
    suffix: string;
  };
}

interface Geocodes {
  main: Position;
}

interface Location {
  country: string;
  cross_street: string;
  formatted_address: string;
  locality: string;
  region: string;
}

interface Place {
  fsq_id: string;
  name: string;
  distance: number;
  categories: Category[];
  geocodes: Geocodes;
  location: Location;
}

export default Place;
