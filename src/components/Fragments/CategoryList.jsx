import React, { useState } from "react";
import CategoryCard from "../Elements/CategoryCard";
import ProductList from "../Fragments/ProductList";

const categories = [
  {
    label: "JKT48 Official T-Shirts",
    icon: (
      <img
        src="../../../public/images/categories/merch-tshirt.jpg"
        alt="T-Shirts"
        className="w-[120px] h-[80px] object-contain"
      />
    ),
  },
  {
    label: "JKT48 Official Birthday T-Shirts",
    icon: (
      <img
        src="../../../public/images/categories/bdts.jpg"
        alt="Birthday T-Shirts"
        className="w-[120px] h-[80px] object-contain"
      />
    ),
  },
  {
    label: "JKT48 Official Photobook Stationery",
    icon: (
      <img
        src="../../../public/images/categories/ptbook.jpg"
        alt="Photobook"
        className="w-[120px] h-[80px] object-contain"
      />
    ),
  },
  {
    label: "JKT48 Accessories",
    icon: (
      <img
        src="../../../public/images/categories/accs.jpg"
        alt="Accessories"
        className="w-[120px] h-[80px] object-contain"
      />
    ),
  },
];

function CategoryList() {
  const [active, setActive] = useState(3);
  const [selectedCategory, setSelectedCategory] = useState(categories[3].label);

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
              key={cat.label}
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
                setSelectedCategory(cat.label);
              }}
            >
              {React.cloneElement(cat.icon, {
                className: `${cat.icon.props.className} transition-all duration-300`,
              })}
              <span className="mt-2 text-center text-sm font-semibold leading-tight transition-all duration-300">
                {cat.label}
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
