import "../styles/globals.scss";
import "swiper/swiper.scss";
import type { AppProps } from "next/app";
import "firebase/firestore";
import { FirebaseAppProvider } from "reactfire";
import { AuthProvider } from "../context/AuthContext";
import "../styles/Header.scss";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AppProvider } from "../context/AppContext";
import Head from "next/head";

const firebaseConfig = {
  apiKey: "AIzaSyDt4Bnz3n7SErEtHwRso5prUZKIxIYPvos",
  authDomain: "pochies-pwa.firebaseapp.com",
  projectId: "pochies-pwa",
  storageBucket: "pochies-pwa.appspot.com",
  messagingSenderId: "1045004357474",
  appId: "1:1045004357474:web:b225a89d16fcf1c8f4e63b",
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <AppProvider>
        <AuthProvider>
          <Head>
            <meta
              name="google-site-verification"
              content="F00AqoCz8W0aS4s836V5xAnZJ0UFDDtX7UX8tJDJ9gI"
            />
          </Head>
          <Header />
          <Component {...pageProps} />
          <Footer />
        </AuthProvider>
      </AppProvider>
    </FirebaseAppProvider>
  );
}
export default MyApp;
