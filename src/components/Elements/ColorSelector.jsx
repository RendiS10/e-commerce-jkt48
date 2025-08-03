import React from "react";

function ColorSelector({ colors, value, onChange }) {
  return (
    <div className="flex gap-2">
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            value === color ? "border-[#cd0c0d]" : "border-gray-300"
          }`}
          style={{ backgroundColor: color }}
          onClick={() => onChange(color)}
          aria-label={color}
        >
          {value === color && (
            <span className="w-3 h-3 bg-white rounded-full block" />
          )}
        </button>
      ))}
    </div>
  );
}

export default ColorSelector;
