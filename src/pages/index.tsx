import Head from "next/head";
import { api } from "@/utils/api";
import CoordinateInputForm from "@/components/CoordinateInputForm";
import FindMyLocationButton from "@/components/FindMyLocationButton";
import Loading from "@/components/Loading";
import { useAtom } from "jotai";
import store from "@/store";
import { useEffect, useState } from "react";
import type Place from "@/types/Place";
import PlaceCard from "@/components/PlaceCard";

export default function Home() {
  const [location] = useAtom(store.locationAtom);
  const [possiblePlace, setPossiblePlace] = useState<Place | null>(null);

  const getPossiblePlace = api.place.getPossiblePlace.useMutation({
    onSuccess: (data) => {
      console.log(data);
      setPossiblePlace(data);
    },
    onError: (error) => {
      console.log(error);
      if (error instanceof Error) {
        alert(error.message);
      }
    },
  });

  useEffect(() => {
    if (!location) return;
    getPossiblePlace.mutate({ location });
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [location]);

  return (
    <>
      <Head>
        <title>Where I am?</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-image flex h-screen items-center justify-center bg-cover bg-fixed bg-no-repeat">
        <div className="flex h-3/4 w-4/5 flex-col items-center gap-[100px] rounded-md bg-neutral-300 bg-opacity-90">
          <h2 className="m-5 h-fit text-3xl font-semibold">Where I am?</h2>
          <div className="flex w-full items-center justify-around gap-3">
            <div className="w-[500px]">
              <CoordinateInputForm isAppLoading={getPossiblePlace.isLoading} />
            </div>
            <FindMyLocationButton />
            <div className="h-[150px] max-h-fit w-[500px] rounded-md bg-neutral-200">
              <span className="mx-2 my-1 p-2 text-xl font-semibold ">
                Your possible place:
              </span>
              <Loading isLoading={getPossiblePlace.isLoading}>
                {possiblePlace ? (
                  <PlaceCard place={possiblePlace} />
                ) : (
                  <div className="h-full rounded-md border-2 border-gray-300 bg-neutral-200 p-3 text-xl font-semibold shadow-lg">
                    Not found.
                  </div>
                )}
              </Loading>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
