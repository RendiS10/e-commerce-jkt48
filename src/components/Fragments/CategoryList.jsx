import React, { useState } from "react";
import CategoryCard from "../Elements/CategoryCard";
import ProductList from "../Fragments/ProductList";
import styles from "./CategoryList.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShirt,
  faLaptop,
  faClock,
  faCamera,
  faHeadphones,
  faGamepad,
} from "@fortawesome/free-solid-svg-icons";

const categories = [
  {
    label: "JKT48 Official T-Shirts",
    icon: <FontAwesomeIcon icon={faShirt} size="1x" />,
  },
  {
    label: "JKT48 Official Birthday T-Shirts",
    icon: <FontAwesomeIcon icon={faShirt} size="1x" />,
  },
  {
    label: "JKT48 Official Photobook Stationery",
    icon: <FontAwesomeIcon icon={faLaptop} size="1x" />,
  },
  {
    label: "JKT48 Accessories",
    icon: <FontAwesomeIcon icon={faCamera} size="1x" />,
  },
];

function CategoryList() {
  const [active, setActive] = useState(3);

  return (
    <>
      <section className={styles.section}>
        <div className={styles.header}>
          <span className={styles.badge}>Cari Merch Yang Anda Inginkan</span>
        </div>
        <div className={styles.list}>
          {categories.map((cat, idx) => (
            <CategoryCard
              key={cat.label}
              icon={cat.icon}
              label={cat.label}
              active={active === idx}
              onClick={() => setActive(idx)}
            />
          ))}
        </div>
      </section>
      <ProductList />
    </>
  );
}

export default CategoryList;
