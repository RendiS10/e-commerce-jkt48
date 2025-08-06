import React, { useState, useEffect } from "react";
import CategoryCard from "../Elements/CategoryCard";
import ProductList from "../Fragments/ProductList";

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [active, setActive] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setSelectedCategory(data[0]?.category_name || "");
        setLoading(false);
      })
      .catch(() => {
        setError("Gagal memuat kategori");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 py-8">{error}</div>;

  // Icon mapping (optional):
  const iconMap = [
    "/images/categories/merch-tshirt.jpg",
    "/images/categories/bdts.jpg",
    "/images/categories/ptbook.jpg",
    "/images/categories/accs.jpg",
  ];

  return (
    <>
      <section className="mt-10 flex flex-col justify-center items-center gap-4">
        <div className="flex items-center justify-between mb-6">
          <span className="text-[#cd0c0d] font-semibold text-base bg-[#ffeaea] rounded-lg py-[6px] px-4 mr-4">
            Cari Merch Yang Anda Inginkan
          </span>
        </div>
        <div className="flex flex-wrap gap-6 items-start justify-center">
          {categories.map((cat, idx) => (
            <div
              key={cat.category_id}
              className={`w-[220px] h-[200px] flex flex-col items-center justify-center border border-gray-200 rounded-lg bg-white shadow-sm transition-all duration-300 cursor-pointer group${
                active === idx ? " ring-2 ring-[#cd0c0d]" : ""
              }`}
              style={{ boxShadow: undefined }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = "0 4px 24px 0 #ffeaea")
              }
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "")}
              onClick={() => {
                setActive(idx);
                setSelectedCategory(cat.category_name);
              }}
            >
              <img
                src={iconMap[idx % iconMap.length]}
                alt={cat.category_name}
                className="w-[120px] h-[80px] object-contain transition-all duration-300"
              />
              <span className="mt-2 text-center text-sm font-semibold leading-tight transition-all duration-300">
                {cat.category_name}
              </span>
            </div>
          ))}
        </div>
      </section>
      <ProductList category={selectedCategory} />
    </>
  );
}

export default CategoryList;
