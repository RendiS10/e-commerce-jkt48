import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => (
  <footer className="bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] text-white pt-8 pb-4 text-center font-poppins shadow-[0_-2px_16px_rgba(0,0,0,0.05)]">
    <div className="max-w-[900px] mx-auto flex flex-col items-center gap-4">
      <div className="text-[1.5rem] font-bold tracking-wider mb-2">
        JKT48 Shop
      </div>
      <div className="flex gap-6 mb-2">
        <a
          href="https://instagram.com/jkt48"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="transition-colors transition-transform duration-200 text-white text-[1.4rem] hover:text-[#ffe082] hover:scale-110"
        >
          <FontAwesomeIcon icon={faInstagram} size="lg" />
        </a>
        <a
          href="https://twitter.com/jkt48"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
          className="transition-colors transition-transform duration-200 text-white text-[1.4rem] hover:text-[#ffe082] hover:scale-110"
        >
          <FontAwesomeIcon icon={faTwitter} size="lg" />
        </a>
        <a
          href="https://youtube.com/jkt48"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube"
          className="transition-colors transition-transform duration-200 text-[#ff2b2b] text-[1.4rem] hover:text-[#ffe082] hover:scale-110"
        >
          <FontAwesomeIcon icon={faYoutube} size="lg" />
        </a>
      </div>
      <div className="text-[0.95rem] opacity-80">
        &copy; {new Date().getFullYear()} JKT48 Shop. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
