export const getLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          resolve({ lat, lng });
        },
        () => {
          reject("Unable to retrieve your location");
        }
      );
    } else {
      reject("Geolocation not supported");
    }
  });
};
