import { createContext, useContext, useEffect, useState } from "react";
import { useAuth, useUser } from "reactfire";
import firebase from "firebase";
import AppContext from "./AppContext";
import { useRouter } from "next/dist/client/router";

const AuthContext = createContext<any>({});

export const AuthProvider = (props: any) => {
  const auth = useAuth();
  const router = useRouter();
  const { setIsLoginPopupVisible, userData, setUserData } =
    useContext(AppContext);
  const { data: user } = useUser();
  const [recaptchaVerfied, setRecaptchaVerified] = useState(false);
  const [otpConfirmResult, setOtpConfirmResult] =
    useState<firebase.auth.ConfirmationResult | null>(null);

  useEffect(() => {
    if (user && (user.email || user.phoneNumber)) {
      getUserData(user.email, user.phoneNumber?.slice(3));
    } else {
      setUserData(null);
    }
  }, [user]);

  const loginWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      const { user } = await auth.signInWithPopup(provider);
      setIsLoginPopupVisible(false);
    } catch (err) {
      console.log("Google Login Error", err);
    }
  };

  const loginWithOtp = async (mobileNumber: string) => {
    try {
      const recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
        "otp-signin",
        {
          size: "invisible",
          callback: (response: any) => {
            setRecaptchaVerified(true);
          },
        }
      );
      const result = await auth.signInWithPhoneNumber(
        mobileNumber,
        recaptchaVerifier
      );
      setOtpConfirmResult(result);
    } catch (err) {
      console.log("OTP Login Error", err);
    }
  };

  const confirmOtpCode = async (otpCode: string) => {
    try {
      if (otpConfirmResult) {
        const { user } = await otpConfirmResult.confirm(otpCode);
        setOtpConfirmResult(null);
        setIsLoginPopupVisible(false);
      }
    } catch (err) {
      console.log("OTP Confirm Error", err);
      setOtpConfirmResult(null);
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      setUserData(null);
      router.replace("/");
    } catch (err) {
      console.log("Sign out Error", err);
    }
  };

  const getUserData = async (
    email?: string | null,
    phoneNumber?: string | null
  ) => {
    try {
      const response = await fetch(
        `https://admin.incity-services.com/RestApi/api/auth/user?key=incitykey!&email=${email}&phonenumber=${phoneNumber}`
      );
      const result = await response.json();
      console.log(result);
      if (result.data) {
        setUserData(result.data);
      }
    } catch (err) {
      console.log("Fetch UserData Error", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        recaptchaVerfied,
        loginWithGoogle,
        loginWithOtp,
        confirmOtpCode,
        otpConfirmResult,
        logout,
        getUserData,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
