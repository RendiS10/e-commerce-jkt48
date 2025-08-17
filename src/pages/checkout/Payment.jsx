import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Layouts/Header";
import Navbar from "../../components/Layouts/Navbar";
import Footer from "../../components/Layouts/Footer";
import Button from "../../components/Elements/Button";

function PembayaranPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Get order data from navigation state
    if (location.state?.order) {
      setOrder(location.state.order);
    } else {
      // Jika tidak ada data order, redirect ke home
      navigate("/");
    }
  }, [location.state, navigate]);

  const formatRupiah = (amount) => {
    if (!amount || isNaN(amount)) return "Rp0";
    return "Rp" + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleConfirmCOD = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/orders/${order.order_id}/confirm-cod`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Gagal konfirmasi pesanan COD");
      }

      alert("Pesanan COD berhasil dikonfirmasi!");
      navigate("/orders");
    } catch (error) {
      console.error("Error confirming COD:", error);
      alert("Gagal konfirmasi pesanan COD. Silakan coba lagi.");
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
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">Konfirmasi Pembayaran</h1>

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
                  <span className="font-medium">Metode Pembayaran:</span> Cash
                  on Delivery (COD)
                </p>
              </div>
            </div>
          </div>

          {/* COD Payment Section */}
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

export default PembayaranPage;
