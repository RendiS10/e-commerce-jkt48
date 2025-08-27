import React, { useEffect, useState } from "react";
import ProductLainSection from "./ProductLainSection";

function ProductLainnya() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(
      "https://e-commerce-jkt48-prototype-production.up.railway.app/api/products"
    )
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Gagal memuat produk");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mt-8 mb-2">
        <span className="w-2 h-6 bg-[#cd0c0d] rounded mr-2 inline-block"></span>
        <span className="text-lg font-medium text-[#222]">Produk Lainnya</span>
      </div>
      <ProductLainSection
        products={products.map((p) => ({
          image: p.image_url || "/no-image.png",
          name: p.product_name || p.name,
          price: `Rp ${Number(p.price).toLocaleString("id-ID")}`,
          oldPrice: null,
          rating: p.average_rating || 0,
          reviews: p.total_reviews || 0,
          link: "/detail/" + (p.product_id || p.id),
        }))}
      />
    </div>
  );
}

export default ProductLainnya;
