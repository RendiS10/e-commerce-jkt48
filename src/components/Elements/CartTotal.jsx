import React from "react";

function CartTotal({ subtotal }) {
  return (
    <div className="border rounded-lg p-6">
      <h3 className="font-semibold text-lg mb-4">Cart Total</h3>
      <div className="flex justify-between py-2 border-b">
        <span>Subtotal:</span>
        <span>${subtotal}</span>
      </div>
      <div className="flex justify-between py-2 mb-4">
        <span>Total:</span>
        <span className="font-semibold">${subtotal}</span>
      </div>
    </div>
  );
}

export default CartTotal;
