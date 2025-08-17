import React, { useState } from "react";
import CategoryCardNew from "../molecules/CategoryCardNew";
import ProductList from "../Fragments/ProductList";
import LoadingSpinner from "../atoms/LoadingSpinner";
import ErrorDisplay from "../atoms/ErrorDisplay";
import { useFetch } from "../../hooks/useFetch";
import { API_ENDPOINTS } from "../../utils/api";

function CategoryList() {
  const [active, setActive] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Fallback images untuk kategori
  const fallbackImages = [
    "/images/categories/merch-tshirt.jpg",
    "/images/categories/bdts.jpg",
    "/images/categories/ptbook.jpg",
    "/images/categories/accs.jpg",
  ];

  // Use custom hook for data fetching
  const {
    data: categories,
    loading,
    error,
    refetch,
  } = useFetch(API_ENDPOINTS.CATEGORIES, {
    transform: (data) => {
      // Set first category as selected when data loads
      if (data && data.length > 0 && !selectedCategory) {
        setSelectedCategory(data[0].category_name);
      }
      return data;
    },
  });

  // Handle category selection
  const handleCategoryClick = (category, index) => {
    setActive(index);
    setSelectedCategory(category.category_name);
  };

  // Loading state
  if (loading) {
    return <LoadingSpinner message="Memuat kategori..." />;
  }

  // Error state
  if (error) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={refetch}
        retryText="Muat Ulang Kategori"
      />
    );
  }

  // No categories found
  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 text-lg">Tidak ada kategori tersedia</div>
      </div>
    );
  }

  return (
    <>
      <section className="mt-10 flex flex-col justify-center items-center gap-4">
        <div className="flex items-center justify-between mb-6">
          <span className="text-[#cd0c0d] font-semibold text-base bg-[#ffeaea] rounded-lg py-[6px] px-4 mr-4">
            Cari Merch Yang Anda Inginkan
          </span>
        </div>
        <div className="flex flex-wrap gap-6 items-start justify-center">
          {categories.map((cat, idx) => (
            <CategoryCardNew
              key={cat.category_id}
              category={cat}
              index={idx}
              isActive={active === idx}
              onClick={handleCategoryClick}
              fallbackImages={fallbackImages}
            />
          ))}
        </div>
      </section>
      <ProductList category={selectedCategory} />
    </>
  );
}

export default CategoryList;
