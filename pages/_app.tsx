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
import "react-accessible-accordion/dist/fancy-example.css";
import dynamic from "next/dynamic";

const firebaseConfig = {
  apiKey: "AIzaSyAbCp7GIXh-pKPqTMIrcOnhpCMVqGb2tuQ",
  authDomain: "incity-web-322713.firebaseapp.com",
  projectId: "incity-web-322713",
  storageBucket: "incity-web-322713.appspot.com",
  messagingSenderId: "221427008834",
  appId: "1:221427008834:web:db4ed887e4589386e5f4db",
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

export default dynamic(() => Promise.resolve(MyApp), {
  ssr: false,
});
