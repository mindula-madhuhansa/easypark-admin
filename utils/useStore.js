import { create } from "zustand";

const useStore = create((set) => ({
  parkingName: "",
  address: "",
  availableSlots: 0,
  parkingRate: 0,
  parkingType: "",
  latitude: "",
  longitude: "",
  parkingImage: "",
  setParkingName: (name) => set({ parkingName: name }),
  setAddress: (address) => set({ address: address }),
  setAvailableSlots: (slots) => set({ availableSlots: slots }),
  setParkingRate: (rate) => set({ parkingRate: rate }),
  setParkingType: (parkingTypeValue) => set({ parkingType: parkingTypeValue }),
  setLatitude: (lat) => set({ latitude: lat }),
  setLongitude: (long) => set({ longitude: long }),
  setParkingImage: (img) => set({ parkingImage: img }),
}));

export default useStore;
