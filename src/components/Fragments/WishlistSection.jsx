import React from "react";
import ProductCard from "../../components/Elements/ProductCard";
import Button from "../../components/Elements/Button";

function WishlistSection({
  title,
  products,
  showMoveAll,
  onMoveAll,
  showSeeAll,
  onSeeAll,
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        {title && (
          <h3 className="text-base font-medium text-[#222]">{title}</h3>
        )}
        {showMoveAll && (
          <Button
            className="bg-white border border-[#222] text-[#222] hover:bg-gray-50 px-4 py-1 rounded shadow-none text-sm font-normal"
            onClick={onMoveAll}
          >
            Move All To Bag
          </Button>
        )}
        {showSeeAll && (
          <Button
            className="bg-white border border-[#222] text-[#222] hover:bg-gray-50 px-4 py-1 rounded shadow-none text-sm font-normal"
            onClick={onSeeAll}
          >
            See All
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-6">
        {products.map((p, idx) => (
          <div key={p.name} className="relative">
            {/* Discount badge */}
            {p.discount && (
              <span className="absolute left-2 top-2 bg-[#cd0c0d] text-white text-xs font-semibold px-2 py-0.5 rounded">
                -{p.discount}%
              </span>
            )}
            {/* New badge */}
            {p.isNew && (
              <span className="absolute left-2 top-2 bg-[#27c200] text-white text-xs font-semibold px-2 py-0.5 rounded">
                NEW
              </span>
            )}
            <ProductCard {...p} />
            {/* Trash or Eye icon */}
            {showMoveAll && (
              <button
                className="absolute right-2 top-2 bg-white border-none rounded-full w-7 h-7 flex items-center justify-center cursor-pointer shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition hover:bg-[#ffeaea]"
                title="Remove"
              >
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="#222"
                  strokeWidth="2"
                >
                  <path d="M4 6h10M7 6v8m4-8v8M5 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
                </svg>
              </button>
            )}
            {showSeeAll && (
              <button
                className="absolute right-2 top-2 bg-white border-none rounded-full w-7 h-7 flex items-center justify-center cursor-pointer shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition hover:bg-[#ffeaea]"
                title="View"
              >
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="#222"
                  strokeWidth="2"
                >
                  <circle cx="9" cy="9" r="7" />
                  <circle cx="9" cy="9" r="3" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default WishlistSection;
