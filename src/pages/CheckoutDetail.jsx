import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Layouts/Header";
import Navbar from "../components/Layouts/Navbar";
import Footer from "../components/Layouts/Footer";
import Button from "../components/Elements/Button";
import { UserContext, CartContext } from "../main";

function CheckoutDetail() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { cart } = useContext(CartContext);

  const [loading, setLoading] = useState(true);
  const [checkoutData, setCheckoutData] = useState({
    // Data pengiriman
    full_name: "",
    phone_number: "",
    address: "",
    city: "",
    postal_code: "",
    notes: "",
    // Data pembayaran
    payment_method: "transfer", // transfer atau cod
  });
  const [cartItems, setCartItems] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Silakan login terlebih dahulu");
      navigate("/login");
      return;
    }

    // Fetch cart data dan user profile
    Promise.all([
      fetch("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then(([cartRes, userRes]) => {
        if (!cartRes.ok || !userRes.ok) {
          throw new Error("Failed to fetch data");
        }
        return Promise.all([cartRes.json(), userRes.json()]);
      })
      .then(([cartData, userData]) => {
        setCartItems(cartData.CartItems || []);
        // Pre-fill form dengan data user
        setCheckoutData((prev) => ({
          ...prev,
          full_name: userData.full_name || "",
          phone_number: userData.phone_number || "",
          address: userData.address || "",
          city: userData.city || "",
          postal_code: userData.postal_code || "",
        }));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        alert("Gagal mengambil data checkout");
        navigate("/checkout");
      });
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCheckoutData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!checkoutData.full_name.trim()) {
      newErrors.full_name = "Nama lengkap harus diisi";
    }
    if (!checkoutData.phone_number.trim()) {
      newErrors.phone_number = "Nomor telepon harus diisi";
    }
    if (!checkoutData.address.trim()) {
      newErrors.address = "Alamat harus diisi";
    }
    if (!checkoutData.city.trim()) {
      newErrors.city = "Kota harus diisi";
    }
    if (!checkoutData.postal_code.trim()) {
      newErrors.postal_code = "Kode pos harus diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) {
      alert("Mohon lengkapi semua data yang diperlukan");
      return;
    }

    if (cartItems.length === 0) {
      alert("Keranjang kosong");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const orderData = {
        shipping_address: {
          full_name: checkoutData.full_name,
          phone_number: checkoutData.phone_number,
          address: checkoutData.address,
          city: checkoutData.city,
          postal_code: checkoutData.postal_code,
        },
        payment_method: checkoutData.payment_method,
        notes: checkoutData.notes,
        cart_items: cartItems.map((item) => ({
          cart_item_id: item.cart_item_id,
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          price: item.Product?.price || 0,
        })),
      };

      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Gagal membuat pesanan");
      }

      const result = await response.json();
      alert("Pesanan berhasil dibuat!");

      // Redirect ke halaman konfirmasi pembayaran
      navigate(`/pembayaran`, {
        state: {
          order: result,
          payment_method: checkoutData.payment_method,
        },
      });
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Gagal membuat pesanan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // Format Rupiah
  const formatRupiah = (amount) => {
    if (!amount || isNaN(amount)) return "Rp0";
    return "Rp" + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.Product?.price || 0) * item.quantity,
    0
  );
  const shippingCost = 15000; // Fixed shipping cost
  const total = subtotal + shippingCost;

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-8">
        <p>Keranjang kosong</p>
        <Button
          onClick={() => navigate("/")}
          className="bg-[#cd0c0d] text-white px-6 py-2 rounded mt-4"
        >
          Belanja Sekarang
        </Button>
      </div>
    );
  }

  return (
    <>
      <Header />
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Data Pengiriman */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Data Pengiriman</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={checkoutData.full_name}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cd0c0d] focus:border-transparent ${
                    errors.full_name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Masukkan nama lengkap"
                />
                {errors.full_name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.full_name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Telepon *
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  value={checkoutData.phone_number}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cd0c0d] focus:border-transparent ${
                    errors.phone_number ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Masukkan nomor telepon"
                />
                {errors.phone_number && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone_number}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat Lengkap *
                </label>
                <textarea
                  name="address"
                  value={checkoutData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cd0c0d] focus:border-transparent ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Masukkan alamat lengkap"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kota *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={checkoutData.city}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cd0c0d] focus:border-transparent ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Kota"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kode Pos *
                  </label>
                  <input
                    type="text"
                    name="postal_code"
                    value={checkoutData.postal_code}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cd0c0d] focus:border-transparent ${
                      errors.postal_code ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Kode Pos"
                  />
                  {errors.postal_code && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.postal_code}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catatan (Opsional)
                </label>
                <textarea
                  name="notes"
                  value={checkoutData.notes}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#cd0c0d] focus:border-transparent"
                  placeholder="Catatan untuk penjual (opsional)"
                />
              </div>
            </div>

            {/* Metode Pembayaran */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Metode Pembayaran</h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="payment_method"
                    value="transfer"
                    checked={checkoutData.payment_method === "transfer"}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <div>
                    <span className="font-medium">Transfer Bank</span>
                    <p className="text-sm text-gray-600">
                      Bayar melalui transfer bank (BCA, BNI, Mandiri, BRI)
                    </p>
                  </div>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="payment_method"
                    value="cod"
                    checked={checkoutData.payment_method === "cod"}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <div>
                    <span className="font-medium">Cash on Delivery (COD)</span>
                    <p className="text-sm text-gray-600">
                      Bayar saat barang diterima
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h2>

            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => {
                const image = item.Product?.main_image
                  ? `http://localhost:5000/${item.Product.main_image.replace(
                      /^\/+/,
                      ""
                    )}`
                  : "/no-image.png";

                return (
                  <div
                    key={item.cart_item_id}
                    className="flex items-center gap-4 border-b pb-4"
                  >
                    <img
                      src={image}
                      alt={item.Product?.product_name || "Product"}
                      className="w-16 h-16 object-contain rounded"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/no-image.png";
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {item.Product?.product_name || "Unknown Product"}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {item.ProductVariant?.size &&
                          `Size: ${item.ProductVariant.size}`}
                        {item.ProductVariant?.color &&
                          `, Color: ${item.ProductVariant.color}`}
                      </p>
                      <p className="text-sm">
                        {formatRupiah(item.Product?.price || 0)} x{" "}
                        {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatRupiah(
                          (item.Product?.price || 0) * item.quantity
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Total */}
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Ongkos Kirim</span>
                <span>{formatRupiah(shippingCost)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span>{formatRupiah(total)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmitOrder}
              disabled={loading}
              className="w-full bg-[#cd0c0d] text-white py-3 rounded-lg mt-6 font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Buat Pesanan"}
            </Button>

            <Button
              onClick={() => navigate("/checkout")}
              className="w-full bg-gray-500 text-white py-2 rounded-lg mt-2 hover:bg-gray-600 transition-colors"
            >
              Kembali ke Keranjang
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CheckoutDetail;
