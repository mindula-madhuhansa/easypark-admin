"use client";

import { useState, useEffect } from "react";
import { QrScanner } from "@yudiel/react-qr-scanner";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";

import { db } from "@/config/firebase";
import { getCurrentTimeFormatted } from "@/utils/getTime";

function QRScannerPage() {
  const [scannedData, setScannedData] = useState("No result");
  const [parkingLocation, setParkingLocation] = useState("");
  const [scanCompleted, setScanCompleted] = useState(false);

  // get the parking location
  // useEffect(() => {
  //   fetchParkingLocation();
  // }, []);

  // fetch parking location
  // async function fetchParkingLocation() {
  //   try {
  //     const location = await getLocation();
  //     setParkingLocation(location);
  //   } catch (error) {
  //     console.error("Error fetching parking location: ", error);
  //   }
  // }

  // handle scanned data
  useEffect(() => {
    if (scannedData !== "No result") {
      handleScannedData();
    }
  }, [scannedData]);

  // Function to handle scanned data
  async function handleScannedData() {
    try {
      // Querying the user collection for matching userId
      const userCollectionRef = collection(db, "users");
      const querySnapshot = await getDocs(
        query(userCollectionRef, where("userId", "==", scannedData))
      );

      if (querySnapshot.empty) {
        console.log("No matching documents.");
      } else {
        console.log("Matched");

        // Setting the current time
        const currentTime = getCurrentTimeFormatted();

        // Setting check-in document
        await setDoc(doc(db, "parking-time-log", "parking_location_ABC"), {
          userId: scannedData,
          checkinTime: currentTime,
        });

        // Setting scan completion state
        setScanCompleted(true);
      }
    } catch (error) {
      console.error("Error handling scanned data: ", error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-semibold text-center my-6">
        Scan your QR code here...
      </h1>
      <div className="h-[640px] w-[640px]">
        <QrScanner onDecode={(result) => setScannedData(result)} />
      </div>
      {scanCompleted && <p>Scan Completed!</p>}
    </div>
  );
}

export default QRScannerPage;
