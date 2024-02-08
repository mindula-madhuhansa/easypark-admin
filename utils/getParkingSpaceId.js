export const getParkingSpaceId = (parkingName, latitude, longitude) => {
  const latString =
    typeof latitude === "string" ? latitude : latitude.toString();
  const longString =
    typeof longitude === "string" ? longitude : longitude.toString();

  const formattedLatitude = latString.replace(/\s/g, "").replace(".", "");
  const formattedLongitude = longString.replace(/\s/g, "").replace(".", "");

  const formattedParkingName = parkingName.toLowerCase().replace(/\s/g, "");

  const parkingSpaceId = `${formattedParkingName}_${formattedLatitude}_${formattedLongitude}`;

  return parkingSpaceId;
};
