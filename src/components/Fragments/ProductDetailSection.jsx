import React from "react";
import ProductImageGallery from "../Elements/ProductImageGallery";
import ProductDetailInfo from "./ProductDetailInfo";

function ProductDetailSection({ product }) {
  return (
    <div className="flex flex-col md:flex-row gap-8 mb-10">
      <ProductImageGallery images={product.images} />
      <ProductDetailInfo product={product} />
    </div>
  );
}

export default ProductDetailSection;
