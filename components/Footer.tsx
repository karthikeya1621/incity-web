import Link from "next/link";
import React, { useContext } from "react";
import slugify from "slugify";
import AppContext from "../context/AppContext";
import styles from "../styles/Footer.module.scss";

const Footer = () => {
  const { categories, isFooterVisible, setCategoryPopupParent } =
    useContext(AppContext);

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
                  <h6>
                    <a
                      href="https://www.google.com/maps/place/17%C2%B028'16.5%22N+78%C2%B030'34.1%22E/@17.4712667,78.507291,17z/data=!3m1!4b1!4m5!3m4!1s0x0:0x0!8m2!3d17.4712616!4d78.5094797"
                      target="_blank"
                      rel="noreferer"
                    >
                      Hyderabad,Telangana
                    </a>
                  </h6>
                </div>
              </div>

              <div className={styles.contactitem}>
                <span className="mdi mdi-email-outline"></span>
                <div>
                  <h6>
                    <a href="mailto:info@incity.in">info@incity.in</a>
                  </h6>
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
                  <React.Fragment key={`footer-cat-${category.id}`}>
                    {!category.isParent ? (
                      <Link
                        key={`footer-cat-${category.id}`}
                        passHref={true}
                        href={`/category/${slugify(category.category)}`}
                      >
                        <a
                          key={`footer-cat-${category.id}`}
                          className={styles.hreflink}
                        >
                          <span className="mdi mdi-chevron-left"></span>
                          <h6>{category.category.toLowerCase()}</h6>
                        </a>
                      </Link>
                    ) : (
                      <div
                        key={`footer-cat-${category.id}`}
                        onClick={() => {
                          setCategoryPopupParent(category.category);
                        }}
                      >
                        <a
                          key={`footer-cat-${category.id}`}
                          className={styles.hreflink}
                        >
                          <span className="mdi mdi-chevron-left"></span>
                          <h6>{category.category.toLowerCase()}</h6>
                        </a>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="col-span-4 flex text-gray-400 justify-between pt-3 border-t border-gray-600">
              <div className="text-xs">
                <Link href="/terms-conditions" passHref>
                  <a className="mr-3">Terms and Conditions</a>
                </Link>
              </div>
              <div className="text-xs">
                <Link href="/privacy-policy" passHref>
                  <a className="mr-3">Privacy Policy</a>
                </Link>
              </div>
              <div className="text-xs">
                <Link href="/refund-policy" passHref>
                  <a className="mr-3">Refund Policy</a>
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
