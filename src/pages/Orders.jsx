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
        console.log("Orders received from backend:", data);
        // Debug: Check status types
        data.forEach((order) => {
          console.log(
            `Order ${order.order_id}: status="${
              order.order_status
            }" (type: ${typeof order.order_status})`
          );
        });
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

  const handleCancelOrder = async (orderId) => {
    // Debug: Log order details before cancellation
    const orderToCancel = orders.find((order) => order.order_id === orderId);
    console.log("Attempting to cancel order:", {
      orderId: orderId,
      orderStatus: orderToCancel?.order_status,
      statusType: typeof orderToCancel?.order_status,
      canCancel: canCancelOrder(orderToCancel?.order_status),
    });

    if (!window.confirm("Apakah Anda yakin ingin membatalkan pesanan ini?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/cancel`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Cancel order failed:", {
          status: response.status,
          statusText: response.statusText,
          errorData: errorData,
          orderId: orderId,
        });
        throw new Error(errorData.message || "Gagal membatalkan pesanan");
      }

      const result = await response.json();
      alert("Pesanan berhasil dibatalkan");

      // Update status pesanan di state lokal
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === orderId
            ? { ...order, order_status: "Dibatalkan" }
            : order
        )
      );
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert(error.message || "Gagal membatalkan pesanan. Silakan coba lagi.");
    }
  };

  const canCancelOrder = (orderStatus) => {
    // Status yang bisa dibatalkan - hanya "Menunggu Konfirmasi"
    const cancellableStatuses = [
      "Menunggu Konfirmasi", // Status awal yang bisa dibatalkan
    ];

    const result = cancellableStatuses.includes(orderStatus);
    console.log("canCancelOrder check:", {
      orderStatus,
      statusType: typeof orderStatus,
      cancellableStatuses,
      result,
    });

    return result;
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      // Handle null or undefined status
      null: {
        text: "Menunggu Konfirmasi",
        color: "bg-yellow-100 text-yellow-800",
      },
      undefined: {
        text: "Menunggu Konfirmasi",
        color: "bg-yellow-100 text-yellow-800",
      },
      // Status text yang baru
      "Menunggu Konfirmasi": {
        text: "Menunggu Konfirmasi",
        color: "bg-yellow-100 text-yellow-800",
      },
      Diproses: { text: "Diproses", color: "bg-purple-100 text-purple-800" },
      Dikirim: { text: "Dikirim", color: "bg-indigo-100 text-indigo-800" },
      Selesai: { text: "Selesai", color: "bg-green-100 text-green-800" },
      Dibatalkan: { text: "Dibatalkan", color: "bg-red-100 text-red-800" },
    };
    const status_info = statusMap[status] || {
      text: status || "Pesanan Baru",
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
                      Dipesan:{" "}
                      {new Date(
                        order.order_date || order.created_at
                      ).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {order.updated_at &&
                      order.updated_at !==
                        (order.order_date || order.created_at) && (
                        <p className="text-sm text-gray-500">
                          Update terakhir:{" "}
                          {new Date(order.updated_at).toLocaleDateString(
                            "id-ID",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      )}
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
                    <p className="font-medium">Cash on Delivery (COD)</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Nomor Resi</p>
                    <p className="font-medium text-sm text-blue-600">
                      {order.tracking_number || "Belum tersedia"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Alamat Pengiriman</p>
                    <p className="font-medium text-sm">
                      {order.shipping_address}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Kota & Kode Pos</p>
                    <p className="font-medium text-sm">
                      {order.shipping_city}, {order.shipping_postal_code}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                {order.OrderItems && order.OrderItems.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">
                      Item Pesanan ({order.OrderItems.length} item):
                    </h4>
                    <div className="space-y-3">
                      {order.OrderItems.map((item, index) => (
                        <div
                          key={item.order_item_id || index}
                          className="flex justify-between items-start bg-gray-50 p-3 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              {item.Product?.main_image && (
                                <img
                                  src={`http://localhost:5000/${item.Product.main_image.replace(
                                    /^\/+/,
                                    ""
                                  )}`}
                                  alt={item.Product?.product_name || "Product"}
                                  className="w-12 h-12 object-contain rounded border"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                  }}
                                />
                              )}
                              <div>
                                <span className="font-medium block">
                                  {item.Product?.product_name ||
                                    "Unknown Product"}
                                </span>
                                {item.ProductVariant && (
                                  <span className="text-gray-600 text-sm block">
                                    {item.ProductVariant.size &&
                                      `Size: ${item.ProductVariant.size}`}
                                    {item.ProductVariant.color &&
                                      `, Color: ${item.ProductVariant.color}`}
                                  </span>
                                )}
                                <span className="text-sm text-gray-500">
                                  Qty: {item.quantity} ×{" "}
                                  {formatRupiah(item.price_at_purchase)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold text-lg">
                              {formatRupiah(
                                item.price_at_purchase * item.quantity
                              )}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total Breakdown */}
                    <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal produk:</span>
                          <span>
                            {formatRupiah(
                              order.OrderItems.reduce(
                                (sum, item) =>
                                  sum + item.price_at_purchase * item.quantity,
                                0
                              )
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ongkos kirim:</span>
                          <span>{formatRupiah(15000)}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-base border-t pt-1">
                          <span>Total:</span>
                          <span>{formatRupiah(order.total_amount)}</span>
                        </div>
                      </div>
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
                <div className="border-t pt-4 mt-4 flex flex-wrap gap-2">
                  {order.order_status === "Diproses" && (
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded text-sm">
                      📦 Pesanan sedang diproses
                    </span>
                  )}
                  {order.order_status === "Dikirim" && (
                    <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded text-sm">
                      🚚 Pesanan dalam perjalanan
                    </span>
                  )}
                  {order.order_status === "Selesai" && (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm">
                      ✅ Pesanan telah sampai
                    </span>
                  )}
                  {(order.order_status === "Menunggu Konfirmasi" ||
                    order.order_status === null ||
                    order.order_status === undefined) && (
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm">
                      ⏳ Menunggu konfirmasi admin - COD belum dikonfirmasi
                    </span>
                  )}
                  {order.order_status === "Dibatalkan" && (
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm">
                      ❌ Pesanan dibatalkan
                    </span>
                  )}

                  {/* Cancel Button - only show if order can be cancelled */}
                  {canCancelOrder(order.order_status) && (
                    <Button
                      onClick={() => handleCancelOrder(order.order_id)}
                      className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600 transition-colors"
                    >
                      🗑️ Batalkan Pesanan
                    </Button>
                  )}

                  {order.tracking_number && (
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-mono">
                      📋 Resi: {order.tracking_number}
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
