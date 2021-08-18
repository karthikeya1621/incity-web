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

const firebaseConfig = {
  apiKey: "AIzaSyCa1zXrfN5PAmAp3naT39uusq4C_YFJ2nM",
  authDomain: "incity-41669.firebaseapp.com",
  projectId: "incity-41669",
  storageBucket: "incity-41669.appspot.com",
  messagingSenderId: "778633385133",
  appId: "1:778633385133:web:dfae233f2fcdb20949e224",
  measurementId: "G-NWQ30ER095",
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
