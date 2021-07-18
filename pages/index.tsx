import Head from "next/head";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import AppContext from "../context/AppContext";
import styles from "../styles/Home.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { URLS } from "../utils/config";

export default function Home() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { ref, inView } = useInView();
  const { setIsHeaderSearchVisible, categories } = useContext(AppContext);

  useEffect(() => {
    setIsHeaderSearchVisible(!inView);
  }, [inView]);

  return (
    <div id="main">
      <Head>
        <title>InCity</title>
        <meta name="description" content="Services at your doorstep." />
      </Head>
      <div ref={ref} className={styles.herobanner}>
        <div className={styles.img}>
          <Image
            layout="fill"
            objectFit="cover"
            alt=""
            src="images/hero-banner.jpeg"
            loader={URLS.getImageLoader()}
          />
        </div>
        <div className={styles.dummy}></div>
        <div className="mx-auto max-w-screen-lg">
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
                  } ${categories.length <= 6 && styles.servicescard_minified}`}
                >
                  {(categories as any[]).map((category, index) => (
                    <div key={`cat${index + 1}`} className={styles.service}>
                      <div className={styles.serviceimg}>
                        <Image
                          width={48}
                          height={48}
                          objectFit="contain"
                          src="https://img.icons8.com/nolan/64/plumbing.png"
                          alt=""
                        />
                      </div>
                      <span>{category.category}</span>
                    </div>
                  ))}
                  <div className="ml-auto"></div>
                  {categories.length > 12 && (
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
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Best Deals */}
      <div className={styles.dealscontainer}>
        <h2>Best Deals</h2>
        <div className={styles.sliderone}>
          <Swiper spaceBetween={12} slidesPerView={4}>
            <SwiperSlide>
              <div className={styles.dealbox}>
                <div className={styles.dealcard}>
                  <h5>25% Off</h5>
                  <span>on Electrical Services</span>
                  <small></small>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className={styles.dealbox}>
                <div className={styles.dealcard}>
                  <h5>25% Off</h5>
                  <span>on Electrical Services</span>
                  <small></small>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className={styles.dealbox}>
                <div className={styles.dealcard}>
                  <h5>25% Off</h5>
                  <span>on Electrical Services</span>
                  <small></small>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className={styles.dealbox}>
                <div className={styles.dealcard}>
                  <h5>25% Off</h5>
                  <span>on Electrical Services</span>
                  <small></small>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className={styles.dealbox}>
                <div className={styles.dealcard}>
                  <h5>25% Off</h5>
                  <span>on Electrical Services</span>
                  <small></small>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>

      {/* Popular Services */}
      <div className={styles.popularcontainer} style={{ display: "none" }}>
        <h2>Popular Services</h2>
        <div className={styles.sliderone}>
          <Swiper spaceBetween={12} slidesPerView={4}>
            <SwiperSlide>
              <div className={styles.servicebox}>
                <div className={styles.servicecard}>
                  <h5>25% Off</h5>
                  <span>on Electrical Services</span>
                  <small></small>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className={styles.dealbox}>
                <div className={styles.dealcard}>
                  <h5>25% Off</h5>
                  <span>on Electrical Services</span>
                  <small></small>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className={styles.dealbox}>
                <div className={styles.dealcard}>
                  <h5>25% Off</h5>
                  <span>on Electrical Services</span>
                  <small></small>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className={styles.dealbox}>
                <div className={styles.dealcard}>
                  <h5>25% Off</h5>
                  <span>on Electrical Services</span>
                  <small></small>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className={styles.dealbox}>
                <div className={styles.dealcard}>
                  <h5>25% Off</h5>
                  <span>on Electrical Services</span>
                  <small></small>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>

      {/* Contact Us */}
      <div className={styles.contactuscontainer}>
        <div className="grid grid-cols-2 gap-2 w-full max-w-screen-lg mx-auto">
          <div className="col-span-1 flex justify-start">
            <div className={styles.locationmap}>
              <h2>Our Location</h2>
              <div className={styles.mapbox}></div>
            </div>
          </div>
          <div className="col-span-1 flex justify-end">
            <div className={styles.contactusform}>
              <h2>Contact Us</h2>
              <form>
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-1">
                    <div className="formgroup">
                      <label>Email</label>
                      <input className="form-input" type="email" />
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="formgroup">
                      <label>Name</label>
                      <input className="form-input" type="text" />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="formgroup">
                      <label>Message</label>
                      <textarea className="form-textarea" rows={6}></textarea>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="buttongroup">
                      <button
                        className="button-one"
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
