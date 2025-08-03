import React, { useState } from "react";

function ProductImageGallery({ images = [] }) {
  const [selected, setSelected] = useState(0);
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex md:flex-col gap-2 order-2 md:order-1">
        {images.map((img, i) => (
          <button
            key={i}
            className={`border rounded p-1 bg-white ${
              selected === i ? "border-[#cd0c0d]" : "border-gray-200"
            }`}
            onClick={() => setSelected(i)}
            aria-label={`Thumbnail ${i + 1}`}
          >
            <img
              src={img}
              alt="Thumbnail"
              className="w-16 h-16 object-contain"
            />
          </button>
        ))}
      </div>
      <div className="flex-1 order-1 md:order-2 flex items-center justify-center">
        <img
          src={images[selected]}
          alt="Product"
          className="w-full max-w-md h-80 object-contain rounded bg-white"
        />
      </div>
    </div>
  );
}

export default ProductImageGallery;
