import Link from "next/link";
import React, { useContext, useEffect, useRef } from "react";
import { useRouter } from "next/dist/client/router";
import PopupOverlay from "./PopupOverlay";
import LoginPopup from "./LoginPopup";
import CitySelectionPopup from "./CitySelectionPopup";
import AppContext from "../context/AppContext";
import AuthContext from "../context/AuthContext";
import Image from "next/image";
import { URLS } from "../utils/config";
import AddressSelectionPopup from "./AddressSelectionPopup";
import CategoryPopup from "./CategoryPopup";

function Header() {
  const router = useRouter();
  const {
    isLoginPopupVisible,
    setIsLoginPopupVisible,
    isCityPopupVisible,
    setIsCityPopupVisible,
    isAddressPopupVisible,
    setIsAddressPopupVisible,
    selectedCity,
    isHeaderSearchVisible,
    cartCount,
    setIsIntroDone,
    isIntroDone,
    userData,
    isBottomMenuVisible,
    breakpoints,
    categoryPopupParent,
    setCategoryPopupParent,
    isHeaderVisible,
  } = useContext(AppContext);
  const { user, logout } = useContext(AuthContext);
  const videoElem = useRef(null);

  const handleLoginButton = () => {
    setIsLoginPopupVisible(true);
  };

  useEffect(() => {
    if (isIntroDone == "false" && videoElem.current) {
      (videoElem.current as any).play();
    }
  }, [isIntroDone, videoElem]);

  return (
    <>
      {isHeaderVisible && (
        <>
          <div className="header">
            <div className="w-full max-w-screen-lg grid grid-cols-12 gap-1 h-full mx-auto px-2 md:px-0">
              <div className="col-span-3 md:col-span-2 h-full flex items-center">
                <Link href="/">
                  <div className="logo">
                    <Image
                      layout="fill"
                      alt=""
                      src="/images/logo-small.png"
                      objectFit="contain"
                      loader={URLS.getImageLoader()}
                    />
                  </div>
                </Link>
              </div>
              <div className="col-span-6 md:col-span-5 h-full flex items-center justify-center">
                <div className="searchbox">
                  <div
                    className="citylocation"
                    onClick={() => setIsCityPopupVisible(true)}
                  >
                    <span className="mdi mdi-map-marker-outline"></span>
                    <h6>{selectedCity || "Select your city"}</h6>
                  </div>
                  {((router.route == "/" && isHeaderSearchVisible) ||
                    router.route != "/") && (
                    <>
                      <div className={`searchbar`}>
                        <input type="text" placeholder="Search a service" />
                        <span className="mdi mdi-magnify"></span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="col-span-3 md:col-span-5 h-full flex items-center justify-end">
                <div className="navmenu">
                  {!(breakpoints.xs || breakpoints.sm) && (
                    <>
                      <div className="menuitem" style={{ display: "none" }}>
                        <span>Services</span>
                        <div className="submenu"></div>
                      </div>
                      <div className="menuitem">
                        <Link href="/about" passHref>
                          <a>
                            <span>About Us</span>
                          </a>
                        </Link>
                      </div>
                      <div className="menuitem">
                        <Link href={URLS.partner_url} passHref>
                          <a target="_blank">
                            <span>Partner</span>
                          </a>
                        </Link>
                      </div>
                    </>
                  )}
                  {!user && (
                    <div className="actionitem login">
                      <button
                        onClick={handleLoginButton}
                        className="button-one"
                      >
                        Login
                      </button>
                    </div>
                  )}
                  {user && (
                    <>
                      {cartCount ? (
                        <Link href="/checkout" passHref>
                          <a>
                            <div className="actionitem cart">
                              <span className="mdi mdi-cart-outline"></span>
                              {cartCount && <h6>{cartCount}</h6>}
                            </div>
                          </a>
                        </Link>
                      ) : (
                        <div className="actionitem cart">
                          <span className="mdi mdi-cart-outline"></span>
                        </div>
                      )}
                      {!breakpoints.xs && !breakpoints.sm && (
                        <div className="actionitem profile">
                          <span className="mdi mdi-account-circle-outline"></span>{" "}
                          Account
                          <div className="dropdown">
                            <ul>
                              <li className="font-semibold text-sm text-center cursor-default my-3">
                                {(userData && userData.name) ||
                                  user.displayName.split(" ")[0] ||
                                  user.phoneNumber}
                              </li>
                              <li className="border-b border-gray-300 my-3"></li>
                              <li>
                                <Link href="/bookings" passHref>
                                  <a>Bookings</a>
                                </Link>
                              </li>
                              <li>
                                <Link href="/profile" passHref>
                                  <a>Profile</a>
                                </Link>
                              </li>
                              <li className="text-red-500" onClick={logout}>
                                Logout
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="headerplaceholder"></div>
          <PopupOverlay
            visible={isCityPopupVisible}
            onClose={() => {
              setIsCityPopupVisible(false);
            }}
            enableClose={selectedCity != null}
          >
            <CitySelectionPopup />
          </PopupOverlay>
          <PopupOverlay
            visible={isLoginPopupVisible}
            onClose={() => {
              setIsLoginPopupVisible(false);
            }}
          >
            <LoginPopup />
          </PopupOverlay>
          <PopupOverlay
            visible={isAddressPopupVisible}
            onClose={() => {
              setIsAddressPopupVisible(false);
            }}
          >
            <AddressSelectionPopup />
          </PopupOverlay>
          <PopupOverlay
            visible={categoryPopupParent.length != ""}
            onClose={() => {
              setCategoryPopupParent("");
            }}
          >
            <CategoryPopup />
          </PopupOverlay>

          <div
            className={`videointro ${isIntroDone == "true" ? "done" : ""} ${
              isIntroDone == undefined ? "idle" : ""
            } ${isIntroDone == "false" ? "started" : ""}`}
          >
            <video
              ref={videoElem}
              onEnded={() => {
                console.log("Intro Played");
                setIsIntroDone("true");
                sessionStorage.setItem("isintrodone", "true");
              }}
              muted
            >
              <source src="/videos/intro.mp4"></source>
            </video>
          </div>
          {isBottomMenuVisible && (breakpoints.xs || breakpoints.sm) && (
            <div className="bottommenucontainer">
              <div className="bottommenu">
                <div
                  onClick={() => {
                    router.push("/");
                  }}
                  className={`bmenuitem ${router.pathname == "/" && "active"}`}
                >
                  <span className="mdi mdi-home-variant-outline"></span>
                  <h6>Home</h6>
                </div>
                <div
                  onClick={() => {
                    router.push("/bookings");
                  }}
                  className={`bmenuitem ${
                    router.pathname == "/bookings" && "active"
                  }`}
                >
                  <span className="mdi mdi-book-outline"></span>
                  <h6>Bookings</h6>
                </div>
                <div
                  onClick={() => {
                    router.push("/wallet");
                  }}
                  className={`bmenuitem ${
                    router.pathname == "/wallet" && "active"
                  }`}
                >
                  <span className="mdi mdi-wallet-outline"></span>
                  <h6>Wallet</h6>
                </div>
                <div
                  onClick={() => {
                    if (user) {
                      router.push("/profile");
                    } else {
                      handleLoginButton();
                    }
                  }}
                  className={`bmenuitem ${
                    router.pathname == "/profile" && "active"
                  }`}
                >
                  <span className="mdi mdi-account-outline"></span>
                  <h6>Profile</h6>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Header;
