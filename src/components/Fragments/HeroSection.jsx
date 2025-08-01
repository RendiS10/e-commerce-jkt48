import React, { useState, useRef, useEffect } from "react";

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
    <section className="w-screen max-w-full overflow-hidden bg-white mb-6 relative">
      <div className="flex transition-none h-[270px] relative">
        {visibleSlides.map((slide, idx) => (
          <a
            href={slide.link}
            key={idx}
            className="min-w-[33.3333vw] w-[33.3333vw] h-[270px] flex justify-center items-center opacity-100 pointer-events-auto transition-none"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={slide.img}
              alt={slide.alt}
              className="w-full h-full object-cover rounded-none shadow-none"
            />
          </a>
        ))}
      </div>
      <div className="flex justify-center items-center gap-3 absolute bottom-[18px] left-0 w-full">
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={`w-3 h-3 rounded-full cursor-pointer transition-colors duration-300 ${
              idx === current ? "bg-[#cd0c0d]" : "bg-[#e0e0e0]"
            }`}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroSection;
