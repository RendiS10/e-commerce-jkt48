import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Layouts/Header";
import Navbar from "../../components/Layouts/Navbar";
import Footer from "../../components/Layouts/Footer";
import Button from "../../components/Elements/Button";

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua"); // Filter state
  const [searchQuery, setSearchQuery] = useState(""); // Search state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewableProducts, setReviewableProducts] = useState([]);
  const [reviewData, setReviewData] = useState({});
  const [orderReviewStatus, setOrderReviewStatus] = useState({}); // Track review status per order
  const [orderPaymentStatus, setOrderPaymentStatus] = useState({}); // Track payment status per order
  const [paymentData, setPaymentData] = useState({
    bank_name: "",
    account_number: "",
    account_name: "",
    payment_date: "",
  });

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
        setFilteredOrders(data); // Initialize filtered orders

        // Load review status for completed orders
        loadReviewStatus(
          data.filter((order) => order.order_status === "Selesai")
        );

        // Load payment status for orders needing payment
        loadPaymentStatus(
          data.filter((order) => order.order_status === "Menunggu Konfirmasi")
        );

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setError("Gagal mengambil data pesanan");
        setLoading(false);
      });
  }, [navigate]);

  // Load review status for completed orders
  const loadReviewStatus = async (completedOrders) => {
    const reviewStatusPromises = completedOrders.map(async (order) => {
      const status = await checkOrderReviewStatus(order.order_id);
      return { orderId: order.order_id, ...status };
    });

    try {
      const reviewStatuses = await Promise.all(reviewStatusPromises);
      const statusMap = {};
      reviewStatuses.forEach((status) => {
        statusMap[status.orderId] = status;
      });
      setOrderReviewStatus(statusMap);
    } catch (error) {
      console.error("Error loading review statuses:", error);
    }
  };

  // Load payment status for orders needing payment
  const loadPaymentStatus = async (pendingOrders) => {
    const paymentStatusPromises = pendingOrders.map(async (order) => {
      const status = await checkOrderPaymentStatus(order.order_id);
      return { orderId: order.order_id, ...status };
    });

    try {
      const paymentStatuses = await Promise.all(paymentStatusPromises);
      const statusMap = {};
      paymentStatuses.forEach((status) => {
        statusMap[status.orderId] = status;
      });
      setOrderPaymentStatus(statusMap);
    } catch (error) {
      console.error("Error loading payment statuses:", error);
    }
  };

  // Fungsi untuk mengecek status pembayaran order
  const checkOrderPaymentStatus = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/payments/order/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        return { hasPaid: false, paymentExists: false };
      }

      const payment = await response.json();
      const hasPaid =
        payment.bank_name && payment.account_number && payment.account_name;

      return {
        hasPaid,
        paymentExists: true,
        payment: payment,
      };
    } catch (error) {
      console.error("Error checking payment status:", error);
      return { hasPaid: false, paymentExists: false };
    }
  };

  // Filter function
  const applyFilters = () => {
    let filtered = orders;

    // Apply status filter
    if (statusFilter !== "Semua") {
      filtered = filtered.filter((order) => {
        const orderStatus = order.order_status || "Menunggu Konfirmasi";
        return orderStatus === statusFilter;
      });
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter((order) => {
        return (
          order.order_id.toString().includes(query) ||
          (order.tracking_number &&
            order.tracking_number.toLowerCase().includes(query)) ||
          (order.notes && order.notes.toLowerCase().includes(query))
        );
      });
    }

    setFilteredOrders(filtered);
  };

  const handleStatusFilter = (selectedStatus) => {
    setStatusFilter(selectedStatus);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Update filtered orders when filters change
  useEffect(() => {
    applyFilters();
  }, [orders, statusFilter, searchQuery]);

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

  // Handle payment modal
  const handleOpenPaymentModal = (order) => {
    setSelectedOrder(order);
    setShowPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedOrder(null);
    setPaymentData({
      bank_name: "",
      account_number: "",
      account_name: "",
      payment_date: "",
    });
  };

  const handleConfirmPayment = async () => {
    try {
      const token = localStorage.getItem("token");

      // Cari payment yang sudah ada untuk order ini
      const getPaymentResponse = await fetch(
        `http://localhost:5000/api/payments/order/${selectedOrder.order_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!getPaymentResponse.ok) {
        const errorData = await getPaymentResponse.json();
        throw new Error(errorData.message || "Payment tidak ditemukan");
      }

      const payment = await getPaymentResponse.json();
      console.log("Payment found:", payment);

      // Konfirmasi pembayaran dengan payment_id yang sudah ada
      const confirmResponse = await fetch(
        `http://localhost:5000/api/payments/${payment.payment_id}/confirm`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...paymentData,
            payment_date: paymentData.payment_date || new Date().toISOString(),
          }),
        }
      );

      if (!confirmResponse.ok) {
        const errorData = await confirmResponse.json();
        throw new Error(errorData.message || "Gagal konfirmasi pembayaran");
      }

      const result = await confirmResponse.json();
      alert("Pembayaran berhasil dikonfirmasi. Menunggu verifikasi admin.");

      // Update payment status for this order
      setOrderPaymentStatus((prev) => ({
        ...prev,
        [selectedOrder.order_id]: {
          hasPaid: true,
          paymentExists: true,
          payment: result.payment || payment,
        },
      }));

      handleClosePaymentModal();

      // No need to reload page anymore
      // window.location.reload();
    } catch (error) {
      console.error("Error confirming payment:", error);
      alert(error.message || "Gagal konfirmasi pembayaran");
    }
  };

  const needsPayment = (order) => {
    // Order dengan status "Menunggu Konfirmasi" masih perlu payment confirmation
    // Tapi cek juga apakah sudah pernah bayar
    const paymentStatus = orderPaymentStatus[order.order_id];
    return (
      order.order_status === "Menunggu Konfirmasi" &&
      (!paymentStatus || !paymentStatus.hasPaid)
    );
  };

  // Konfirmasi pesanan diterima
  const handleConfirmOrderReceived = async (orderId) => {
    if (!window.confirm("Apakah Anda yakin pesanan sudah diterima?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/confirm-received`,
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
        throw new Error(
          errorData.message || "Gagal konfirmasi pesanan diterima"
        );
      }

      const result = await response.json();
      alert(
        "Pesanan berhasil dikonfirmasi diterima dan otomatis diselesaikan!"
      );

      // Update status pesanan di state lokal langsung ke "Selesai"
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === orderId
            ? { ...order, order_status: "Selesai" }
            : order
        )
      );
    } catch (error) {
      console.error("Error confirming order received:", error);
      alert(error.message || "Gagal konfirmasi pesanan diterima");
    }
  };

  // Fungsi untuk mengecek apakah semua produk sudah di-review
  const checkOrderReviewStatus = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/reviews/order/${orderId}/reviewable`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) return { allReviewed: false, hasProducts: false };

      const data = await response.json();
      const allReviewed = data.products.every((item) => item.already_reviewed);

      return {
        allReviewed,
        hasProducts: data.products.length > 0,
        totalProducts: data.products.length,
        reviewedCount: data.products.filter((item) => item.already_reviewed)
          .length,
      };
    } catch (error) {
      console.error("Error checking review status:", error);
      return { allReviewed: false, hasProducts: false };
    }
  };

  // Buka modal review
  const handleOpenReviewModal = async (order) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/reviews/order/${order.order_id}/reviewable`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal mengambil data produk");
      }

      const data = await response.json();

      // Cek apakah semua produk sudah di-review
      const allReviewed = data.products.every((item) => item.already_reviewed);

      if (allReviewed) {
        alert(
          "Anda sudah memberikan review untuk semua produk di pesanan ini."
        );
        return;
      }

      setReviewableProducts(data.products);
      setSelectedOrder(order);
      setShowReviewModal(true);

      // Initialize review data
      const initialReviewData = {};
      data.products.forEach((item) => {
        if (!item.already_reviewed) {
          initialReviewData[item.product_id] = {
            rating: 5,
            comment: "",
          };
        }
      });
      setReviewData(initialReviewData);
    } catch (error) {
      console.error("Error fetching reviewable products:", error);
      alert(error.message || "Gagal mengambil data produk untuk review");
    }
  };

  // Submit review
  const handleSubmitReviews = async () => {
    try {
      const token = localStorage.getItem("token");
      const reviewPromises = [];

      // Submit review untuk setiap produk yang belum direview
      for (const [productId, review] of Object.entries(reviewData)) {
        if (review.rating && review.rating > 0) {
          reviewPromises.push(
            fetch("http://localhost:5000/api/reviews/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                order_id: selectedOrder.order_id,
                product_id: parseInt(productId),
                rating: review.rating,
                comment: review.comment || "",
              }),
            })
          );
        }
      }

      const responses = await Promise.all(reviewPromises);

      // Check if all reviews were submitted successfully
      for (const response of responses) {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Gagal submit review");
        }
      }

      alert("Review berhasil dikirim! Terima kasih atas feedback Anda.");

      // Update review status for this order
      const updatedStatus = await checkOrderReviewStatus(
        selectedOrder.order_id
      );
      setOrderReviewStatus((prev) => ({
        ...prev,
        [selectedOrder.order_id]: updatedStatus,
      }));

      setShowReviewModal(false);
      setSelectedOrder(null);
      setReviewableProducts([]);
      setReviewData({});
    } catch (error) {
      console.error("Error submitting reviews:", error);
      alert(error.message || "Gagal mengirim review");
    }
  };

  // Update review data
  const handleReviewChange = (productId, field, value) => {
    setReviewData((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
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
      Disetujui: {
        text: "Disetujui",
        color: "bg-blue-100 text-blue-800",
      },
      "Akan Dikirimkan": {
        text: "Akan Dikirimkan",
        color: "bg-purple-100 text-purple-800",
      },
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

        {/* Filter Section */}
        <div className="mb-6 bg-white p-4 rounded-lg border shadow-sm">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari berdasarkan Order ID, nomor resi, atau catatan..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cd0c0d] focus:border-[#cd0c0d] text-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg
                    className="h-4 w-4 text-gray-400 hover:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Filter Status:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  "Semua",
                  "Menunggu Konfirmasi",
                  "Disetujui",
                  "Akan Dikirimkan",
                  "Dikirim",
                  "Selesai",
                  "Dibatalkan",
                ].map((status) => {
                  const count =
                    status === "Semua"
                      ? orders.length
                      : orders.filter(
                          (order) =>
                            (order.order_status || "Menunggu Konfirmasi") ===
                            status
                        ).length;

                  return (
                    <button
                      key={status}
                      onClick={() => handleStatusFilter(status)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        statusFilter === status
                          ? "bg-[#cd0c0d] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      } ${
                        count === 0 && status !== "Semua"
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      disabled={count === 0 && status !== "Semua"}
                    >
                      {status}
                      <span className="ml-1 text-xs opacity-75">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick stats */}
            <div className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded">
              Total: {orders.length} pesanan
            </div>
          </div>
        </div>

        {filteredOrders.length === 0 && orders.length > 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-lg p-8">
              {searchQuery ? (
                <>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Tidak ditemukan pesanan dengan kata kunci "{searchQuery}"
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Coba gunakan kata kunci lain atau ubah filter status.
                  </p>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => setSearchQuery("")}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Hapus Pencarian
                    </button>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        handleStatusFilter("Semua");
                      }}
                      className="bg-[#cd0c0d] text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Reset Semua Filter
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Tidak ada pesanan dengan status "{statusFilter}"
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Coba ubah filter status untuk melihat pesanan lainnya.
                  </p>
                  <button
                    onClick={() => handleStatusFilter("Semua")}
                    className="bg-[#cd0c0d] text-white px-6 py-2 rounded hover:bg-red-700"
                  >
                    Tampilkan Semua
                  </button>
                </>
              )}
            </div>
          </div>
        ) : orders.length === 0 ? (
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
            {/* Info showing filtered results */}
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
              {searchQuery ? (
                <span>
                  🔍 Hasil pencarian "<strong>{searchQuery}</strong>":
                  <strong> {filteredOrders.length}</strong> pesanan ditemukan
                  {statusFilter !== "Semua" && (
                    <span>
                      {" "}
                      dengan status "<strong>{statusFilter}</strong>"
                    </span>
                  )}
                </span>
              ) : statusFilter === "Semua" ? (
                <span>
                  📋 Menampilkan <strong>{filteredOrders.length}</strong> dari{" "}
                  <strong>{orders.length}</strong> total pesanan
                </span>
              ) : (
                <span>
                  🔍 Menampilkan <strong>{filteredOrders.length}</strong>{" "}
                  pesanan dengan status "<strong>{statusFilter}</strong>"
                  {filteredOrders.length !== orders.length && (
                    <span>
                      {" "}
                      dari <strong>{orders.length}</strong> total pesanan
                    </span>
                  )}
                </span>
              )}
            </div>

            {filteredOrders.map((order) => (
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
                    <p className="font-medium">Transfer Bank</p>
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
                      ⏳ Menunggu pembayaran transfer
                    </span>
                  )}
                  {order.order_status === "Dibatalkan" && (
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm">
                      ❌ Pesanan dibatalkan
                    </span>
                  )}

                  {/* Payment Button/Status - for transfer orders */}
                  {order.order_status === "Menunggu Konfirmasi" &&
                    (() => {
                      const paymentStatus = orderPaymentStatus[order.order_id];

                      if (!paymentStatus) {
                        // Still loading payment status
                        return (
                          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-sm">
                            💳 Memuat status pembayaran...
                          </span>
                        );
                      }

                      if (paymentStatus.hasPaid) {
                        // Already paid, waiting for admin verification
                        return (
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">
                            ✅ Anda sudah membayar, tunggu admin
                          </span>
                        );
                      }

                      // Can still pay
                      return (
                        <Button
                          onClick={() => handleOpenPaymentModal(order)}
                          className="bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600 transition-colors"
                        >
                          💳 Bayar Sekarang
                        </Button>
                      );
                    })()}

                  {/* Cancel Button - only show if order can be cancelled */}
                  {canCancelOrder(order.order_status) && (
                    <Button
                      onClick={() => handleCancelOrder(order.order_id)}
                      className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600 transition-colors"
                    >
                      🗑️ Batalkan Pesanan
                    </Button>
                  )}

                  {/* Confirm Received Button - only show if order is shipped */}
                  {order.order_status === "Dikirim" && (
                    <Button
                      onClick={() => handleConfirmOrderReceived(order.order_id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 transition-colors"
                    >
                      ✅ Konfirmasi Diterima
                    </Button>
                  )}

                  {/* Review Button/Status - only show if order is completed */}
                  {order.order_status === "Selesai" &&
                    (() => {
                      const reviewStatus = orderReviewStatus[order.order_id];

                      if (!reviewStatus) {
                        // Still loading review status
                        return (
                          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-sm">
                            📝 Memuat status review...
                          </span>
                        );
                      }

                      if (!reviewStatus.hasProducts) {
                        // No products to review
                        return (
                          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-sm">
                            📝 Tidak ada produk untuk direview
                          </span>
                        );
                      }

                      if (reviewStatus.allReviewed) {
                        // All products already reviewed
                        return (
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm">
                            ✅ Anda sudah memberi review
                          </span>
                        );
                      }

                      // Some products can still be reviewed
                      const { reviewedCount, totalProducts } = reviewStatus;
                      return (
                        <Button
                          onClick={() => handleOpenReviewModal(order)}
                          className="bg-purple-500 text-white px-4 py-2 rounded text-sm hover:bg-purple-600 transition-colors"
                        >
                          ⭐ Beri Review{" "}
                          {reviewedCount > 0
                            ? `(${totalProducts - reviewedCount} tersisa)`
                            : ""}
                        </Button>
                      );
                    })()}

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

      {/* Payment Modal */}
      {showPaymentModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Konfirmasi Pembayaran Transfer
              </h3>
              <button
                onClick={handleClosePaymentModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">
                Order ID: {selectedOrder.order_id}
              </p>
              <p className="text-lg font-semibold text-purple-600">
                Total: {formatRupiah(selectedOrder.total_amount)}
              </p>
            </div>

            <div className="mb-4 p-3 bg-blue-50 rounded text-sm">
              <p className="font-medium text-blue-800 mb-2">
                Informasi Transfer:
              </p>
              <p className="text-blue-700">Bank: BCA</p>
              <p className="text-blue-700">No. Rekening: 1234567890</p>
              <p className="text-blue-700">Atas Nama: JKT48 Store</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Bank Pengirim
                </label>
                <input
                  type="text"
                  value={paymentData.bank_name}
                  onChange={(e) =>
                    setPaymentData({
                      ...paymentData,
                      bank_name: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Contoh: BCA, Mandiri, BNI"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Rekening Pengirim
                </label>
                <input
                  type="text"
                  value={paymentData.account_number}
                  onChange={(e) =>
                    setPaymentData({
                      ...paymentData,
                      account_number: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Nomor rekening Anda"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Pemilik Rekening
                </label>
                <input
                  type="text"
                  value={paymentData.account_name}
                  onChange={(e) =>
                    setPaymentData({
                      ...paymentData,
                      account_name: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Nama sesuai rekening"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Transfer
                </label>
                <input
                  type="datetime-local"
                  value={paymentData.payment_date}
                  onChange={(e) =>
                    setPaymentData({
                      ...paymentData,
                      payment_date: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleClosePaymentModal}
                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                Batal
              </Button>
              <Button
                onClick={() => handleConfirmPayment()}
                className="flex-1 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
                disabled={
                  !paymentData.bank_name ||
                  !paymentData.account_number ||
                  !paymentData.account_name
                }
              >
                Konfirmasi Pembayaran
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Review & Rating Produk</h2>
              <p className="text-gray-600 mb-6">
                Berikan review dan rating untuk produk yang sudah Anda terima
              </p>

              <div className="space-y-6">
                {reviewableProducts?.map((item) => (
                  <div key={item.product_id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={
                          item.Product?.image_url || "/placeholder-image.jpg"
                        }
                        alt={item.Product?.product_name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">
                          {item.Product?.product_name}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          Qty: {item.quantity}
                        </p>

                        {item.already_reviewed ? (
                          <div className="mt-2 text-green-600 text-sm">
                            ✅ Sudah direview
                          </div>
                        ) : (
                          <div className="mt-3 space-y-3">
                            {/* Rating */}
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Rating (1-5):
                              </label>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() =>
                                      handleReviewChange(
                                        item.product_id,
                                        "rating",
                                        star
                                      )
                                    }
                                    className={`text-2xl ${
                                      star <=
                                      (reviewData[item.product_id]?.rating || 0)
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  >
                                    ⭐
                                  </button>
                                ))}
                                <span className="ml-2 text-sm text-gray-600">
                                  ({reviewData[item.product_id]?.rating || 0}/5)
                                </span>
                              </div>
                            </div>

                            {/* Comment */}
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Komentar (opsional):
                              </label>
                              <textarea
                                rows={3}
                                value={
                                  reviewData[item.product_id]?.comment || ""
                                }
                                onChange={(e) =>
                                  handleReviewChange(
                                    item.product_id,
                                    "comment",
                                    e.target.value
                                  )
                                }
                                placeholder="Tulis review Anda tentang produk ini..."
                                className="w-full border rounded-lg px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => {
                    setShowReviewModal(false);
                    setSelectedOrder(null);
                    setReviewableProducts([]);
                    setReviewData({});
                  }}
                  className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleSubmitReviews}
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
                  disabled={Object.keys(reviewData).length === 0}
                >
                  Kirim Review
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Orders;
