import React, { useState, useRef, useEffect } from "react";

const slides = [
  {
    img: "../../../public/images/hero/merchFullhouse.webp",
    link: "https://jkt48.com/news/detail/id/1932?lang=id",
    alt: "JKT48 Full House Merch",
  },
  {
    img: "../../../public/images/hero/merchFullhouse2.webp",
    link: "https://jkt48.com/news/detail/id/1932?lang=id",
    alt: "JKT48 Full House Merch",
  },
  {
    img: "../../../public/images/hero/merchFullhouse3.webp",
    link: "https://jkt48.com/news/detail/id/1932?lang=id",
    alt: "JKT48 Full House Merch",
  },
  {
    img: "../../../public/images/hero/merchFullhouse4.webp",
    link: "https://jkt48.com/news/detail/id/1932?lang=id",
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
      <h3 className="text-xl font-bold text-[#cd0c0d] mb-1 text-center mt-5">
        News JKT48 Official Merch
      </h3>
      <div className="flex justify-center items-center transition-none h-[250px] relative">
        {visibleSlides.map((slide, idx) => (
          <a
            href={slide.link}
            key={idx}
            className="min-w-[33.3333vw] w-[33.3333vw] max-w-[33.3333vw] h-[270px] flex justify-center items-center opacity-100 pointer-events-auto transition-none bg-white aspect-[4/3] overflow-hidden"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={slide.img}
              alt={slide.alt}
              className="w-full h-full max-w-[320px] max-h-[240px] object-contain rounded-none shadow-none mx-auto my-auto"
              style={{ aspectRatio: "4/3" }}
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
