import React from "react";

/**
 * Reusable Category Card Component
 */
const CategoryCard = ({
  category,
  index,
  isActive = false,
  onClick,
  fallbackImages = [],
  className = "",
}) => {
  // Get image URL with fallback
  const getImageUrl = (category, index) => {
    return category.image_url || fallbackImages[index % fallbackImages.length];
  };

  // Handle image error by using fallback
  const handleImageError = (e) => {
    if (fallbackImages.length > 0) {
      e.target.src = fallbackImages[index % fallbackImages.length];
    }
  };

  return (
    <div
      className={`w-[220px] h-[200px] flex flex-col items-center justify-center border border-gray-200 rounded-lg bg-white shadow-sm transition-all duration-300 cursor-pointer group ${
        isActive ? "ring-2 ring-[#cd0c0d]" : ""
      } ${className}`}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "0 4px 24px 0 #ffeaea")
      }
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "")}
      onClick={() => onClick && onClick(category, index)}
    >
      <img
        src={getImageUrl(category, index)}
        alt={category.category_name}
        className="w-[120px] h-[80px] object-contain transition-all duration-300"
        onError={handleImageError}
      />
      <span className="mt-2 text-center text-sm font-semibold leading-tight transition-all duration-300">
        {category.category_name}
      </span>
    </div>
  );
};

export default CategoryCard;
