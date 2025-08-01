import React from "react";

function CartTotal({ subtotal }) {
  return (
    <div className="border rounded-lg p-6 w-full max-w-xs">
      <h3 className="font-semibold text-lg mb-4">Cart Total</h3>
      <div className="flex justify-between py-2 border-b">
        <span>Subtotal:</span>
        <span>${subtotal}</span>
      </div>
      <div className="flex justify-between py-2 border-b">
        <span>Shipping:</span>
        <span>Free</span>
      </div>
      <div className="flex justify-between py-2 mb-4">
        <span>Total:</span>
        <span className="font-semibold">${subtotal}</span>
      </div>
      {/* Button will be passed as children or you can add here if needed */}
    </div>
  );
}

export default CartTotal;
