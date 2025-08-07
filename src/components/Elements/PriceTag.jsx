import React from "react";

function PriceTag({ price, oldPrice }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="text-2xl font-bold text-[#cd0c0d]">{price}</span>
      {oldPrice && (
        <span className="text-base line-through text-gray-400">{oldPrice}</span>
      )}
    </div>
  );
}

export default PriceTag;
