import React from "react";
import ProductCard from "../molecules/ProductCard";
import LoadingSpinner from "../atoms/LoadingSpinner";
import ErrorDisplay from "../atoms/ErrorDisplay";

/**
 * Search Results Component
 * Displays search results with loading and error states
 */
const SearchResults = ({
  searchQuery,
  searchResults,
  isSearching,
  hasSearched,
  searchError,
  onRetry,
}) => {
  // Show loading state
  if (isSearching) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <LoadingSpinner message={`Mencari "${searchQuery}"...`} />
      </div>
    );
  }

  // Show error state
  if (searchError) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <ErrorDisplay
          error={searchError}
          onRetry={onRetry}
          retryText="Coba Lagi"
        />
      </div>
    );
  }

  // Show search results
  if (hasSearched) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <span className="w-2 h-6 bg-[#cd0c0d] rounded mr-2 inline-block"></span>
          <span className="text-lg font-medium text-[#222]">
            Hasil Pencarian untuk "{searchQuery}"
          </span>
          <span className="text-sm text-gray-600 ml-2">
            ({searchResults.length} produk ditemukan)
          </span>
        </div>

        {searchResults.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              Tidak ada produk yang ditemukan untuk "{searchQuery}"
            </div>
            <div className="text-gray-400 text-sm">
              Coba gunakan kata kunci yang berbeda atau lebih umum
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap justify-start gap-8 w-full">
            {searchResults.map((product) => (
              <ProductCard
                key={product.product_id || product.id}
                image={product.image_url || "/no-image.png"}
                name={product.product_name || product.name}
                price={`Rp ${Number(product.price).toLocaleString("id-ID")}`}
                oldPrice={null}
                rating={parseFloat(product.average_rating) || 0}
                reviews={parseInt(product.total_reviews) || 0}
                link={"/detail/" + (product.product_id || product.id)}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // No search performed yet
  return null;
};

export default SearchResults;
