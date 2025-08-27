import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
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

  // Cek authentication terlebih dahulu
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Login Diperlukan",
        text: "Silakan login terlebih dahulu untuk melihat keranjang",
        confirmButtonText: "Login Sekarang",
        confirmButtonColor: "#cd0c0d",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }
  }, [navigate]);

  // Use custom hook for authenticated data fetching
  const {
    data: cartData,
    loading,
    error,
    refetch,
  } = useAuthenticatedFetch(API_ENDPOINTS.CART, {
    transform: (data) => data.CartItems || [],
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Sesi Berakhir",
        text: "Sesi login Anda telah berakhir. Silakan login kembali.",
        confirmButtonText: "Login",
        confirmButtonColor: "#cd0c0d",
      }).then(() => {
        navigate("/login");
      });
    },
  });

  const cart = cartData || [];

  // Early return jika user belum login
  if (!localStorage.getItem("token")) {
    return (
      <>
        <Header />
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <LoadingSpinner message="Checking authentication..." />
        </div>
        <Footer />
      </>
    );
  }

  const handleQuantityChange = async (cart_item_id, value) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://e-commerce-jkt48-prototype-production.up.railway.app/api/cart/${cart_item_id}`,
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

      // Refetch data menggunakan hook
      refetch();
    } catch (error) {
      console.error("Error updating quantity:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Update Quantity",
        text: "Gagal mengupdate jumlah item dalam keranjang",
        confirmButtonColor: "#cd0c0d",
      });
    }
  };

  const handleRemove = async (cart_item_id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login kembali.");
      }

      const res = await fetch(
        `https://e-commerce-jkt48-prototype-production.up.railway.app/api/cart/${cart_item_id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        let errorMessage = "Gagal hapus item";
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // Error parsing response, use default message
        }
        throw new Error(errorMessage);
      }

      // Refetch data menggunakan hook
      refetch();
    } catch (error) {
      console.error("Error removing item:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Menghapus Item",
        text: error.message,
        confirmButtonColor: "#cd0c0d",
      });
    }
  };
  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      (item.quantity > 0 ? (item.Product?.price || 0) * item.quantity : 0),
    0
  );

  // Jika quantity 0, set price juga 0 pada tampilan
  const displayCart = cart.map((item) => {
    return item.quantity > 0
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
        };
  });

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
