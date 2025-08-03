import React, { useState } from "react";
import Header from "../components/Layouts/Header";
import Navbar from "../components/Layouts/Navbar";
import Footer from "../components/Layouts/Footer";
import BillingForm from "../components/Fragments/BillingForm";
import OrderSummary from "../components/Fragments/OrderSummary";

const products = [
  {
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
    name: "LCD Monitor",
    price: 650,
    quantity: 1,
  },
  {
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    name: "H1 Gamepad",
    price: 550,
    quantity: 2,
  },
];

function Pembayaran() {
  const [form, setForm] = useState({
    firstName: "",
    company: "",
    address: "",
    apartment: "",
    city: "",
    phone: "",
    email: "",
  });
  const [saveInfo, setSaveInfo] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [coupon, setCoupon] = useState("");
  const subtotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Header />
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-12">
        <BillingForm
          form={form}
          onChange={handleFormChange}
          saveInfo={saveInfo}
          onSaveInfo={() => setSaveInfo((v) => !v)}
        />
        <OrderSummary
          products={products}
          subtotal={subtotal}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          coupon={coupon}
          setCoupon={setCoupon}
          onApplyCoupon={(e) => {
            e.preventDefault();
            // handle coupon logic
          }}
          onPlaceOrder={() => {
            // handle place order
          }}
        />
      </div>
      <Footer />
    </>
  );
}

export default Pembayaran;
