import React, { useState } from "react";
import Button from "../components/Elements/Button";
import CartTable from "../components/Fragments/CartTable";
import CartTotal from "../components/Elements/CartTotal";
import CouponForm from "../components/Fragments/CouponForm";
import Breadcrumb from "../components/Elements/Breadcrumb";
import CartActions from "../components/Elements/CartActions";
import Header from "../components/Layouts/Header";
import Navbar from "../components/Layouts/Navbar";
import Footer from "../components/Layouts/Footer";

const initialCart = [
  {
    id: 1,
    name: "LCD Monitor",
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
    price: 650,
    quantity: 1,
  },
  {
    id: 2,
    name: "H1 Gamepad",
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    price: 550,
    quantity: 2,
  },
];

function Checkout() {
  const [cart, setCart] = useState(initialCart);
  const [coupon, setCoupon] = useState("");

  const handleQuantityChange = (id, value) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Number(value) } : item
      )
    );
  };

  const handleRemove = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    // handle coupon logic here
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      <header>
        <Header />
      </header>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Cart", active: true },
          ]}
        />
        {/* Cart Table */}
        <CartTable
          cart={cart}
          onRemove={handleRemove}
          onQuantityChange={handleQuantityChange}
        />
        {/* Actions */}
        <CartActions />
        <div className="flex flex-wrap gap-8 items-start">
          {/* Coupon */}
          <CouponForm
            coupon={coupon}
            setCoupon={setCoupon}
            onApply={handleApplyCoupon}
          />
          {/* Cart Total */}
          <div>
            <CartTotal subtotal={subtotal} />
            <Button className="bg-[#cd0c0d] text-white w-full py-2 rounded mt-4">
              Process to checkout
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Checkout;
