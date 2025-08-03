import React from "react";

function OrderSummaryRow({ image, name, price }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <img src={image} alt={name} className="w-8 h-8 object-contain rounded" />
      <span className="flex-1 text-sm">{name}</span>
      <span className="text-sm font-medium">${price}</span>
    </div>
  );
}

export default OrderSummaryRow;
