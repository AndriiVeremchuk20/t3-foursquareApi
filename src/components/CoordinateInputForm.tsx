import { useAtom } from "jotai";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import store from "@/store";
import { BiCurrentLocation, BiReset } from "react-icons/bi";
import type Position from "@/types/Position";

interface CoordinatesForm {
  latitude: number;
  longitude: number;
}

interface CoordinateInputFormProps {
  isAppLoading: boolean;
}

const CoordinateInputForm: React.FC<CoordinateInputFormProps> = ({
  isAppLoading,
}) => {
  const [location, setLocation] = useAtom(store.locationAtom);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<CoordinatesForm>();

  const onSubmit: SubmitHandler<CoordinatesForm> = (data) => {
    console.log("Input coordinates", data);

    const position: Position = data;
    setLocation(position);
  };

  const onReset = () => {
    if (!location) return reset();

    setValue("latitude", location.latitude);
    setValue("longitude", location.longitude);
  };

  useEffect(() => {
    if (!location) return;

    setValue("longitude", location.longitude);
    setValue("latitude", location.latitude);
    clearErrors();

	/* eslint-disable react-hooks/exhaustive-deps */
  }, [location]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="
		flex 
		flex-col 
		gap-2 
		rounded-lg 
		border-2 
		border-gray-300 
		bg-neutral-200 
		p-3 
		shadow-lg"
    >
      <h3 className="border-b-2 border-neutral-300 text-xl font-semibold">
        Your location:
      </h3>
      <div className="flex flex-col">
        <label htmlFor="latitude">Latitude:</label>
        <input
          type="number"
          id="latitude"
          step="0.0000001"
          placeholder="Latitude"
          className="
			border-b-2 
			border-black 
			bg-inherit 
			text-xl 
			outline-none"
          {...register("latitude", {
            required: "Required",
            valueAsNumber: true,
            min: { value: -90, message: "min lat value -90" },
            max: { value: 90, message: "max lat value 90" },
          })}
        />
        {errors.latitude && (
          <p className="font-semibold text-red-600">
            {errors.latitude.message}
          </p>
        )}
      </div>
      <div
        className="
	    flex 
		flex-col"
      >
        <label htmlFor="longitude">Longitude:</label>
        <input
          type="number"
          id="longitude"
          step="0.0000001"
          placeholder="Longitude"
          className="
			border-b-2 
			border-black 
			bg-inherit 
			text-xl 
			outline-none"
          {...register("longitude", {
            required: "Required",
            valueAsNumber: true,
            min: { value: -180, message: "min lon value -180" },
            max: { value: 180, message: "max lon value 180" },
          })}
        />
        {errors.longitude && (
          <p
            className="
			font-semibold 
			text-red-600"
          >
            {errors.longitude.message}
          </p>
        )}
      </div>
      <div
        className="
		flex 
		justify-between"
      >
        <button
          type="button"
          onClick={onReset}
          className="
			flex 
			items-center 
			gap-2 
			rounded-md 
			bg-red-600 
			px-2 
			py-1 
			text-lg 
			font-semibold 
			text-white 
			hover:bg-orange-500 
			focus:ring-2 
			focus:ring-red-500 
			disabled:bg-neutral-400"
        >
          Reset <BiReset />
        </button>
        <button
          type="submit"
          disabled={isAppLoading}
          className="
			flex 
			items-center 
			gap-2 
			rounded-md 
			bg-blue-600 
			px-2 py-1 
			text-lg 
			font-semibold 
			text-white 
			hover:bg-sky-500 
			focus:ring-2 
			focus:ring-sky-500 
			disabled:bg-neutral-400"
        >
          Submit <BiCurrentLocation />
        </button>
      </div>
    </form>
  );
};

export default CoordinateInputForm;
