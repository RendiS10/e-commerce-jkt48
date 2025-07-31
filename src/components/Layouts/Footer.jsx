import React from "react";
import styles from "./Footer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.container}>
      <div className={styles.logo}>JKT48 Shop</div>
      <div className={styles.socials}>
        <a
          href="https://instagram.com/jkt48"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <FontAwesomeIcon
            icon={faInstagram}
            size="lg"
            style={{ color: "#fff" }}
          />
        </a>
        <a
          href="https://twitter.com/jkt48"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
        >
          <FontAwesomeIcon
            icon={faTwitter}
            size="lg"
            style={{ color: "#fff" }}
          />
        </a>
        <a
          href="https://youtube.com/jkt48"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube"
        >
          <FontAwesomeIcon
            icon={faYoutube}
            size="lg"
            style={{ color: "#ff2b2b" }}
          />
        </a>
      </div>
      <div className={styles.copyright}>
        &copy; {new Date().getFullYear()} JKT48 Shop. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
