import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../../components/Layouts/Header";
import Navbar from "../../components/Layouts/Navbar";
import Footer from "../../components/Layouts/Footer";
import Button from "../../components/Elements/Button";
import { UserContext, CartContext } from "../../main";

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
    payment_method: "transfer", // default transfer
  });
  const [cartItems, setCartItems] = useState([]);
  const [directBuyItem, setDirectBuyItem] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Login Diperlukan",
        text: "Silakan login terlebih dahulu untuk melanjutkan checkout",
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

    // Cek apakah ada direct buy item
    const directBuyData = localStorage.getItem("directBuyItem");
    console.log("Direct buy data from localStorage:", directBuyData);

    if (directBuyData) {
      // Mode direct buy
      const item = JSON.parse(directBuyData);
      console.log("Parsed direct buy item:", item);
      setDirectBuyItem(item);

      // Fetch user profile saja
      fetch(
        "https://e-commerce-jkt48-prototype-production.up.railway.app/api/auth/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
        .then((userRes) => {
          if (!userRes.ok) {
            throw new Error("Failed to fetch user data");
          }
          return userRes.json();
        })
        .then((userData) => {
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
          console.error("Error fetching user data:", error);
          alert("Gagal mengambil data user");
          navigate("/");
        });

      // Jangan hapus directBuyItem di sini, hapus setelah order berhasil
    } else {
      // Mode normal dari cart
      // Fetch cart data dan user profile
      Promise.all([
        fetch(
          "https://e-commerce-jkt48-prototype-production.up.railway.app/api/cart",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        fetch(
          "https://e-commerce-jkt48-prototype-production.up.railway.app/api/auth/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
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
    }
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
    // SweetAlert konfirmasi sebelum membuat pesanan
    const result = await Swal.fire({
      icon: "question",
      title: "Konfirmasi Pesanan",
      text: "Apakah Anda yakin ingin membuat pesanan ini?",
      html: `
        <div class="text-left">
          <p><strong>Total Pembayaran:</strong> ${formatRupiah(total)}</p>
          <p><strong>Metode Pembayaran:</strong> ${
            checkoutData.payment_method === "transfer"
              ? "Transfer Bank"
              : "Cash on Delivery"
          }</p>
          <p class="text-sm text-gray-600 mt-2">Pastikan semua data sudah benar sebelum melanjutkan.</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Ya, Buat Pesanan",
      cancelButtonText: "Batal",
      confirmButtonColor: "#cd0c0d",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return; // User membatalkan
    }

    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Data Tidak Lengkap",
        text: "Mohon lengkapi semua data yang diperlukan",
        confirmButtonText: "OK",
        confirmButtonColor: "#cd0c0d",
      });
      return;
    }

    // Validasi: pastikan ada item untuk checkout (baik dari cart atau direct buy)
    if (!directBuyItem && cartItems.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Tidak Ada Item",
        text: "Tidak ada item untuk checkout. Silakan tambahkan produk ke keranjang terlebih dahulu.",
        confirmButtonText: "Belanja Sekarang",
        confirmButtonColor: "#cd0c0d",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/");
        }
      });
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
        cart_items: directBuyItem
          ? [
              {
                product_id: directBuyItem.product_id,
                variant_id: directBuyItem.variant_id,
                quantity: directBuyItem.quantity,
                price: directBuyItem.price,
              },
            ]
          : cartItems.map((item) => ({
              cart_item_id: item.cart_item_id,
              product_id: item.product_id,
              variant_id: item.variant_id,
              quantity: item.quantity,
              price: item.Product?.price || 0,
            })),
      };

      const response = await fetch(
        "https://e-commerce-jkt48-prototype-production.up.railway.app/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        throw new Error(errorData.message || "Gagal membuat pesanan");
      }

      const result = await response.json();

      // SweetAlert sukses pesanan dibuat
      await Swal.fire({
        icon: "success",
        title: "Pesanan Berhasil Dibuat!",
        html: `
          <div class="text-center">
            <p class="mb-2">Terima kasih atas pesanan Anda!</p>
            <p><strong>Nomor Resi:</strong> ${result.tracking_number}</p>
            <p class="text-sm text-gray-600 mt-2">Anda akan diarahkan ke halaman pesanan untuk melihat status.</p>
          </div>
        `,
        confirmButtonText: "Lihat Pesanan",
        confirmButtonColor: "#cd0c0d",
        timer: 5000,
        timerProgressBar: true,
      });

      // Clear direct buy data setelah order berhasil
      localStorage.removeItem("directBuyItem");

      // Redirect langsung ke halaman Orders
      navigate("/orders");
    } catch (error) {
      console.error("Error creating order:", error);

      // SweetAlert error pesanan gagal
      Swal.fire({
        icon: "error",
        title: "Gagal Membuat Pesanan",
        text:
          error.message ||
          "Terjadi kesalahan saat membuat pesanan. Silakan coba lagi.",
        confirmButtonText: "Coba Lagi",
        confirmButtonColor: "#cd0c0d",
      });
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
  const subtotal = directBuyItem
    ? (directBuyItem.price || 0) * directBuyItem.quantity
    : cartItems.reduce(
        (sum, item) => sum + (item.Product?.price || 0) * item.quantity,
        0
      );
  const shippingCost = 15000; // Fixed shipping cost
  const total = subtotal + shippingCost;

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  console.log("Render - directBuyItem:", directBuyItem);
  console.log("Render - cartItems.length:", cartItems.length);

  if (!directBuyItem && cartItems.length === 0) {
    console.log("Showing empty cart message");
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
                    checked={true}
                    readOnly
                    className="mr-3"
                  />
                  <div>
                    <span className="font-medium">Transfer Bank</span>
                    <p className="text-sm text-gray-600">
                      Transfer ke rekening Bank (Verifikasi manual)
                    </p>
                  </div>
                </label>
              </div>

              {/* Info Transfer Bank */}
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">
                  Informasi Transfer:
                </h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>
                    <strong>Bank:</strong> BCA
                  </p>
                  <p>
                    <strong>No. Rekening:</strong> 1234567890
                  </p>
                  <p>
                    <strong>Atas Nama:</strong> JKT48 Store
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    *Setelah checkout, Anda akan diminta konfirmasi pembayaran
                    di halaman Orders
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h2>

            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {directBuyItem ? (
                // Tampilkan direct buy item
                <div className="flex items-center gap-4 border-b pb-4">
                  <img
                    src={directBuyItem.image_url || "/no-image.png"}
                    alt={directBuyItem.product_name || "Product"}
                    className="w-16 h-16 object-contain rounded"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/no-image.png";
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">
                      {directBuyItem.product_name || "Unknown Product"}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {directBuyItem.size && `Size: ${directBuyItem.size}`}
                      {directBuyItem.color && `, Color: ${directBuyItem.color}`}
                    </p>
                    <p className="text-sm">
                      {formatRupiah(directBuyItem.price || 0)} x{" "}
                      {directBuyItem.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatRupiah(
                        (directBuyItem.price || 0) * directBuyItem.quantity
                      )}
                    </p>
                  </div>
                </div>
              ) : (
                // Tampilkan cart items
                cartItems.map((item) => {
                  const image = item.Product?.image_url || "/no-image.png";

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
                })
              )}
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
