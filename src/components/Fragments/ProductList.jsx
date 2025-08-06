import React, { useEffect, useState } from "react";
import ProductCard from "../Elements/ProductCard";

function ProductList({ category }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    let url = "http://localhost:5000/api/products";
    if (category) {
      url += `?category=${encodeURIComponent(category)}`;
    }
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Gagal memuat produk");
        setLoading(false);
      });
  }, [category]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="flex gap-8 justify-center items-center my-8 flex-wrap">
      {products.map((p) => (
        <ProductCard
          key={p.product_id || p.id}
          image={
            p.main_image &&
            (p.main_image.startsWith("uploads/") ||
              p.main_image.startsWith("/uploads/"))
              ? `http://localhost:5000/${p.main_image.replace(/^\/+/g, "")}`
              : p.main_image && p.main_image.startsWith("http")
              ? p.main_image
              : "/no-image.png"
          }
          name={p.product_name || p.name}
          price={Number(p.price)}
          oldPrice={null}
          rating={p.average_rating || 0}
          reviews={p.total_reviews || 0}
          link={"/detail/" + (p.product_id || p.id)}
        />
      ))}
    </div>
  );
}

export default ProductList;
