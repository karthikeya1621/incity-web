import React, { useContext, useState, useEffect, useRef } from "react";
import styles from "../../styles/ServiceDetailsPage.module.scss";
import slugify from "slugify";
import AppContext from "../../context/AppContext";
import { useServices, useSubSubCategs } from "../../hooks";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import ReactTooltip from "react-tooltip";
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from "react-accessible-accordion";
import { useInView } from "react-intersection-observer";
import Rating from "react-rating";

const ServiceDetailsPage = (props: any) => {
  const router = useRouter();
  const { ref, inView } = useInView({ rootMargin: "50px" });
  const [isTabsFixed, setIsTabsFixed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [prevLink, setPrevLink] = useState("");
  const [nextLink, setNextLink] = useState("");
  const [category, subcategory, subsubcategory]: any = router.query
    .catlevels || [null, "", null];
  const [serviceExists, setServiceExists] = useState(true);
  const [categoryData, setCategoryData] = useState<any>(null);
  const [subSubCategoryData, setSubSubCategoryData] = useState<any>(null);
  const [subCatList, setSubCatList] = useState<any[]>([]);
  const [selectedSubCat, setSelectedSubCat] = useState(subcategory);
  const {
    providers,
    selectedCity,
    allCategories,
    setIsLoginPopupVisible,
    getCart,
    userData,
    cartData,
    setCategoryPopupParent,
    deleteCartItem,
  } = useContext(AppContext);
  const [holderHeight, setHolderHeight] = useState(90);

  const { subSubCategs, subSubCategoriesLoaded } = useSubSubCategs(
    undefined,
    categoryData ? categoryData.id : undefined
  );
  const { services } = useServices(
    subSubCategoryData ? subSubCategoryData.id : undefined,
    categoryData ? categoryData.id : undefined,
    subSubCategoriesLoaded
  );
  const subsubcatholder = useRef(null);

  useEffect(() => {
    if (subsubcatholder && subsubcatholder.current) {
      var element = subsubcatholder.current;
      setTimeout(() => {
        const clientHeight = (element as any).getBoundingClientRect().height;
        if (clientHeight > 90) {
          setHolderHeight(clientHeight || 90);
        }
      }, 1200);
    }
  }, [subsubcatholder, subSubCategs]);

  useEffect(() => {
    setCategoryPopupParent("");
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsTabsFixed(!inView);
  }, [inView]);

  useEffect(() => {
    if (allCategories && allCategories.length) {
      const categorydata = allCategories.filter(
        (cat: any) => slugify(cat.category.trim()) === category
      )[0];
      if (categorydata) {
        setCategoryData(categorydata);
      } else {
        setCategoryData(null);
        setServiceExists(false);
      }
    }
  }, [allCategories, category]);

  useEffect(() => {
    if (subSubCategs.length) {
      let subsubcategorydata: any;
      if (subsubcategory) {
        subsubcategorydata = subSubCategs.filter(
          (subsubcateg: any) =>
            slugify(subsubcateg.category_sub_sub_name.trim()) ===
              subsubcategory &&
            slugify(subsubcateg.cat_name_sub.trim()) === selectedSubCat.trim()
        )[0];
      } else {
        subsubcategorydata = subSubCategs[0];
      }

      let scList: any[] = [];
      if (subCatList.length && slugify(subCatList[0].catname) == category) {
        scList = subCatList;
      }
      subSubCategs.forEach((ssc, ind) => {
        if (
          scList.filter((sc) => ssc.cat_name_sub.trim() == sc.name.trim())
            .length == 0
        ) {
          scList.push({
            name: ssc.cat_name_sub,
            subsubcatname: ssc.category_sub_sub_name,
            active: false,
            catname: ssc.cat_name,
          });
        }
      });
      setSubCatList([...scList]);

      if (subsubcategorydata) {
        setSubSubCategoryData(subsubcategorydata);
      } else {
        setSubSubCategoryData(null);
        setServiceExists(false);
      }
    }
  }, [subSubCategs, subsubcategory, selectedSubCat]);

  useEffect(() => {
    if (
      subCatList.length > 0 &&
      subCatList.filter((sc) => sc.active).length == 0
    ) {
      const subCatBySlug = subCatList.filter(
        (sc) => slugify(sc.name) == subcategory
      );
      selectSubCat(subCatBySlug.length > 0 ? subCatBySlug[0] : subCatList[0]);
    } else if (subCatList.length > 0) {
      setSelectedSubCat(slugify(subCatList.filter((sc) => sc.active)[0].name));
    }
  }, [subCatList]);

  useEffect(() => {
    if (services.length && !subSubCategs.length) {
      let scList: any[] = [];
      if (subCatList.length && slugify(subCatList[0].catname) == category) {
        scList = subCatList;
      }
      services.forEach((serv, ind) => {
        if (
          scList.filter((sc) => serv.sub_cat_name.trim() == sc.name.trim())
            .length == 0
        ) {
          scList.push({
            name: serv.sub_cat_name,
            subsubcatname: serv.category_sub_sub_name,
            active: false,
            catname: serv.cat_name,
          });
        }
      });
      setSubCatList([...scList]);
    }
  }, [services]);

  const handleAddToCart = async (service: any) => {
    const existingData = (cartData as any[]).filter(
      (cd) => cd.iServiceId == service.id
    )[0];
    const quantity = existingData ? parseInt(existingData.iQuantity) : 0;
    try {
      const response = await fetch(
        `https://admin.incity-services.com/RestApi/api/cart/cartInsert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            service_price: parseFloat(service.price),
            service_id: service.id,
            service_imgpath: service.Imageurl,
            service_name: service.service_name,
            scategory_id: service.cat_id,
            quantity: quantity + 1,
            sub_total: parseFloat(service.price),
            total_amount: parseFloat(service.price),
            gst: 2,
            user_id: userData.user_id,
            key: "incitykey!",
          }),
        }
      );
      const result = await response.json();
      console.log(result);
      await getCart();
    } catch (err) {
      console.log("Add To Cart Error", err);
    }
  };

  const handleUpdateQuantity = async (service: any, modifier: number) => {
    const existingData = (cartData as any[]).filter(
      (cd) => cd.iServiceId == service.id
    )[0];
    const quantity = existingData ? parseInt(existingData.iQuantity) : 0;
    if (quantity + modifier === 0) {
      await deleteCartItem(parseInt(existingData.iCartId));
      return;
    }
    try {
      const response = await fetch(
        `https://admin.incity-services.com/RestApi/api/cart/cartInsert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            service_price: parseFloat(service.price),
            service_id: service.id,
            service_imgpath: service.Imageurl,
            service_name: service.service_name,
            scategory_id: service.cat_id,
            quantity: quantity + modifier,
            sub_total: parseFloat(service.price),
            total_amount: parseFloat(service.price),
            gst: 2,
            user_id: userData.user_id,
            key: "incitykey!",
          }),
        }
      );
      const result = await response.json();
      console.log(result);
      await getCart();
    } catch (err) {
      console.log("Add To Cart Error", err);
    }
  };

  const selectSubCat = (subcat: any) => {
    const subcats = subCatList.map((sc: any) => {
      if (subcat.name == sc.name) {
        return {
          name: sc.name,
          active: true,
          subsubcatname: sc.subsubcatname,
          catname: sc.catname,
        };
      }
      return {
        name: sc.name,
        active: false,
        subsubcatname: sc.subsubcatname,
        catname: sc.catname,
      };
    });
    setSubCatList(subcats);
    if (slugify(subcat.name) !== subcategory) {
      router.push(
        `${category}/${slugify(subcat.name)}/${
          subcat.subsubcatname ? slugify(subcat.subsubcatname) : ""
        }`
      );
    }
  };

  return (
    <div className={styles.servicedetailspage}>
      {mounted && <ReactTooltip effect="solid" />}
      <div ref={ref} className={styles.servicebanner}>
        <div className="grid grid-cols-12 gap-2 h-full">
          <div className="col-span-12 h-full relative">
            <Image
              layout="fill"
              objectFit="cover"
              src={
                categoryData ? categoryData.Imageurl : "/images/placeholder.gif"
              }
            />
            <div className={styles.categorydetails}>
              <h1>{categoryData?.category}</h1>
              <p>{categoryData?.descriptions}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full max-w-screen-lg mx-auto">
        <div className={styles.servicecontent}>
          <div className="grid grid-cols-12 gap-1">
            <div className="col-span-12 relative">
              <div className={styles.subcatsholder}>
                {subCatList.map((sc: any, sci) => (
                  <div
                    onClick={() => {
                      if (!sc.active) {
                        selectSubCat(sc);
                      }
                    }}
                    key={`sc-${sci}`}
                    className={`${styles.subcatitem} ${
                      sc.active ? styles.subcatitem_active : ""
                    }`}
                  >
                    <input type="radio" readOnly={true} checked={sc.active} />{" "}
                    <span>{sc.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="col-span-12 relative"
              ref={subsubcatholder}
              style={{
                height: holderHeight > 90 ? `${holderHeight}px` : "unset",
              }}
            >
              <div
                className={
                  !isTabsFixed
                    ? styles.subsubcatsholder
                    : `${styles.subsubcatsholder} ${styles.subsubcatsholder_fixed}`
                }
              >
                <div className={styles.subsubcats}>
                  {mounted &&
                    subSubCategs.map((subsubcateg, ssci) => (
                      <React.Fragment key={`sc-${ssci}`}>
                        {subCatList.filter((sc) => sc.active).length &&
                        subCatList.filter((sc) => sc.active)[0].name ==
                          subsubcateg.cat_name_sub ? (
                          <Link
                            href={`/category/${slugify(
                              categoryData.category
                            )}/${selectedSubCat}/${slugify(
                              subsubcateg.category_sub_sub_name
                            )}`}
                            key={`subsubcat-${subsubcateg.id}`}
                            passHref={true}
                            scroll={false}
                          >
                            <a
                              key={`subsubcat-${subsubcateg.id}`}
                              data-tip={subsubcateg.category_sub_sub_name}
                              className={
                                subsubcateg.id != subSubCategoryData?.id
                                  ? `${styles.subsubcat}`
                                  : `${styles.subsubcat} ${styles.subsubcat_active}`
                              }
                            >
                              {subsubcateg.category_sub_sub_name}
                            </a>
                          </Link>
                        ) : (
                          <></>
                        )}
                      </React.Fragment>
                    ))}
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-7">
              <div className={styles.serviceslist}>
                {services
                  .filter(
                    (service: any) =>
                      subSubCategs.length > 0 ||
                      slugify(service.sub_cat_name) == selectedSubCat
                  )
                  .map((service: any, key) => (
                    <div key={`service-${key}`} className={styles.servicecard}>
                      <div>
                        <div className={styles.serviceimg}>
                          <Image
                            layout="fill"
                            objectFit="cover"
                            src={
                              service.Imageurl
                                ? service.Imageurl
                                : "/images/placeholder.gif"
                            }
                            placeholder="blur"
                            blurDataURL="/images/placeholder.gif"
                          />
                        </div>
                        {cartData.filter(
                          (cd: any) =>
                            cd.iServiceId == service.id &&
                            parseInt(cd.iQuantity)
                        ).length ? (
                          <div className={styles.counter}>
                            <button
                              onClick={() => {
                                handleUpdateQuantity(service, -1);
                              }}
                            >
                              -
                            </button>
                            <span>
                              {
                                cartData.filter(
                                  (cd: any) => cd.iServiceId == service.id
                                )[0].iQuantity
                              }
                            </span>
                            <button
                              onClick={() => {
                                handleUpdateQuantity(service, 1);
                              }}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            className="button-one"
                            onClick={() => {
                              if (userData) {
                                handleAddToCart(service);
                              } else {
                                setIsLoginPopupVisible(true);
                              }
                            }}
                          >
                            Add to Cart
                          </button>
                        )}
                      </div>
                      <div className={styles.serviceinfo}>
                        <h4>{service.service_name}</h4>
                        <div className={styles.priceinfo}>
                          {service.price && (
                            <span className={styles.newprice}>
                              ₹{service.price}
                            </span>
                          )}
                          {service.old_price && (
                            <span className={styles.oldprice}>
                              <s>₹{service.old_price}</s>
                            </span>
                          )}
                        </div>
                        <Rating
                          readonly
                          initialRating={service.rate || 0}
                          start={0}
                          stop={5}
                          fullSymbol={
                            <>
                              <span className="mdi mdi-star text-yellow-400"></span>
                            </>
                          }
                          emptySymbol={
                            <>
                              <span className="mdi mdi-star-outline text-yellow-400"></span>
                            </>
                          }
                        />
                      </div>
                      <div className={styles.servicedetails}>
                        {mounted && (
                          <p
                            dangerouslySetInnerHTML={{
                              __html: service.details,
                            }}
                          ></p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="col-span-12 md:col-span-5">
              <div className={styles.accordioncontainer}>
                {mounted && (
                  <Accordion allowZeroExpanded={true}>
                    <AccordionItem>
                      <AccordionItemHeading>
                        <AccordionItemButton>How it works?</AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p>
                          Exercitation in fugiat est ut ad ea cupidatat ut in
                          cupidatat occaecat ut occaecat consequat est minim
                          minim esse tempor laborum consequat esse adipisicing
                          eu reprehenderit enim.
                        </p>
                      </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem>
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          Is free will real or just an illusion?
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p>
                          In ad velit in ex nostrud dolore cupidatat consectetur
                          ea in ut nostrud velit in irure cillum tempor laboris
                          sed adipisicing eu esse duis nulla non.
                        </p>
                      </AccordionItemPanel>
                    </AccordionItem>
                  </Accordion>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;

export async function getStaticProps(context: any) {
  const { catlevels } = context.params;
  return {
    props: {
      catlevels,
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
