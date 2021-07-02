import React, { useContext, useEffect, useState } from "react";
import styles from "../styles/LoginPopup.module.scss";
import PhoneInput from "react-phone-input-2";
import OtpInput from "react-otp-input";
import "react-phone-input-2/lib/style.css";
import AuthContext from "../context/AuthContext";
import Image from "next/image";

const LoginPopup = () => {
  const [mobileNo, setMobileNo] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const { loginWithGoogle, loginWithOtp, otpConfirmResult, confirmOtpCode } =
    useContext(AuthContext);

  useEffect(() => {
    if (!otpConfirmResult) {
      setOtpCode("");
    }
  }, [otpConfirmResult]);

  return (
    <div className={styles.loginpopup}>
      <div className="w-full flex flex-col items-center justify-between">
        <button className={styles.googlesignin} onClick={loginWithGoogle}>
          <span className={styles.img}>
            <Image
              objectFit="contain"
              width={20}
              height={20}
              src="https://img.icons8.com/color/48/000000/google-logo.png"
              alt=""
            />
          </span>{" "}
          Login with Google
        </button>
        <div className={styles.divider}></div>
        <div id="otp-signin" style={{ display: "none" }}></div>
        {!otpConfirmResult && (
          <>
            <div className={styles.otpform}>
              <h3>Login with mobile</h3>
              <PhoneInput
                country={"in"}
                onlyCountries={["in"]}
                disableDropdown={true}
                countryCodeEditable={false}
                value={mobileNo}
                onChange={(phone) => {
                  setMobileNo(phone);
                }}
              />
              <small>You will receive an OTP to this number.</small>
              <button
                disabled={mobileNo.length < 12}
                onClick={() => {
                  loginWithOtp(`+${mobileNo}`);
                }}
                className="sendotp button-one mt-8 w-full"
              >
                Send OTP
              </button>
            </div>
          </>
        )}

        {otpConfirmResult && (
          <>
            <div className={styles.otpform}>
              <h3>Enter your OTP</h3>
              <OtpInput
                value={otpCode}
                numInputs={6}
                separator={<span>-</span>}
                onChange={(otp: string) => {
                  setOtpCode(otp);
                }}
              />
              <button
                disabled={otpCode.length < 6}
                onClick={() => {
                  confirmOtpCode(`${otpCode}`);
                }}
                className="verifyotp button-one mt-8 w-full"
              >
                Verify &amp; Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPopup;
