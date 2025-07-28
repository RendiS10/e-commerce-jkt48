import React from "react";
import Navbar from "./Navbar.jsx";
import styles from "./Header.module.css";

function Announce() {
  return (
    <div className={styles.announce}>
      <p>Selamat datang di Web JKT48 Shop Official ! Enjoy your shopping</p>
    </div>
  );
}

function Header() {
  return (
    <header>
      <Announce />
      <Navbar />
    </header>
  );
}
export default Header;
