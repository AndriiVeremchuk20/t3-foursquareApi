import useGeolocation from "@/hooks/useGeolocation";
import { useAtom } from "jotai";
import store from "@/store";
import { MdOutlineNotListedLocation } from "react-icons/md";
import { useState } from "react";
import type Position from "@/types/Position";

const FindMyLocationButton = () => {
  const [, setLocation] = useAtom(store.locationAtom);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const geolocation = useGeolocation();

  const clickHandler = async () => {
    try {
      const userLocation = (await geolocation.mutateAsync()) as Position;
      setLocation(userLocation);
    } catch (error) {
      setIsDisabled(true);
      alert(error);
    }
  };

  return (
    <button
      onClick={clickHandler}
      disabled={isDisabled}
      className="
		w-[300px]
		rounded-md
		bg-blue-600
		p-2
		text-xl
		font-semibold
		text-white
		shadow-md
		shadow-slate-50
		duration-150
		hover:bg-blue-400
		focus:ring-2
		focus:ring-blue-400
		disabled:bg-neutral-600
		disabled:text-neutral-300
	  "
    >
      {geolocation.isLoading ? (
        <span>Loading...</span>
      ) : (
        <span
          className="
			flex 
			items-center 
			justify-center"
        >
          Find my location <MdOutlineNotListedLocation size={40} />
        </span>
      )}
    </button>
  );
};

export default FindMyLocationButton;
