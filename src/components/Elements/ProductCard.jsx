import React from "react";
import { Link } from "react-router-dom";

function ProductCard({ image, name, price, oldPrice, rating, reviews, link }) {
  // Function untuk menampilkan bintang berdasarkan rating
  const renderStars = (rating) => {
    const numRating = Number(rating) || 0;
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <>
        {"★".repeat(fullStars)}
        {hasHalfStar && "☆"}
        {"☆".repeat(emptyStars)}
      </>
    );
  };

  const numRating = Number(rating) || 0;
  const numReviews = Number(reviews) || 0;

  return (
    <Link
      to={link}
      className="bg-white rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#eee] w-[200px] p-4 pt-4 pb-3 flex flex-col gap-2 relative transition hover:shadow-md"
    >
      <div className="relative w-full h-[120px] flex items-center justify-center bg-[#fafafa] rounded-lg">
        <img
          src={image}
          alt={name}
          className="max-w-[100px] max-h-[100px] object-contain"
        />
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-base font-medium mb-[2px]">{name}</div>
        <div className="flex gap-2 items-center">
          <span className="text-[#cd0c0d] font-semibold">{price}</span>
          {oldPrice && (
            <span className="text-[#888] line-through text-[0.95em]">
              {oldPrice}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-base">
          <span className="text-[#ffb400] text-base">
            {renderStars(numRating)}
          </span>
          <span className="text-[#888] text-[0.95em]">
            (
            {numRating > 0
              ? `${numRating.toFixed(1)} • ${numReviews}`
              : numReviews}
            ) review{numReviews !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
