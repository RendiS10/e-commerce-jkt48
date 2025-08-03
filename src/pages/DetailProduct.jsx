import React, { useState } from "react";
import Breadcrumb from "../components/Elements/Breadcrumb";
import ProductDetailSection from "../components/Fragments/ProductDetailSection";
import RelatedProducts from "../components/Fragments/RelatedProducts";
import Header from "../components/Layouts/Header";
import Navbar from "../components/Layouts/Navbar";
import Footer from "../components/Layouts/Footer";

const product = {
  name: "Havic HV G-92 Gamepad",
  images: [
    "/img/gamepad1.png",
    "/img/gamepad2.png",
    "/img/gamepad3.png",
    "/img/gamepad4.png",
  ],
  price: 192,
  oldPrice: null,
  rating: 4.5,
  reviews: 150,
  stock: true,
  description: "Playstation 5 Controller Skin High quality vinyl ...",
  colors: ["#e74c3c", "#34495e"],
  sizes: ["XS", "S", "M", "L", "XL"],
};

const related = [
  // ...array produk terkait, gunakan data ProductCard
];

function DetailProduct() {
  return (
    <>
      <Header />
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Breadcrumb
          items={[
            { label: "Account", href: "#" },
            { label: "Gaming", href: "#" },
            { label: product.name, active: true },
          ]}
        />
        <ProductDetailSection product={product} />
        <RelatedProducts products={related} />
      </div>
      <Footer />
    </>
  );
}

export default DetailProduct;
