import React from "react";

function QuantitySelector({ value, setValue, min = 1, max = 10 }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="w-8 h-8 border rounded text-lg font-bold text-gray-700 hover:bg-gray-100"
        onClick={() => setValue(Math.max(min, value - 1))}
        disabled={value <= min}
      >
        -
      </button>
      <span className="w-8 text-center">{value}</span>
      <button
        type="button"
        className="w-8 h-8 border rounded text-lg font-bold text-gray-700 hover:bg-gray-100"
        onClick={() => setValue(Math.min(max, value + 1))}
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
}

export default QuantitySelector;
