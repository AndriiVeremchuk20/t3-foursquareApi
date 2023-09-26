import type Position from "@/types/Position";

const MAX_LAT = 90,
  MIN_LAT = -90,
  MIN_LON = 180,
  MAX_LON = -180;

const isValidCoordinates = (position: Position) => {
  const { latitude, longitude } = position;
  return !(
    latitude >= MIN_LAT &&
    latitude <= MAX_LAT &&
    longitude >= MIN_LON &&
    longitude <= MAX_LON
  );
};

export default isValidCoordinates;
