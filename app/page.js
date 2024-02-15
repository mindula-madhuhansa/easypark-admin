"use client";

import Map from "@/components/Map";
import useStore from "@/utils/useStore";
import { getLocation } from "@/utils/getLocation";
import { getParkingSpaceId } from "@/utils/getParkingSpaceId";
import { doc, setDoc } from "firebase/firestore";
import { db, storage } from "@/config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import SidePanel from "@/components/SidePanel";
import QRCode from "qrcode";
import { useState } from "react";
export default function Home() {
  const [imageUrlIn, setImageUrlIn] = useState("");
  const [imageUrlOut, setImageUrlOut] = useState("");
  const {
    parkingName,
    address,
    availableSlots,
    parkingRate,
    parkingType,
    latitude,
    longitude,
    parkingImage,
    setParkingName,
    setAddress,
    setAvailableSlots,
    setParkingRate,
    setParkingType,
    setLatitude,
    setLongitude,
    setParkingImage,
  } = useStore();

  const handleMarkMyLocation = () => {
    getLocation()
      .then(({ lat, lng }) => {
        setLatitude(lat);
        setLongitude(lng);
      })
      .catch((error) => {
        console.error("Error getting user's location:", error);
      });
  };

  const handleSave = async () => {
    const parkingSpaceId = getParkingSpaceId(parkingName, latitude, longitude);

    const docRef = ref(storage, `parkingImages/${parkingSpaceId}`);

    const inData = parkingSpaceId + "~true";
    const outData = parkingSpaceId + "~false";

    const responseImageUrlIn = await QRCode.toDataURL(inData, {
      type: "image/png",
      margin: 1,
      width: 400,
    });
    setImageUrlIn(responseImageUrlIn);

    const responseImageUrlOut = await QRCode.toDataURL(outData, {
      type: "image/png",
      margin: 1,
      width: 400,
    });
    setImageUrlOut(responseImageUrlOut);

    try {
      await uploadBytes(docRef, parkingImage);
      const imageURL = await getDownloadURL(docRef);

      await setDoc(doc(db, "parking-spaces", parkingSpaceId), {
        parkingSpaceId: parkingSpaceId,
        parkingName: parkingName,
        address: address,
        slots: availableSlots,
        parkingRate: parkingRate,
        parkingType: parkingType || "Public",
        latitude: latitude,
        longitude: longitude,
        imageUrl: imageURL || "",
        freeSlots: availableSlots,
      });

      setParkingName("");
      setAddress("");
      setAvailableSlots(0);
      setParkingRate(0);
      setParkingType("");
      setLatitude("");
      setLongitude("");
      setParkingImage("");
    } catch (error) {
      console.error("Couldn't save the Parking details: ", error);
    }
  };

  const handleDiscard = () => {
    setParkingName("");
    setAddress("");
    setAvailableSlots(0);
    setParkingRate(0);
    setParkingType("");
    setLatitude("");
    setLongitude("");
    setParkingImage("");
  };

  return (
    <main className="flex flex-col min-h-screen md:flex-row">
      <SidePanel />
      <div className="flex-1 p-5 lg:p-10">
        <div className="flex flex-col xl:flex-row space-y-4 xl:space-x-4 m-6 justify-center">
          {/* Left Form */}
          <div className="border-2 border-black rounded-xl p-4 flex flex-col">
            <div className="flex flex-col">
              <div className="grid grid-cols-2">
                <div className="containerDiv">
                  <label>
                    Latitude<span className="text-red-600">*</span>
                  </label>
                  <input
                    required
                    placeholder="Latitude of the parking space"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                  />
                </div>
                <div className="containerDiv">
                  <label>
                    Longitude<span className="text-red-600">*</span>
                  </label>
                  <input
                    required
                    placeholder="Longitude of the parking space"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                  />
                </div>
              </div>

              <button
                className="text-center px-4 py-2 bg-gray-600 rounded-full mb-4 mx-4 font-semibold text-white"
                onClick={handleMarkMyLocation}
              >
                Mark my current location
              </button>
            </div>

            <div className="flex border-2 border-black mx-auto">
              <Map />
            </div>
          </div>

          {/* Right Form */}
          <div className="border-2 border-black rounded-xl flex flex-col">
            <div className="containerDiv">
              <label>
                Parking name<span className="text-red-600">*</span>
              </label>
              <input
                required
                placeholder="Display name of the parking space"
                value={parkingName}
                onChange={(e) => setParkingName(e.target.value)}
              />
            </div>

            <div className="containerDiv">
              <label>
                Address<span className="text-red-600">*</span>
              </label>
              <input
                required
                placeholder="Enter the parking space address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-3">
              <div className="containerDiv">
                <label>Parking slots*</label>
                <input
                  required
                  placeholder="Number of slots"
                  type="number"
                  value={availableSlots}
                  onChange={(e) => setAvailableSlots(e.target.value)}
                />
              </div>

              <div className="containerDiv">
                <label>
                  Parking rate<span className="text-red-600">*</span>
                </label>
                <input
                  placeholder="Enter parking rate/hr"
                  type="number"
                  value={parkingRate}
                  onChange={(e) => setParkingRate(e.target.value)}
                />
              </div>

              <div className="containerDiv">
                <label>Parking type</label>
                <select
                  value={parkingType}
                  onChange={(e) => setParkingType(e.target.value)}
                >
                  <option disabled defaultChecked>
                    Select a type
                  </option>
                  <option>Public</option>
                  <option>Customer</option>
                </select>
              </div>
            </div>

            <div className="containerDiv">
              <label>
                Parking space image<span className="text-red-600">*</span>
              </label>
              <input
                type="file"
                onChange={(e) => setParkingImage(e.target.files[0])}
              />

              {imageUrlIn && imageUrlOut ? (
                <div className="mt-12 flex flex-col items-center justify-center">
                  <h1 className="text-xl font-semibold">
                    Click to Download QR
                  </h1>
                  <div className="flex">
                    <div>
                      <h1 className="font-bold text-2xl">IN</h1>
                      <a href={imageUrlIn} download>
                        <img className="h-40 w-40" src={imageUrlIn} alt="img" />
                      </a>
                    </div>
                    <div>
                      <h1 className="font-bold text-2xl">OUT</h1>
                      <a href={imageUrlOut} download>
                        <img
                          className="h-40 w-40"
                          src={imageUrlOut}
                          alt="img"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Save Discard Buttons */}
            <div className="flex flex-col mt-40">
              <button
                className="text-center py-2 bg-green-600 text-white text-lg rounded-full mb-4 mx-4 font-semibold"
                onClick={handleSave}
              >
                Save
              </button>

              <button
                className="text-center py-2 bg-red-600 text-white text-lg rounded-full mb-4 mx-4 font-semibold"
                onClick={handleDiscard}
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
