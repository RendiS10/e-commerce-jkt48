import React from "react";
import ProductCard from "../Elements/ProductCard";

function RelatedProducts({ products }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-[#cd0c0d]">
        Related Item
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard key={p.name} {...p} />
        ))}
      </div>
    </div>
  );
}

export default RelatedProducts;
