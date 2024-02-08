import { getLocation } from "@/utils/getLocation";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import React, { useEffect } from "react";
import useStore from "@/utils/useStore";

function Map() {
  const { latitude, longitude, setLatitude, setLongitude } = useStore();

  useEffect(() => {
    getLocation()
      .then(({ lat, lng }) => {
        setLatitude(lat);
        setLongitude(lng);
      })
      .catch((error) => {
        console.error("Error getting user's location:", error);
      });
  }, []);

  const containerStyle = {
    width: "480px",
    height: "600px",
  };

  const center = {
    lat: latitude || 6.586224130521862,
    lng: longitude || 79.97086002113106,
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const handleClick = (event) => {
    const clickedLat = event.latLng.lat();
    const clickedLng = event.latLng.lng();
    useStore.setState({ latitude: clickedLat.toString() });
    useStore.setState({ longitude: clickedLng.toString() });
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={4}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onClick={handleClick}
    ></GoogleMap>
  ) : null;
}

export default React.memo(Map);
