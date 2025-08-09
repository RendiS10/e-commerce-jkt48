import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Layouts/Header";
import Navbar from "../components/Layouts/Navbar";
import Footer from "../components/Layouts/Footer";
import Button from "../components/Elements/Button";

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Silakan login terlebih dahulu");
      navigate("/login");
      return;
    }

    fetch("http://localhost:5000/api/orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data pesanan");
        return res.json();
      })
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setError("Gagal mengambil data pesanan");
        setLoading(false);
      });
  }, [navigate]);

  const formatRupiah = (amount) => {
    if (!amount || isNaN(amount)) return "Rp0";
    return "Rp" + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending_payment: {
        text: "Menunggu Pembayaran",
        color: "bg-yellow-100 text-yellow-800",
      },
      payment_uploaded: {
        text: "Bukti Pembayaran Dikirim",
        color: "bg-blue-100 text-blue-800",
      },
      confirmed: { text: "Dikonfirmasi", color: "bg-green-100 text-green-800" },
      processing: { text: "Diproses", color: "bg-purple-100 text-purple-800" },
      shipped: { text: "Dikirim", color: "bg-indigo-100 text-indigo-800" },
      delivered: { text: "Terkirim", color: "bg-green-100 text-green-800" },
      completed: { text: "Selesai", color: "bg-gray-100 text-gray-800" },
      cancelled: { text: "Dibatalkan", color: "bg-red-100 text-red-800" },
    };
    const status_info = statusMap[status] || {
      text: status,
      color: "bg-gray-100 text-gray-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${status_info.color}`}
      >
        {status_info.text}
      </span>
    );
  };

  if (loading) {
    return (
      <>
        <Header />
        <Navbar />
        <div className="text-center py-8">Loading...</div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <Navbar />
        <div className="text-center text-red-500 py-8">{error}</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Pesanan Saya</h1>
          <Button
            onClick={() => navigate("/")}
            className="bg-[#cd0c0d] text-white px-6 py-2 rounded hover:bg-red-700"
          >
            Belanja Lagi
          </Button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-lg p-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Belum ada pesanan
              </h3>
              <p className="text-gray-600 mb-4">
                Anda belum memiliki pesanan apapun. Mari mulai berbelanja!
              </p>
              <Button
                onClick={() => navigate("/")}
                className="bg-[#cd0c0d] text-white px-6 py-2 rounded hover:bg-red-700"
              >
                Mulai Belanja
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.order_id}
                className="bg-white border rounded-lg p-6 shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                      Order #{order.order_id}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {getStatusBadge(order.order_status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Pembayaran</p>
                    <p className="font-semibold text-lg">
                      {formatRupiah(order.total_amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Metode Pembayaran</p>
                    <p className="font-medium">
                      {order.payment_method === "transfer"
                        ? "Transfer Bank"
                        : "Cash on Delivery"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Alamat Pengiriman</p>
                    <p className="font-medium text-sm">
                      {order.shipping_address}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                {order.OrderItems && order.OrderItems.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Item Pesanan:</h4>
                    <div className="space-y-2">
                      {order.OrderItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center text-sm"
                        >
                          <div className="flex-1">
                            <span className="font-medium">
                              {item.Product?.product_name || "Unknown Product"}
                            </span>
                            {item.ProductVariant && (
                              <span className="text-gray-600 ml-2">
                                (
                                {item.ProductVariant.size &&
                                  `Size: ${item.ProductVariant.size}`}
                                {item.ProductVariant.color &&
                                  `, Color: ${item.ProductVariant.color}`}
                                )
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="text-gray-600">
                              {item.quantity}x{" "}
                              {formatRupiah(item.price_at_purchase)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {order.notes && (
                  <div className="border-t pt-4 mt-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Catatan:</span>{" "}
                      {order.notes}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="border-t pt-4 mt-4 flex gap-2">
                  {order.order_status === "pending_payment" &&
                    order.payment_method === "transfer" && (
                      <Button
                        onClick={() =>
                          navigate("/pembayaran", {
                            state: {
                              order: order,
                              payment_method: order.payment_method,
                            },
                          })
                        }
                        className="bg-[#cd0c0d] text-white px-4 py-2 rounded text-sm hover:bg-red-700"
                      >
                        Bayar Sekarang
                      </Button>
                    )}
                  {order.order_status === "confirmed" &&
                    order.payment_method === "cod" && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm">
                        Pesanan COD dikonfirmasi - Menunggu pengiriman
                      </span>
                    )}
                  {order.tracking_number && (
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">
                      Resi: {order.tracking_number}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Orders;
