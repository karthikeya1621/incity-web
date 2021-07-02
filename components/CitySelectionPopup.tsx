import React, { useContext } from "react";
import styles from "../styles/CitySelectionPopup.module.scss";
import Image from "next/image";
import AppContext from "../context/AppContext";

const CitySelectionPopup = () => {
  const cities = ["Hyderabad", "Warangal"];
  const { setSelectedCity, setIsCityPopupVisible, selectedCity } =
    useContext(AppContext);

  const selectCity = (city: string) => {
    if (city) {
      setSelectedCity(city);
      setIsCityPopupVisible(false);
    }
  };

  return (
    <div className={styles.cityselectionpopup}>
      <div className="py-5 text-center">
        <div className="prose">
          <h3>Select your city</h3>
        </div>
        <div className="flex mt-5 mb-3">
          {cities.map((city, index) => (
            <div
              onClick={() => selectCity(city)}
              key={`city${index}`}
              className={`${styles.city} ${
                city == selectedCity && styles.city_selected
              }`}
            >
              <Image
                className={styles.img}
                src={`/images/${city}.png`}
                width={100}
                height={100}
              />
              <span>{city}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CitySelectionPopup;
