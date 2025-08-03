import React from "react";

function RatingStars({ value = 0, max = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(max)].map((_, i) => {
        const filled = value >= i + 1;
        const half = value >= i + 0.5 && value < i + 1;
        return (
          <span key={i} className="text-yellow-400">
            {filled ? (
              "★"
            ) : half ? (
              <span className="relative">
                <span className="absolute left-0 w-1/2 overflow-hidden">★</span>
                <span className="text-gray-300">★</span>
              </span>
            ) : (
              <span className="text-gray-300">★</span>
            )}
          </span>
        );
      })}
    </div>
  );
}

export default RatingStars;
