import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Elements/Button";
import CartTable from "../../components/organisms/CartTable";
import CartTotal from "../../components/Elements/CartTotal";
import Header from "../../components/Layouts/Header";
import Navbar from "../../components/Layouts/Navbar";
import Footer from "../../components/Layouts/Footer";
import LoadingSpinner from "../../components/atoms/LoadingSpinner.jsx";
import ErrorDisplay from "../../components/atoms/ErrorDisplay.jsx";
import { useAuthenticatedFetch } from "../../hooks/useFetch.js";
import { API_ENDPOINTS } from "../../utils/api.js";

function Checkout() {
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState("");

  // Use custom hook for authenticated data fetching
  const {
    data: cartData,
    loading,
    error,
    refetch,
  } = useAuthenticatedFetch(API_ENDPOINTS.CART, {
    transform: (data) => data.CartItems || [],
    onError: () => {
      alert("Silakan login untuk melihat keranjang.");
      window.location.href = "/login";
    },
  });

  const cart = cartData || [];

  const handleQuantityChange = async (cart_item_id, value) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/cart/${cart_item_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity: Number(value) }),
        }
      );
      if (!res.ok) throw new Error("Gagal update quantity");
      // Setelah update, fetch ulang cart dari backend agar sync
      const cartRes = await fetch("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!cartRes.ok) throw new Error("Gagal mengambil data keranjang");
      const cartData = await cartRes.json();
      setCart(cartData.CartItems || []);
    } catch {
      alert("Gagal update quantity keranjang");
    }
  };

  const handleRemove = async (cart_item_id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/cart/${cart_item_id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Gagal hapus item");
      // Setelah hapus, fetch ulang cart dari backend agar sync
      const cartRes = await fetch("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!cartRes.ok) throw new Error("Gagal mengambil data keranjang");
      const cartData = await cartRes.json();
      setCart(cartData.CartItems || []);
    } catch {
      alert("Gagal menghapus item keranjang");
    }
  };

  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      (item.quantity > 0 ? (item.Product?.price || 0) * item.quantity : 0),
    0
  );

  // Jika quantity 0, set price juga 0 pada tampilan
  const displayCart = cart.map((item) =>
    item.quantity > 0
      ? {
          ...item,
          price: item.Product?.price || 0,
          name: item.Product?.product_name || item.Product?.name || item.name,
          image: item.Product?.image_url || item.image,
          size: item.ProductVariant?.size || null,
          color: item.ProductVariant?.color || null,
        }
      : {
          ...item,
          price: 0,
          name: item.Product?.product_name || item.Product?.name || item.name,
          image: item.Product?.image_url || item.image,
          size: item.ProductVariant?.size || null,
          color: item.ProductVariant?.color || null,
        }
  );

  // Loading state
  if (loading) {
    return (
      <>
        <Header />
        <Navbar />
        <LoadingSpinner message="Loading cart..." />
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Header />
        <Navbar />
        <ErrorDisplay error={error} onRetry={refetch} />
      </>
    );
  }

  return (
    <>
      <header>
        <Header />
      </header>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Cart Table */}
        <CartTable
          cart={displayCart.map((item) => ({ ...item, id: item.cart_item_id }))}
          onRemove={handleRemove}
          onQuantityChange={handleQuantityChange}
        />

        <div className="flex flex-wrap gap-8 items-start justify-end">
          {/* Cart Total */}
          <div>
            <CartTotal subtotal={subtotal} />
            <Button
              className="bg-[#cd0c0d] text-white w-full py-2 rounded mt-4"
              onClick={() => navigate("/checkout-detail")}
            >
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
