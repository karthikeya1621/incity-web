import { useRouter } from "next/dist/client/router";
import { createContext, useContext, useEffect, useState } from "react";
import { NEXT_PUBLIC_GOOGLE_MAPS_API } from "../utils/config";
import { useCities, useProviders } from "../hooks";
import AuthContext from "./AuthContext";
import { useBreakpoints } from "react-breakpoints-hook";

const AppContext = createContext<any>({});

export const AppProvider = (props: any) => {
  const breakpoints = useBreakpoints({
    xs: { min: 0, max: 360 },
    sm: { min: 361, max: 960 },
    md: { min: 961, max: 1400 },
    lg: { min: 1401, max: null },
  });
  const [userData, setUserData] = useState<any>(null);
  const [cartData, setCartData] = useState<any[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [isLoginPopupVisible, setIsLoginPopupVisible] = useState(false);
  const [isCityPopupVisible, setIsCityPopupVisible] = useState(false);
  const [isAddressPopupVisible, setIsAddressPopupVisible] = useState(false);
  const [categoryPopupParent, setCategoryPopupParent] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [isHeaderSearchVisible, setIsHeaderSearchVisible] = useState(true);
  const [isBottomMenuVisible, setIsBottomMenuVisible] = useState(true);
  const [isFirstVisit, setIsFirstVisit] = useState<any>(undefined);
  const [isIntroDone, setIsIntroDone] = useState<any>(undefined);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isFooterVisible, setIsFooterVisible] = useState(true);
  const { providers, categories, allCategories } = useProviders({
    city: selectedCity,
  });

  const router = useRouter();

  const { cities } = useCities();

  useEffect(() => {
    const isvisited = localStorage.getItem("isvisited");
    if (isvisited == "true") {
      setIsFirstVisit("false");
    } else {
      setIsFirstVisit("true");
      localStorage.setItem("isvisited", "true");
    }

    const isintrodone = sessionStorage.getItem("isintrodone");
    if (isintrodone == "true") {
      setIsIntroDone("true");
    } else if (!isintrodone) {
      setIsIntroDone("false");
    } else {
      setIsIntroDone(undefined);
    }

    if (localStorage.getItem("selectedcity")) {
      setIsCityPopupVisible(false);
      setSelectedCity(localStorage.getItem("selectedcity"));
    } else {
      setIsCityPopupVisible(true);
    }
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (document.body) {
      document.body.style.overflowY =
        isLoginPopupVisible || isCityPopupVisible || isAddressPopupVisible
          ? "hidden"
          : "auto";
    }
  }, [isLoginPopupVisible, isCityPopupVisible]);

  useEffect(() => {
    if (router.query.view && router.query.view == "content") {
      setIsHeaderVisible(false);
      setIsFooterVisible(false);
      setTimeout(() => {
        if (document.body) document.body.style.overflowY = "auto";
      }, 2000);
    } else {
      setIsHeaderVisible(true);
      setIsFooterVisible(true);
    }
  }, [router.query]);

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

  const getCart = async () => {
    if (userData && userData.user_id) {
      try {
        const response = await fetch(
          `https://admin.incity-services.com/RestApi/api/cart/cartList?key=incitykey!&user_id=${userData.user_id}`
        );
        const result = await response.json();
        if (result.data) {
          setCartData(
            result.data.length
              ? result.data.filter((ci: any) => parseInt(ci.iQuantity))
              : []
          );
        } else {
          setCartData([]);
        }
      } catch (err) {
        console.log("Get Cart Error", err);
      }
    }
  };

  useEffect(() => {
    getCart();
  }, [userData]);

  useEffect(() => {
    if (cartData.length) {
      const cartItems = cartData
        .map((cd) => parseInt(cd.iQuantity))
        .reduce((total: number, num: number) => total + num, 0);
      setCartCount(cartItems);
      console.log(cartData);
    }
  }, [cartData]);

  return (
    <AppContext.Provider
      value={{
        isLoginPopupVisible,
        setIsLoginPopupVisible,
        isCityPopupVisible,
        setIsCityPopupVisible,
        isAddressPopupVisible,
        setIsAddressPopupVisible,
        selectedCity,
        setSelectedCity,
        isHeaderSearchVisible,
        setIsHeaderSearchVisible,
        providers,
        categories,
        allCategories,
        getCart,
        userData,
        setUserData,
        cartData,
        cartCount,
        currentLocation,
        selectedAddress,
        setSelectedAddress,
        setIsIntroDone,
        isIntroDone,
        breakpoints,
        isBottomMenuVisible,
        setIsBottomMenuVisible,
        categoryPopupParent,
        setCategoryPopupParent,
        isHeaderVisible,
        isFooterVisible,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContext;
