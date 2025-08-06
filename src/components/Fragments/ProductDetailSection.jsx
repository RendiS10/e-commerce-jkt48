import React from "react";
import ProductImageGallery from "../Elements/ProductImageGallery";
import ProductDetailInfo from "./ProductDetailInfo";

function ProductDetailSection({ product }) {
  // Ambil array gambar dari relasi ProductImages jika ada, fallback ke main_image
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
  } else if (product.main_image) {
    images = [
      product.main_image.startsWith("uploads/") ||
      product.main_image.startsWith("/uploads/")
        ? `http://localhost:5000/${product.main_image.replace(/^\/+/, "")}`
        : product.main_image,
    ];
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 mb-10">
      <ProductImageGallery images={images} />
      <ProductDetailInfo product={product} />
    </div>
  );
}

export default ProductDetailSection;
