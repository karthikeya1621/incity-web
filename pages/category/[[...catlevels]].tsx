import React, { useContext, useState, useEffect } from "react";
import styles from "../../styles/ServiceDetailsPage.module.scss";
import slugify from "slugify";
import AppContext from "../../context/AppContext";
import {
  useProviders,
  useServices,
  useSubCategs,
  useSubSubCategs,
} from "../../hooks";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import ReactTooltip from "react-tooltip";
import AuthContext from "../../context/AuthContext";

const ServiceDetailsPage = (props: any) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [category, subcategory, subsubcategory]: any = router.query
    .catlevels || [null, null, null];
  const [serviceExists, setServiceExists] = useState(true);
  const [categoryData, setCategoryData] = useState<any>(null);
  const [subCategoryData, setSubCategoryData] = useState<any>(null);
  const [subSubCategoryData, setSubSubCategoryData] = useState<any>(null);
  const { providers, selectedCity, allCategories, setIsLoginPopupVisible } =
    useContext(AppContext);
  const { userData } = useContext(AuthContext);
  const { subCategs } = useSubCategs(
    categoryData ? categoryData.id : undefined
  );
  const { subSubCategs } = useSubSubCategs(
    subCategoryData ? subCategoryData.id : undefined
  );
  const { services } = useServices(
    subSubCategoryData ? subSubCategoryData.id : undefined
  );

  useEffect(() => {
    setMounted(true);
  }, []);

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
    if (subCategs.length) {
      let subcategorydata;
      if (subcategory) {
        subcategorydata = subCategs.filter(
          (subcateg: any) =>
            slugify(subcateg.category_sub_name.trim()) === subcategory
        )[0];
      } else {
        subcategorydata = subCategs[0];
      }
      if (subcategorydata) {
        setSubCategoryData(subcategorydata);
      } else {
        setSubCategoryData(null);
        setServiceExists(false);
      }
    }
  }, [subCategs, subcategory]);

  useEffect(() => {
    if (subSubCategs.length) {
      let subsubcategorydata;
      if (subsubcategory) {
        subsubcategorydata = subSubCategs.filter(
          (subsubcateg: any) =>
            slugify(subsubcateg.category_sub_sub_name.trim()) === subsubcategory
        )[0];
      } else {
        subsubcategorydata = subSubCategs[0];
      }
      if (subsubcategorydata) {
        setSubSubCategoryData(subsubcategorydata);
      } else {
        setSubSubCategoryData(null);
        setServiceExists(false);
      }
    }
  }, [subSubCategs, subsubcategory]);

  const handleAddToCart = async (service: any) => {
    try {
      const response = await fetch(
        `https://pochieshomeservices.com/RestApi/api/cart/cartInsert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            service_price: 10,
            service_id: service.id,
            service_imgpath: service.Imageurl,
            service_name: service.service_name,
            scategory_id: service.cat_id,
            quantity: 1,
            sub_total: 10,
            total_amount: 10,
            gst: 2,
            user_id: userData.id,
            key: "incitykey!",
          }),
        }
      );
      const result = await response.json();
      console.log(result);
    } catch (err) {
      console.log("Add To Cart Error", err);
    }
  };

  return (
    <div className={styles.servicedetailspage}>
      {mounted && <ReactTooltip effect="solid" />}
      <div className={styles.servicebanner}>
        <Image
          layout="fill"
          objectFit="cover"
          src={categoryData ? categoryData.Imageurl : "/images/placeholder.gif"}
        />
      </div>
      <div className="w-full max-w-screen-lg mx-auto">
        {subCategs && (
          <div className={styles.subcats}>
            {mounted &&
              subCategs.map((subcateg) => (
                <Link
                  href={`/category/${slugify(categoryData.category)}/${slugify(
                    subcateg.category_sub_name
                  )}`}
                  key={`subcat-${subcateg.id}`}
                  passHref={true}
                >
                  <a
                    key={`subcat-${subcateg.id}`}
                    data-tip={subcateg.category_sub_name}
                    className={
                      subcateg.id == subCategoryData?.id
                        ? `${styles.subcat} ${styles.subcat_active}`
                        : `${styles.subcat}`
                    }
                  >
                    {subcateg.category_sub_name}
                  </a>
                </Link>
              ))}
          </div>
        )}

        <div className={styles.servicecontent}>
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-3">
              <div className={styles.subsubcats}>
                {mounted &&
                  subSubCategs.map((subsubcateg) => (
                    <Link
                      href={`/category/${slugify(
                        categoryData.category
                      )}/${slugify(
                        subCategoryData.category_sub_name
                      )}/${slugify(subsubcateg.category_sub_sub_name)}`}
                      key={`subsubcat-${subsubcateg.id}`}
                      passHref={true}
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
                  ))}
              </div>
            </div>
            <div className="col-span-9">
              <div className={styles.serviceslist}>
                {services.map((service: any, key) => (
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
                        />
                      </div>
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
                    </div>
                    <div className={styles.servicedetails}>
                      {mounted && (
                        <p
                          dangerouslySetInnerHTML={{ __html: service.details }}
                        ></p>
                      )}
                    </div>
                  </div>
                ))}
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
