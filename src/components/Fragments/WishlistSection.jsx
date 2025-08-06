import React from "react";
import ProductCard from "../../components/Elements/ProductCard";

function WishlistSection({ products }) {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-6">
        {products.map((p, idx) => (
          <div key={p.name} className="relative">
            {/* Discount badge */}
            {p.discount && (
              <span className="absolute left-2 top-2 bg-[#cd0c0d] text-white text-xs font-semibold px-2 py-0.5 rounded">
                -{p.discount}%
              </span>
            )}
            {/* New badge */}
            {p.isNew && (
              <span className="absolute left-2 top-2 bg-[#27c200] text-white text-xs font-semibold px-2 py-0.5 rounded">
                NEW
              </span>
            )}
            <ProductCard {...p} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default WishlistSection;
