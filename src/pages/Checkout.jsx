import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Elements/Button";
import CartTable from "../components/Fragments/CartTable";
import CartTotal from "../components/Elements/CartTotal";
import Header from "../components/Layouts/Header";
import Navbar from "../components/Layouts/Navbar";
import Footer from "../components/Layouts/Footer";

function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Silakan login untuk melihat keranjang.");
      window.location.href = "/login";
      return;
    }
    fetch("http://localhost:5000/api/cart", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data keranjang");
        return res.json();
      })
      .then((data) => {
        // data.CartItems bisa null jika cart kosong
        setCart(data.CartItems || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Gagal mengambil data keranjang");
        setLoading(false);
      });
  }, []);

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

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 py-8">{error}</div>;

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
