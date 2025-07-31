import React from "react";
import styles from "./CategoryCard.module.css";

function CategoryCard({ icon, label, active, onClick }) {
  return (
    <div
      className={active ? `${styles.card} ${styles.active}` : styles.card}
      onClick={onClick}
    >
      <div className={styles.icon}>{icon}</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
}

export default CategoryCard;
