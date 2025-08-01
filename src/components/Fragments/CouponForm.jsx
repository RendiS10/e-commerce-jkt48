import React from "react";
import Input from "../Elements/Input";
import Button from "../Elements/Button";

function CouponForm({ coupon, setCoupon, onApply }) {
  return (
    <form className="flex gap-4 mb-8 flex-1 max-w-lg" onSubmit={onApply}>
      <Input
        type="text"
        placeholder="Coupon Code"
        value={coupon}
        onChange={(e) => setCoupon(e.target.value)}
        className="border border-gray-400 rounded px-4 py-2 mb-0"
      />
      <Button
        type="submit"
        className="bg-[#cd0c0d] text-white px-8 py-2 rounded"
      >
        Apply Coupon
      </Button>
    </form>
  );
}

export default CouponForm;
