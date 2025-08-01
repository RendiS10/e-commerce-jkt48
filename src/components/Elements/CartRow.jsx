import React from "react";
import Button from "./Button";

function CartRow({ item, onRemove, onQuantityChange }) {
  return (
    <div className="grid grid-cols-4 items-center px-6 py-4 border-b last:border-b-0 bg-white relative">
      <div className="flex items-center gap-4">
        <button
          className="absolute left-2 top-2 bg-[#cd0c0d] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
          title="Remove"
          onClick={() => onRemove(item.id)}
        >
          ×
        </button>
        <img
          src={item.image}
          alt={item.name}
          className="w-14 h-14 object-contain rounded"
        />
        <span className="font-medium text-gray-800">{item.name}</span>
      </div>
      <span className="font-medium text-gray-700">${item.price}</span>
      <select
        className="border border-gray-300 rounded px-2 py-1 w-16 text-center focus:border-[#cd0c0d]"
        value={item.quantity}
        onChange={(e) => onQuantityChange(item.id, e.target.value)}
      >
        {[1, 2, 3, 4, 5].map((q) => (
          <option key={q} value={q}>
            {q.toString().padStart(2, "0")}
          </option>
        ))}
      </select>
      <span className="font-medium text-gray-700">
        ${item.price * item.quantity}
      </span>
    </div>
  );
}

export default CartRow;
