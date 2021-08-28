import Link from "next/link";
import Image from "next/image";
import React, { useContext } from "react";
import slugify from "slugify";
import AppContext from "../context/AppContext";
import styles from "../styles/CategoryPopup.module.scss";

const CategoryPopup = () => {
  const { categoryPopupParent, allCategories } = useContext(AppContext);

  return (
    <div className={styles.categorypopup}>
      <div className={styles.categlist}>
        {allCategories.map((category: any, index: number) => (
          <>
            {category.category.toLowerCase() !=
              category.parent_name.toLowerCase() &&
            category.parent_name.trim() == categoryPopupParent ? (
              <Link
                href={`/category/${slugify(category.category)}`}
                passHref
                key={`cat${index + 1}`}
              >
                <a key={`cat${index + 1}`} className={styles.service}>
                  <div className={styles.serviceimg}>
                    <Image
                      objectFit="contain"
                      width={48}
                      height={48}
                      src={
                        category.Iconurl ||
                        "https://img.icons8.com/nolan/64/plumbing.png"
                      }
                      alt=""
                    />
                  </div>
                  <span>{category.category.toLowerCase()}</span>
                </a>
              </Link>
            ) : (
              <></>
            )}
          </>
        ))}
      </div>
    </div>
  );
};

export default CategoryPopup;
