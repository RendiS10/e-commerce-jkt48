import React, { useState } from "react";

function WishlistButton() {
  const [active, setActive] = useState(false);
  return (
    <button
      type="button"
      className={`w-10 h-10 flex items-center justify-center rounded-full border ${
        active
          ? "bg-[#cd0c0d] text-white border-[#cd0c0d]"
          : "bg-white text-[#cd0c0d] border-[#cd0c0d]"
      }`}
      onClick={() => setActive((v) => !v)}
      aria-label="Add to wishlist"
    >
      {active ? (
        <svg fill="currentColor" viewBox="0 0 20 20" className="w-6 h-6">
          <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
        </svg>
      ) : (
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.682l-7.682-7.682a4.5 4.5 0 010-6.364z"
          />
        </svg>
      )}
    </button>
  );
}

export default WishlistButton;
