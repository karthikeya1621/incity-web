import Head from "next/head";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import AppContext from "../context/AppContext";
import styles from "../styles/Home.module.scss";

export default function Home() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { ref, inView } = useInView();
  const { setIsHeaderSearchVisible } = useContext(AppContext);

  useEffect(() => {
    setIsHeaderSearchVisible(!inView);
  }, [inView]);

  return (
    <div id="main">
      <div ref={ref} className={styles.herobanner}>
        <div className={styles.img}>
          <Image
            layout="fill"
            objectFit="cover"
            alt=""
            src="/images/hero-banner.jpeg"
          />
        </div>
        <div className={styles.dummy}></div>
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-12">
            <div className="col-span-12">
              <div className={styles.searchbox}>
                <div className={styles.searchbar}>
                  <input type="text" placeholder="Search a service" />
                  <span className="mdi mdi-magnify"></span>
                </div>
                <small>
                  Example: Saloon for women, Electricians, Pest Control etc
                </small>
              </div>
            </div>
            <div className="col-span-12">
              <div className={styles.servicesbox}>
                <div
                  className={`${styles.servicescard} ${
                    isExpanded && styles.servicescard_expand
                  }`}
                >
                  {Array.from({ length: 20 }).map((category: any, index) => (
                    <div key={`cat${index + 1}`} className={styles.service}>
                      <Image
                        width={48}
                        height={48}
                        objectFit="contain"
                        src="https://img.icons8.com/nolan/64/plumbing.png"
                        alt=""
                      />
                      <span>Category {index + 1}</span>
                    </div>
                  ))}
                  <div className="ml-auto"></div>
                  <button
                    className={styles.expandbtn}
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    See {isExpanded ? "less" : "more"}{" "}
                    <span
                      className={`mdi mdi-chevron-${
                        isExpanded ? "up" : "down"
                      }`}
                    ></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: "1000px" }}></div>
    </div>
  );
}
