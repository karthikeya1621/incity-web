import React, { useContext, useEffect, useState } from "react";
import AppContext from "../context/AppContext";
import AuthContext from "../context/AuthContext";
import styles from "../styles/ProfilePage.module.scss";

const ProfilePage = () => {
  const {
    userData,
    selectedAddress,
    setIsAddressPopupVisible,
    setSelectedAddress,
  } = useContext(AppContext);
  const { user, getUserData } = useContext(AuthContext);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setSelectedAddress(null);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedAddress && mounted) {
      updateAddress();
    }
  }, [selectedAddress]);

  const updateAddress = async () => {
    try {
      const response = await fetch(
        `https://admin.incity-services.com/RestApi/api/update_user/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            key: "incitykey!",
            id: userData.user_id,
            address: selectedAddress.full_address,
            latitude: selectedAddress.geometry.location.lat(),
            longitude: selectedAddress.geometry.location.lng(),
            type: "user",
          }),
        }
      );
      const result = await response.json();
      if (result.data) {
        getUserData(userData.email || null, userData.mobile || null);
      }
    } catch (err) {
      console.log("Update Address Error", err);
    }
  };

  return (
    <div className={styles.profilepage}>
      <h3 className={styles.headingone}>Profile Information</h3>

      {userData && (
        <div className={styles.profiledetails}>
          {userData.name || user.displayName ? (
            <div className={styles.detail}>
              <span className={styles.key}>Name</span>
              <span className={styles.info}>
                {userData.name || user.displayName}
              </span>
            </div>
          ) : (
            <></>
          )}
          <div className={styles.detail}>
            <span className={styles.key}>Email</span>
            <span className={styles.info}>{userData.email}</span>
          </div>

          <div className={styles.detail}>
            <span className={styles.key}>Address</span>
            <div className={styles.info}>
              <div>
                {userData && userData.address ? (
                  <>
                    <div className={styles.addresscard}>
                      <p>
                        {[
                          userData.address,
                          userData.city,
                          userData.state,
                          userData.country,
                          userData.pincode,
                        ]
                          .filter((s: any) => s)
                          .join(",")}
                      </p>
                    </div>
                    <span style={{ marginRight: "12px" }}>or</span>
                  </>
                ) : (
                  <></>
                )}
                <div>
                  <p>{selectedAddress && selectedAddress.full_address}</p>
                  <div
                    className={styles.picklocation}
                    onClick={() => {
                      setIsAddressPopupVisible(true);
                    }}
                  >
                    Update location
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
