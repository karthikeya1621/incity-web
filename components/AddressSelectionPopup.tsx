import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "../styles/AddressSelectionPopup.module.scss";
import GoogleMapReact, { Maps } from "google-map-react";
import { NEXT_PUBLIC_GOOGLE_MAPS_API } from "../utils/config";
import AppContext from "../context/AppContext";

declare var google: any;

const AddressSelectionPopup = () => {
  const searchInput = useRef(null);
  const {
    currentLocation,
    isAddressPopupVisible,
    setIsAddressPopupVisible,
    setSelectedAddress,
  } = useContext(AppContext);
  const [currentLocationData, setCurrentLocationData] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 17.385, lng: 78.4867 });
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [geocoderInstance, setGeocoderInstance] = useState<any>(null);
  const [placeData, setPlaceData] = useState<any>(null);
  const [flatInput, setFlatInput] = useState<any>(undefined);
  const [formattedAddress, setFormattedAddress] = useState("");

  useEffect(() => {
    if (currentLocation) {
      setMapCenter({
        lat: currentLocation.coords.latitude,
        lng: currentLocation.coords.longitude,
      });
    }
  }, [currentLocation]);

  useEffect(() => {
    if (mapCenter && mapInstance) {
      mapInstance.panTo(mapCenter);
    }
  }, [mapCenter]);

  useEffect(() => {
    if (geocoderInstance && !placeData && currentLocation) {
      geocoderInstance.geocode(
        {
          location: {
            lat: currentLocation.coords.latitude,
            lng: currentLocation.coords.longitude,
          },
        },
        (places: any) => {
          if (places.length && places[0].geometry.location) {
            setPlaceData(places[0]);
            setCurrentLocationData(places[0]);
          }
        }
      );
    }
  }, [geocoderInstance, currentLocation]);

  useEffect(() => {
    if (placeData) {
      const parts = [];
      if (flatInput) parts.push(flatInput);
      if (placeData.name) parts.push(placeData.name);
      if (placeData.formatted_address) parts.push(placeData.formatted_address);

      console.log(placeData);
      setFormattedAddress(parts.join(", "));
    }
  }, [placeData, flatInput]);

  const handleApiLoaded = async (map: any, maps: Maps) => {
    setMapInstance(map);
    const searchBar = new google.maps.places.Autocomplete(searchInput.current);
    searchBar.addListener("place_changed", () => {
      handlePlaceChanged(searchBar.getPlace());
    });
    const geocoder = new google.maps.Geocoder();
    setGeocoderInstance(geocoder);
  };

  const handlePlaceChanged = async (place: any) => {
    if (place && place.geometry.location) {
      setPlaceData(place);
      setMapCenter({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    }
  };

  const setCurrentLocation = () => {
    setMapCenter({
      lat: currentLocation.coords.latitude,
      lng: currentLocation.coords.longitude,
    });
    setPlaceData(currentLocationData);
    if (searchInput.current) {
      (searchInput.current as HTMLInputElement).value = "";
    }
  };

  const handleConfirmAddress = async () => {
    const addressData = {
      full_address: formattedAddress,
      flat_info: flatInput,
      ...placeData,
    };
    setSelectedAddress(addressData);
    setIsAddressPopupVisible(false);
  };

  return (
    <div className={styles.addressselectionpopup}>
      <h4
        className="text-primary font-semibold text-center cursor-pointer border-b-2 border-primary py-1 mb-1"
        onClick={() => {
          setCurrentLocation();
        }}
      >
        <span className="mdi mdi-crosshairs-gps"></span> Auto detect location
      </h4>
      <span className="my-2">or</span>
      <div className="p-3 w-full relative">
        <input
          type="text"
          placeholder="Search here..."
          ref={searchInput}
          className={styles.searchinput}
        />
      </div>
      <div className={styles.mapcontainer}>
        <div className={styles.mapbox}>
          {currentLocation && isAddressPopupVisible && (
            <GoogleMapReact
              bootstrapURLKeys={{
                key: NEXT_PUBLIC_GOOGLE_MAPS_API,
                libraries: ["places"],
              }}
              defaultCenter={{ lat: 17.385, lng: 78.4867 }}
              center={mapCenter}
              defaultZoom={16}
              yesIWantToUseGoogleMapApiInternals
              onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
              onClick={({ x, y, lat, lng, event }) => {
                if (mapInstance) {
                  setMapCenter({ lat, lng });
                  if (geocoderInstance) {
                    geocoderInstance.geocode(
                      {
                        location: { lat, lng },
                      },
                      (places: any) => {
                        if (places.length && places[0].geometry.location) {
                          setPlaceData(places[0]);
                          setCurrentLocationData(places[0]);
                        }
                      }
                    );
                  }
                }
              }}
            >
              <MapMarker lat={mapCenter.lat} lng={mapCenter.lng} />
            </GoogleMapReact>
          )}
        </div>
      </div>
      <div className={styles.flatnameinput}>
        <input
          className={`form-input rounded-md ${
            flatInput !== null && !flatInput ? styles.error : ""
          }`}
          placeholder="Flat No., Building name"
          required
          defaultValue={flatInput}
          onChange={(e) => {
            setFlatInput(e.target.value);
          }}
        />
      </div>
      <p className={styles.formattedaddress}>{formattedAddress}</p>
      <div className="px-3 w-full">
        <button
          disabled={!placeData || !flatInput}
          className="w-full button-one"
          onClick={handleConfirmAddress}
        >
          Confirm Address
        </button>
      </div>
    </div>
  );
};

const MapMarker = ({ lat, lng }: { lat: number; lng: number }) => {
  return <div className={styles.marker}></div>;
};

export default AddressSelectionPopup;
