import type Place from "@/types/Place";
import convertDistance from "@/utils/convertDistance";
import getIconURL from "@/utils/getIconURL";
import { BsQuestionCircle } from "react-icons/bs";
import React from "react";
import Image from "next/image";

interface PlaceListItemProps {
  place: Place;
}

const PlaceCard: React.FC<PlaceListItemProps> = ({ place }) => {
  const { categories } = place;

  return (
    <div className="flex cursor-pointer justify-between gap-2 p-3 duration-150 hover:bg-neutral-200">
      <div className="flex items-center gap-2">
        <div className="rounded-full bg-neutral-600 p-1">
          {categories[0] ? (
            <Image
              src={getIconURL(categories[0].icon)}
              alt={place.name}
              width={100}
              height={100}
            />
          ) : (
            <BsQuestionCircle size={40} className="text-white" />
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-semibold">{place.name}</span>
          <span>{place.categories.map((item) => item.name + " ")}</span>
          <div>{convertDistance(place.distance)}</div>
        </div>
      </div>
      <div>{place.location.formatted_address}</div>
    </div>
  );
};

export default React.memo(PlaceCard);
