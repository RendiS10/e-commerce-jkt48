import React from "react";
import styles from "./Navbar.module.css";

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>JKT48 Shop</div>
      <div className={styles["nav-links"]}>
        <div className={styles["search-container"]}>
          <input
            className={styles["search-input"]}
            type="text"
            placeholder="What are you looking for?"
          />
          <svg
            className={styles.icon}
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <a href="#" className={`${styles["nav-link"]}`}>
          Home
        </a>
        <a href="#" className={styles["nav-link"]}>
          Cek Keranjang
        </a>
        <a href="#" className={styles["nav-link"]}>
          Status Pemesanan
        </a>
        <a href="#" className={styles["nav-link"]}>
          Sign Up
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
