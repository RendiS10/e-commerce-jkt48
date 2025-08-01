import React from "react";
import CartRow from "../Elements/CartRow";

function CartTable({ cart, onRemove, onQuantityChange }) {
  return (
    <div className="bg-white rounded-lg shadow-none mb-6">
      <div className="grid grid-cols-4 text-left font-semibold text-gray-700 px-6 py-4 border-b">
        <span>Product</span>
        <span>Price</span>
        <span>Quantity</span>
        <span>Subtotal</span>
      </div>
      {cart.map((item) => (
        <CartRow
          key={item.id}
          item={item}
          onRemove={onRemove}
          onQuantityChange={onQuantityChange}
        />
      ))}
    </div>
  );
}

export default CartTable;
