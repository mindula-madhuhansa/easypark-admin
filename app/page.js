"use client";

import Map from "@/components/Map";
import useStore from "@/utils/useStore";
import { getLocation } from "@/utils/getLocation";
import { getParkingSpaceId } from "@/utils/getParkingSpaceId";
import { doc, setDoc } from "firebase/firestore";
import { db, storage } from "@/config/firebase";
import toast from "react-hot-toast";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import SidePanel from "@/components/SidePanel";
import QRCode from "react-qr-code";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");

  const GenerateQRCode = () => {
    QRCode.toDataURL(url, {
      margin: 2,
      width: 800,
      color: {
        dark: "#335383FF",
        light: "#EEEEEEFF",
      },
    });
  };
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
  const parkingId = getParkingSpaceId(parkingName, latitude, longitude);

  const handleSave = async () => {
    const toastId = toast.loading("Saving...");
    const parkingSpaceId = getParkingSpaceId(parkingName, latitude, longitude);

    const docRef = ref(storage, `parkingImages/${parkingSpaceId}`);

    try {
      await uploadBytes(docRef, parkingImage);
      const imageURL = await getDownloadURL(docRef);

      await setDoc(doc(db, "parking-spaces", parkingSpaceId), {
        parkingName: parkingName,
        address: address,
        slots: availableSlots,
        parkingRate: parkingRate,
        parkingType: parkingType,
        latitude: latitude,
        longitude: longitude,
        imageUrl: imageURL,
      });

      toast.success("Parking details saved successfully!", {
        id: toastId,
        position: "top-center",
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
      toast.error("Couldn't save the Parking details", {
        id: toastId,
        position: "top-center",
      });
    }

    // download qr
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
                  <label>Latitude*</label>
                  <input
                    required
                    placeholder="Latitude of the parking space"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                  />
                </div>
                <div className="containerDiv">
                  <label>Longitude*</label>
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
              <label>Parking name*</label>
              <input
                required
                placeholder="Display name of the parking space"
                value={parkingName}
                onChange={(e) => setParkingName(e.target.value)}
              />
            </div>

            <div className="containerDiv">
              <label>Address*</label>
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
                <label>Parking rate*</label>
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
              <label>Parking space image*</label>
              <input
                type="file"
                onChange={(e) => setParkingImage(e.target.files[0])}
              />
            </div>

            <button onClick={GenerateQRCode}>Generate</button>
            {parkingName && (
              <>
                <img scr={parkingId} />
                <button
                  variant="contained"
                  color="success"
                  herf={parkingId}
                  download="qrcode.png"
                >
                  Download
                </button>
              </>
            )}

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
