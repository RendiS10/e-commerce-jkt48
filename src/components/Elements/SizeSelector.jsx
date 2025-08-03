import React from "react";

function SizeSelector({ sizes, value, onChange }) {
  return (
    <div className="flex gap-2">
      {sizes.map((size) => (
        <button
          key={size}
          type="button"
          className={`px-2 py-1 border rounded text-xs font-semibold ${
            value === size
              ? "bg-[#cd0c0d] text-white border-[#cd0c0d]"
              : "bg-white text-gray-700 border-gray-300"
          }`}
          onClick={() => onChange(size)}
        >
          {size}
        </button>
      ))}
    </div>
  );
}

export default SizeSelector;
