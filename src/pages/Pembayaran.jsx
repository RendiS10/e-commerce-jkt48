import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Layouts/Header";
import Navbar from "../components/Layouts/Navbar";
import Footer from "../components/Layouts/Footer";
import Button from "../components/Elements/Button";

function Pembayaran() {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentProof, setPaymentProof] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    // Get order data from navigation state
    if (location.state?.order) {
      setOrder(location.state.order);
      setPaymentMethod(location.state.payment_method || "transfer");
    } else {
      // Jika tidak ada data order, redirect ke home
      navigate("/");
    }
  }, [location.state, navigate]);

  const formatRupiah = (amount) => {
    if (!amount || isNaN(amount)) return "Rp0";
    return "Rp" + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("Ukuran file terlalu besar. Maksimal 5MB.");
        return;
      }
      setPaymentProof(file);
    }
  };

  const handleUploadProof = async () => {
    if (!paymentProof) {
      alert("Mohon pilih file bukti pembayaran");
      return;
    }

    try {
      setUploadLoading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("payment_proof", paymentProof);
      formData.append("order_id", order.order_id);

      const response = await fetch(
        "http://localhost:5000/api/orders/payment-proof",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Gagal upload bukti pembayaran");
      }

      alert("Bukti pembayaran berhasil dikirim!");
      navigate("/orders"); // Redirect ke halaman orders
    } catch (error) {
      console.error("Error uploading payment proof:", error);
      alert("Gagal upload bukti pembayaran. Silakan coba lagi.");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleConfirmCOD = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/orders/${order.order_id}/confirm-cod`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Gagal konfirmasi COD");
      }

      alert("Pesanan COD berhasil dikonfirmasi!");
      navigate("/orders");
    } catch (error) {
      console.error("Error confirming COD:", error);
      alert("Gagal konfirmasi COD. Silakan coba lagi.");
    }
  };

  if (!order) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <>
      <Header />
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Pembayaran</h1>

          {/* Order Info */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-semibold mb-2">Informasi Pesanan</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p>
                  <span className="font-medium">Order ID:</span>{" "}
                  {order.order_id}
                </p>
                <p>
                  <span className="font-medium">Total:</span>{" "}
                  {formatRupiah(order.total_amount)}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  {order.order_status}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-medium">Tanggal:</span>{" "}
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">Metode Pembayaran:</span>{" "}
                  {paymentMethod === "transfer"
                    ? "Transfer Bank"
                    : "Cash on Delivery"}
                </p>
              </div>
            </div>
          </div>

          {paymentMethod === "transfer" ? (
            /* Transfer Payment Section */
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Pembayaran Transfer Bank
              </h2>

              {/* Bank Account Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-3">Informasi Rekening</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Bank BCA</span>
                    <span className="font-mono">1234567890</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bank BNI</span>
                    <span className="font-mono">0987654321</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bank Mandiri</span>
                    <span className="font-mono">1357924680</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Atas Nama</span>
                    <span className="font-semibold">JKT48 Official Store</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold mb-2">
                  Jumlah yang harus dibayar:
                </h4>
                <p className="text-2xl font-bold text-[#cd0c0d]">
                  {formatRupiah(order.total_amount)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Mohon transfer sesuai nominal di atas untuk mempercepat
                  verifikasi
                </p>
              </div>

              {/* Upload Payment Proof */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6">
                <h3 className="font-semibold mb-3">Upload Bukti Pembayaran</h3>
                <div className="space-y-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#cd0c0d] file:text-white hover:file:bg-red-700"
                  />
                  {paymentProof && (
                    <p className="text-sm text-green-600">
                      File dipilih: {paymentProof.name}
                    </p>
                  )}
                  <Button
                    onClick={handleUploadProof}
                    disabled={!paymentProof || uploadLoading}
                    className="bg-[#cd0c0d] text-white px-6 py-2 rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    {uploadLoading ? "Uploading..." : "Kirim Bukti Pembayaran"}
                  </Button>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Petunjuk:</h4>
                <ol className="text-sm space-y-1 list-decimal list-inside">
                  <li>Transfer sesuai nominal yang tertera di atas</li>
                  <li>Simpan bukti transfer (screenshot atau foto)</li>
                  <li>Upload bukti transfer di form di atas</li>
                  <li>Pesanan akan diproses setelah pembayaran dikonfirmasi</li>
                </ol>
              </div>
            </div>
          ) : (
            /* COD Payment Section */
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Cash on Delivery (COD)
              </h2>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-3">Informasi COD</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">
                      Jumlah yang harus dibayar:
                    </span>{" "}
                    {formatRupiah(order.total_amount)}
                  </p>
                  <p>
                    <span className="font-medium">Alamat pengiriman:</span>{" "}
                    {order.shipping_address}
                  </p>
                  <p className="text-gray-600">
                    Pembayaran dilakukan saat barang diterima oleh kurir
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold mb-2">Petunjuk COD:</h4>
                <ol className="text-sm space-y-1 list-decimal list-inside">
                  <li>Pesanan akan diproses setelah konfirmasi</li>
                  <li>Kurir akan menghubungi Anda sebelum pengiriman</li>
                  <li>Siapkan uang pas sesuai total pembayaran</li>
                  <li>Periksa barang sebelum melakukan pembayaran</li>
                </ol>
              </div>

              <Button
                onClick={handleConfirmCOD}
                className="w-full bg-[#cd0c0d] text-white py-3 rounded-lg font-medium hover:bg-red-700"
              >
                Konfirmasi Pesanan COD
              </Button>
            </div>
          )}

          {/* Back Button */}
          <div className="mt-6 pt-4 border-t">
            <Button
              onClick={() => navigate("/")}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
            >
              Kembali ke Beranda
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Pembayaran;
