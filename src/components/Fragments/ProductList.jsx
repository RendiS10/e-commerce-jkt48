import React from "react";
import ProductCard from "../molecules/ProductCard";
import ProductLainnya from "./ProductLainnya";
import LoadingSpinner from "../atoms/LoadingSpinner";
import ErrorDisplay from "../atoms/ErrorDisplay";
import { useFetch } from "../../hooks/useFetch";
import { API_ENDPOINTS } from "../../utils/api";

function ProductList({ category }) {
  // Build endpoint with category filter
  const endpoint = category
    ? `${API_ENDPOINTS.PRODUCTS}?category=${encodeURIComponent(category)}`
    : API_ENDPOINTS.PRODUCTS;

  // Use custom hook for data fetching
  const {
    data: products,
    loading,
    error,
    refetch,
  } = useFetch(endpoint, {
    dependencies: [category], // Refetch when category changes
  });

  // Loading state
  if (loading) {
    return <LoadingSpinner message="Memuat produk..." />;
  }

  // Error state
  if (error) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={refetch}
        retryText="Muat Ulang Produk"
      />
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mt-8 mb-2">
          <span className="w-2 h-6 bg-[#cd0c0d] rounded mr-2 inline-block"></span>
          <span className="text-lg font-medium text-[#222]">
            {category ? `Category: ${category}` : "Semua Produk"}
          </span>
        </div>
        <div className="flex flex-wrap justify-start gap-8 w-full">
          {products.map((p) => (
            <ProductCard
              key={p.product_id || p.id}
              image={p.image_url || "/no-image.png"}
              name={p.product_name || p.name}
              price={`Rp ${Number(p.price).toLocaleString("id-ID")}`}
              oldPrice={null}
              rating={parseFloat(p.average_rating) || 0}
              reviews={parseInt(p.total_reviews) || 0}
              link={"/detail/" + (p.product_id || p.id)}
            />
          ))}
        </div>
      </div>
      <ProductLainnya />
    </>
  );
}

export default ProductList;
