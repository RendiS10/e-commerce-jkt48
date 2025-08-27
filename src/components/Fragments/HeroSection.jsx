import React, { useState, useRef, useEffect } from "react";

function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const timeoutRef = useRef(null);

  // Fetch product news data from API
  useEffect(() => {
    fetchProductNews();
  }, []);

  const fetchProductNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://e-commerce-jkt48-prototype-production.up.railway.app/api/news?is_active=true"
      );
      const data = await response.json();

      if (response.ok) {
        // Sort by display_order and map to slides format
        const sortedNews = data
          .sort((a, b) => (a.display_order || 999) - (b.display_order || 999))
          .map((news) => ({
            img: news.image_highlight?.startsWith("http")
              ? news.image_highlight
              : `http://localhost:5000/${news.image_highlight}`,
            link: news.highlight_link,
            alt: news.alt_text || "JKT48 News",
            id: news.news_id,
          }));

        setSlides(sortedNews);
      } else {
        setError("Gagal memuat news");
      }
    } catch (err) {
      console.error("Error fetching product news:", err);
      setError("Terjadi kesalahan saat memuat news");
    } finally {
      setLoading(false);
    }
  };

  // Animasi otomatis setiap 3 detik
  useEffect(() => {
    if (slides.length > 0) {
      timeoutRef.current = setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
      }, 3000);
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [current, slides.length]);

  // Loading state
  if (loading) {
    return (
      <section className="w-screen max-w-full overflow-hidden bg-white mb-6 relative">
        <h3 className="text-xl font-bold text-[#cd0c0d] mb-1 text-center mt-5">
          News JKT48 Official Merch
        </h3>
        <div className="flex justify-center items-center h-[250px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cd0c0d]"></div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="w-screen max-w-full overflow-hidden bg-white mb-6 relative">
        <h3 className="text-xl font-bold text-[#cd0c0d] mb-1 text-center mt-5">
          News JKT48 Official Merch
        </h3>
        <div className="flex justify-center items-center h-[250px]">
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  // No slides available
  if (slides.length === 0) {
    return (
      <section className="w-screen max-w-full overflow-hidden bg-white mb-6 relative">
        <h3 className="text-xl font-bold text-[#cd0c0d] mb-1 text-center mt-5">
          News JKT48 Official Merch
        </h3>
        <div className="flex justify-center items-center h-[250px]">
          <p className="text-gray-500">Tidak ada news yang tersedia</p>
        </div>
      </section>
    );
  }

  // Hitung index slide yang akan ditampilkan (looping tanpa animasi)
  const visibleSlides =
    slides.length >= 3
      ? [
          slides[current],
          slides[(current + 1) % slides.length],
          slides[(current + 2) % slides.length],
        ]
      : slides;

  return (
    <section className="w-screen max-w-full overflow-hidden bg-white mb-6 relative">
      <h3 className="text-xl font-bold text-[#cd0c0d] mb-1 text-center mt-5">
        News JKT48 Official Merch
      </h3>
      <div className="flex justify-center items-center transition-none h-[250px] relative">
        {visibleSlides.map((slide, idx) => (
          <a
            href={slide.link}
            key={slide.id || idx}
            className={`${
              slides.length >= 3
                ? "min-w-[33.3333vw] w-[33.3333vw] max-w-[33.3333vw]"
                : slides.length === 2
                ? "min-w-[50vw] w-[50vw] max-w-[50vw]"
                : "min-w-[100vw] w-[100vw] max-w-[100vw]"
            } h-[270px] flex justify-center items-center opacity-100 pointer-events-auto transition-none bg-white aspect-[4/3] overflow-hidden`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={slide.img}
              alt={slide.alt}
              className="w-full h-full max-w-[320px] max-h-[240px] object-contain rounded-none shadow-none mx-auto my-auto"
              style={{ aspectRatio: "4/3" }}
              onError={(e) => {
                e.target.src = "/images/placeholder.jpg"; // Fallback image
              }}
            />
          </a>
        ))}
      </div>

      {/* Dots pagination - only show if more than 1 slide */}
      {slides.length > 1 && (
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
      )}
    </section>
  );
}

export default HeroSection;
