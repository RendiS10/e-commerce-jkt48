import React from "react";
import Button from "./Button";

function CartRow({ item, onRemove, onQuantityChange }) {
  // Fungsi format Rupiah
  function formatRupiah(amount) {
    if (!amount || isNaN(amount)) return "Rp0";
    let str = amount.toString().replace(/[^\d,]/g, "");
    let [main, decimal] = str.split(",");
    main = main || "0";
    let formatted = main.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return "Rp" + formatted + (decimal ? "," + decimal : "");
  }
  // Ambil quantity asli dari item.quantity (tanpa padStart)
  // Ambil image dari item.Product.main_image jika ada, fallback ke item.image
  let image =
    (item.Product &&
    item.Product.main_image &&
    (item.Product.main_image.startsWith("uploads/") ||
      item.Product.main_image.startsWith("/uploads/"))
      ? `http://localhost:5000/${item.Product.main_image.replace(/^\/+/, "")}`
      : item.Product &&
        item.Product.main_image &&
        item.Product.main_image.startsWith("http")
      ? item.Product.main_image
      : item.image) || "/no-image.png";

  return (
    <div className="grid grid-cols-6 items-center px-6 py-4 border-b last:border-b-0 bg-white relative">
      <div className="flex items-center gap-4">
        <button
          className="absolute left-2 top-2 bg-[#cd0c0d] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
          title="Remove"
          onClick={() => onRemove(item.id)}
        >
          ×
        </button>
        <img
          src={image}
          alt={item.name}
          className="w-14 h-14 object-contain rounded"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/no-image.png";
          }}
        />
        <span className="font-medium text-gray-800">{item.name}</span>
      </div>
      <span className="text-sm text-gray-600">
        {item.ProductVariant?.size || item.size || "-"}
      </span>
      <span className="text-sm text-gray-600">
        {item.ProductVariant?.color || item.color || "-"}
      </span>
      <span className="font-medium text-gray-700">
        {formatRupiah(item.price)}
      </span>
      <input
        type="number"
        min={0}
        max={99}
        value={item.quantity}
        onChange={(e) =>
          onQuantityChange(
            item.id,
            Math.max(0, Math.min(99, Number(e.target.value)))
          )
        }
        className="border border-gray-300 rounded px-2 py-1 w-16 text-center focus:border-[#cd0c0d]"
      />
      <span className="font-medium text-gray-700">
        {formatRupiah(item.price * item.quantity)}
      </span>
    </div>
  );
}

export default CartRow;
