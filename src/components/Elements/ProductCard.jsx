import React from "react";

function ProductCard({
  image,
  name,
  price,
  oldPrice,
  rating,
  reviews,
  onWishlist,
  onView,
  link,
}) {
  return (
    <a
      href={link}
      className="bg-white rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#eee] w-[200px] p-4 pt-4 pb-3 flex flex-col gap-2 relative transition hover:shadow-md"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="relative w-full h-[120px] flex items-center justify-center bg-[#fafafa] rounded-lg">
        <img
          src={image}
          alt={name}
          className="max-w-[100px] max-h-[100px] object-contain"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            className="bg-white border-none rounded-full w-7 h-7 flex items-center justify-center cursor-pointer shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition hover:bg-[#ffeaea]"
            title="Wishlist"
            onClick={(e) => {
              e.preventDefault();
              onWishlist && onWishlist();
            }}
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="#cd0c0d"
              strokeWidth="2"
            >
              <path d="M10 17s-6-4.35-6-8.5A3.5 3.5 0 0 1 10 5a3.5 3.5 0 0 1 6 3.5C16 12.65 10 17 10 17z" />
            </svg>
          </button>
          <button
            className="bg-white border-none rounded-full w-7 h-7 flex items-center justify-center cursor-pointer shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition hover:bg-[#ffeaea]"
            title="View"
            onClick={(e) => {
              e.preventDefault();
              onView && onView();
            }}
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="#222"
              strokeWidth="2"
            >
              <circle cx="10" cy="10" r="7" />
              <circle cx="10" cy="10" r="3" />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-base font-medium mb-[2px]">{name}</div>
        <div className="flex gap-2 items-center">
          <span className="text-[#cd0c0d] font-semibold">${price}</span>
          {oldPrice && (
            <span className="text-[#888] line-through text-[0.95em]">
              ${oldPrice}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-base">
          <span className="text-[#ffb400] text-base">
            {"★".repeat(rating)}
            {"☆".repeat(5 - rating)}
          </span>
          <span className="text-[#888] text-[0.95em]">({reviews})</span>
        </div>
      </div>
    </a>
  );
}

export default ProductCard;
