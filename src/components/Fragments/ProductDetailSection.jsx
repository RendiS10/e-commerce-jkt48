import React from "react";
import ProductImageGallery from "../Elements/ProductImageGallery";
import ProductDetailInfo from "./ProductDetailInfo";

function ProductDetailSection({ product }) {
  // Ambil array gambar dari relasi ProductImages jika ada, fallback ke image_url
  let images = [];
  if (
    product.ProductImages &&
    Array.isArray(product.ProductImages) &&
    product.ProductImages.length > 0
  ) {
    images = product.ProductImages.map((imgObj) =>
      imgObj.image_path &&
      (imgObj.image_path.startsWith("uploads/") ||
        imgObj.image_path.startsWith("/uploads/"))
        ? `http://localhost:5000/${imgObj.image_path.replace(/^\/+/, "")}`
        : imgObj.image_path
    );
  } else if (product.image_url) {
    images = [product.image_url];
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 mb-10">
      <ProductImageGallery images={images} />
      <ProductDetailInfo product={product} />
    </div>
  );
}

export default ProductDetailSection;
