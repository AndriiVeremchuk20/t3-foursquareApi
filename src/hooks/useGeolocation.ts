import { useMutation } from "@tanstack/react-query";
import type Position from "@/types/Position";

const fetchGeolocation = async (): Promise<Position> => {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            return reject("User blocked access to their location");
          }
          reject(error.message);
        },
        {
          enableHighAccuracy: true,
        }
      );
    } else {
      reject("Geolocation is not supported by your browser.");
    }
  });
};

const useGeolocation = () => useMutation(["geolocation"], fetchGeolocation);

export default useGeolocation;
