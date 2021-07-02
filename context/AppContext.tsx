import { useRouter } from "next/dist/client/router";
import { createContext, useEffect, useState } from "react";
import { NEXT_PUBLIC_GOOGLE_MAPS_API } from "../utils/config";

const AppContext = createContext<any>({});

export const AppProvider = (props: any) => {
  const [isLoginPopupVisible, setIsLoginPopupVisible] = useState(false);
  const [isCityPopupVisible, setIsCityPopupVisible] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [isHeaderSearchVisible, setIsHeaderSearchVisible] = useState(true);

  const router = useRouter();

  useEffect(() => {
    // getCurrentLocation();
  }, []);

  useEffect(() => {
    if (document.body) {
      document.body.style.overflowY =
        isLoginPopupVisible || isCityPopupVisible ? "hidden" : "auto";
    }
  }, [isLoginPopupVisible, isCityPopupVisible]);

  const getCurrentLocation = () => {
    if (!currentLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation(position);
          getAddressFromCoords(position);
        },
        (error) => {
          console.log(error);
          setCurrentLocation(null);
        }
      );
    }
  };

  const getAddressFromCoords = async (position: GeolocationPosition) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${NEXT_PUBLIC_GOOGLE_MAPS_API}`
    );
    const data = await response.json();
    console.log(data);
  };

  return (
    <AppContext.Provider
      value={{
        isLoginPopupVisible,
        setIsLoginPopupVisible,
        isCityPopupVisible,
        setIsCityPopupVisible,
        selectedCity,
        setSelectedCity,
        isHeaderSearchVisible,
        setIsHeaderSearchVisible,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContext;
