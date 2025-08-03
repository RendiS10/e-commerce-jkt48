import React from "react";
import OrderSummaryRow from "../Elements/OrderSummaryRow";
import RadioButton from "../Elements/RadioButton";
import CouponForm from "./CouponForm";
import Button from "../Elements/Button";

function OrderSummary({
  products,
  subtotal,
  paymentMethod,
  setPaymentMethod,
  coupon,
  setCoupon,
  onApplyCoupon,
  onPlaceOrder,
}) {
  return (
    <div className="w-full max-w-xs border rounded-lg p-6">
      {products.map((p) => (
        <OrderSummaryRow
          key={p.name}
          image={p.image}
          name={p.name}
          price={p.price * p.quantity}
        />
      ))}
      <div className="border-t my-2" />
      <div className="flex justify-between py-1 text-sm">
        <span>Subtotal:</span>
        <span>${subtotal}</span>
      </div>
      <div className="flex justify-between py-1 text-sm">
        <span>Shipping:</span>
        <span>Free</span>
      </div>
      <div className="flex justify-between py-1 font-semibold">
        <span>Total:</span>
        <span>${subtotal}</span>
      </div>
      <div className="my-4">
        <RadioButton
          label="Bank"
          checked={paymentMethod === "bank"}
          onChange={() => setPaymentMethod("bank")}
          value="bank"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
            alt="Visa"
            className="w-8 inline mx-1"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/41/Mastercard-logo.svg"
            alt="Mastercard"
            className="w-8 inline mx-1"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/09/JCB_logo.svg"
            alt="JCB"
            className="w-8 inline mx-1"
          />
        </RadioButton>
        <RadioButton
          label="Cash on delivery"
          checked={paymentMethod === "cod"}
          onChange={() => setPaymentMethod("cod")}
          value="cod"
        />
      </div>
      <CouponForm
        coupon={coupon}
        setCoupon={setCoupon}
        onApply={onApplyCoupon}
      />
      <Button
        className="w-full mt-4 bg-[#cd0c0d] text-white py-2 rounded"
        onClick={onPlaceOrder}
      >
        Place Order
      </Button>
    </div>
  );
}

export default OrderSummary;
