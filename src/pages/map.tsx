/* eslint-disable @next/next/no-img-element */
import Navigation from "@/components/Navigation";
import Head from "next/head";
import Image from "next/image";
import React, { useState } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { supabase } from "@/libs/supabase";
import Link from "next/link";

interface MapProps {
  cats: [
    {
      id: string;
      name: string;
      sex: string;
      personality: string;
      longitude: number;
      latitude: number;
      image: string;
    }
  ];
}

const Map: React.FC<MapProps> = ({ cats }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCat, setSelectedCat] = useState({});

  return (
    <>
      <Head>
        <title>Cats of Indonesia</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-secondary">
        <Navigation />
        <div className="mx-auto max-w-7xl py-16 px-6 sm:py-24 lg:px-8">
          <div className="text-center mb-10">
            <p className="mt-1 text-2xl font-bold tracking-tight text-primary lg:text-4xl">
              Click on a cat to find out more!
            </p>
            <p className="mx-auto mt-5 max-w-xl text-gray-500">
              Note: To ensure the safety of our community cats, we do not
              collect or display their exact locations. Learn more.
            </p>
          </div>
          <ReactMapGL
            initialViewState={{
              longitude: 116.0,
              latitude: -0.7893,
              zoom: 3.5,
            }}
            style={{ width: "auto", height: "500px" }}
            mapStyle="mapbox://styles/supryantowp/cld3ga5kl000101ob6ln1uyqf"
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          >
            {cats &&
              cats.map((cat) => (
                <Marker
                  key={cat.name}
                  longitude={cat.longitude}
                  latitude={cat.latitude}
                  onClick={() => {
                    setShowPopup(!showPopup);
                    setSelectedCat(cat);
                  }}
                >
                  <Image
                    src="/pawprint.png"
                    width="32"
                    height="32"
                    alt="marker"
                  />
                  {/* @ts-ignore */}
                  {showPopup && cat.id === selectedCat.id && (
                    <Popup
                      longitude={cat.longitude}
                      latitude={cat.latitude}
                      closeButton={false}
                      closeOnClick={false}
                    >
                      <img
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/cats/${cat.image}`}
                        className="h-24 w-24 object-cover"
                        alt="popup"
                      />
                      <h1 className="mt-2">{cat.name}</h1>
                      <Link href={`/cats/${cat.id}`} legacyBehavior>
                        <a className="text-sm font-light">See More</a>
                      </Link>
                    </Popup>
                  )}
                </Marker>
              ))}
          </ReactMapGL>
        </div>
      </main>
    </>
  );
};

export async function getServerSideProps() {
  let { data } = await supabase.from("cats").select();
  return {
    props: { cats: data },
  };
}

export default Map;