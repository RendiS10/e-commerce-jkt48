import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../../components/Elements/Breadcrumb";
import ProductDetailSection from "../../components/Fragments/ProductDetailSection";
import RelatedProducts from "../../components/Fragments/RelatedProducts";
import Header from "../../components/Layouts/Header";
import Navbar from "../../components/Layouts/Navbar";
import Footer from "../../components/Layouts/Footer";

function DetailProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [variants, setVariants] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Produk tidak ditemukan");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Gagal memuat produk");
        setLoading(false);
      });
    fetch(`http://localhost:5000/api/variants`)
      .then((res) => res.json())
      .then((data) => setVariants(data.filter((v) => v.product_id == id)));
  }, [id]);

  useEffect(() => {
    if (selectedSize) {
      setSelectedVariant(variants.find((v) => v.size === selectedSize));
    } else {
      setSelectedVariant(null);
    }
  }, [selectedSize, variants]);

  // Dummy related products, bisa diganti dengan fetch produk terkait
  const related = [];

  return (
    <>
      <Header />
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : product ? (
          <ProductDetailSection product={product} />
        ) : null}
      </div>
      <Footer />
    </>
  );
}

export default DetailProduct;
