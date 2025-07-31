import React, { useState, useRef, useEffect } from "react";
import styles from "./HeroSection.module.css";

const slides = [
  {
    img: "https://jkt48.com/images/banner.home.jkt48fullhouse.jpg",
    link: "https://www.loket.com/event/jkt48-special-concert-full-house_fbDUD",
    alt: "JKT48 Special Concert House",
  },
  {
    img: "https://jkt48.com/images/banner.home.allintour2025pb-id.jpg",
    link: "https://jkt48.com/allintour2025pb?lang=id",
    alt: "Miles & Memories of JKT48 All In Tour 2025",
  },
  {
    img: "https://jkt48.com/images/banner.fanclub2021-id.jpg",
    link: "https://jkt48.com/jtrust-bank",
    alt: "JKT48 JTrust Bank Card",
  },
  {
    img: "https://jkt48.com/images/banner.fanclub2021-id.jpg",
    link: "https://jkt48.com/jtrust-bank",
    alt: "JKT48 JTrust Bank Card",
  },
];

function HeroSection() {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef(null);

  // Animasi otomatis setiap 3 detik
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearTimeout(timeoutRef.current);
  }, [current]);

  // Hitung index slide yang akan ditampilkan (looping tanpa animasi)
  const visibleSlides = [
    slides[current],
    slides[(current + 1) % slides.length],
    slides[(current + 2) % slides.length],
  ];

  return (
    <section className={styles.hero}>
      <div className={styles.slider}>
        {visibleSlides.map((slide, idx) => (
          <a
            href={slide.link}
            key={idx}
            className={styles.slide}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={slide.img} alt={slide.alt} />
          </a>
        ))}
      </div>
      <div className={styles.dots}>
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={
              idx === current ? styles.dot + " " + styles.active : styles.dot
            }
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroSection;
