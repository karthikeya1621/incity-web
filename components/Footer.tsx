import Link from "next/link";
import React, { useContext } from "react";
import AppContext from "../context/AppContext";
import styles from "../styles/Footer.module.scss";

const Footer = () => {
  const { categories, isFooterVisible } = useContext(AppContext);

  return (
    <>
      {isFooterVisible && (
        <footer className={styles.footer}>
          <div className="grid grid-cols-4 md:gap-4 gap-0 w-full max-w-screen-lg mx-auto">
            <div className="md:col-span-1 col-span-4 px-4 md:px-0 mb-6">
              <h4>Contact Us</h4>
              <div className={styles.contactitem}>
                <span className="mdi mdi-cellphone"></span>
                <div>
                  <strong>+910000000000</strong>
                  <h6>Support 24/7 Weekdays</h6>
                </div>
              </div>

              <div className={styles.contactitem}>
                <span className="mdi mdi-map-marker-outline"></span>
                <div>
                  <h6>Hyderabad,Telangana</h6>
                </div>
              </div>

              <div className={styles.contactitem}>
                <span className="mdi mdi-email-outline"></span>
                <div>
                  <h6>info@incity.in</h6>
                </div>
              </div>

              <div className={styles.contactitem}>
                <span className="mdi mdi-clock-outline"></span>
                <div>
                  <h6>Weekdays, 09:00 am - 06:00 pm</h6>
                </div>
              </div>
            </div>

            <div className="md:col-span-3 md:pl-6 col-span-4 px-4">
              <h4>Our Services</h4>
              <div className={styles.serviceslist}>
                {categories.map((category: any) => (
                  <Link
                    key={`footer-cat-${category.id}`}
                    passHref={true}
                    href={`/category/${category.link}`}
                  >
                    <a
                      key={`footer-cat-${category.id}`}
                      className={styles.hreflink}
                    >
                      <span className="mdi mdi-chevron-left"></span>
                      <h6>{category.category}</h6>
                    </a>
                  </Link>
                ))}
              </div>
            </div>

            <div className="col-span-4 flex text-gray-400 justify-between pt-3 border-t border-gray-600">
              <div className="text-xs">
                <Link href="/terms-conditions" passHref>
                  <a className="mr-3">Terms and Conditions</a>
                </Link>
              </div>
              <div>
                <Link href="https://www.facebook.com/incityservices" passHref>
                  <a className="mr-3">
                    <span className="mdi mdi-facebook"></span>
                  </a>
                </Link>
                <Link
                  href="https://youtube.com/channel/UCY1WcTGic290U7AC0ft_URg"
                  passHref
                >
                  <a className="mr-3">
                    <span className="mdi mdi-youtube"></span>
                  </a>
                </Link>
                <Link
                  href="https://www.linkedin.com/in/incity-services-3ba973211"
                  passHref
                >
                  <a className="mr-3">
                    <span className="mdi mdi-linkedin"></span>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </footer>
      )}
    </>
  );
};

export default Footer;
