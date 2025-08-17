import React, { useState, useEffect } from "react";
import AdminLayoutFixed from "../../../components/admin/AdminLayoutFixed.jsx";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentView, setCurrentView] = useState("orders"); // 'orders' or 'payments'

  useEffect(() => {
    fetchOrders();
    fetchPayments();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/orders/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Orders data:", data); // Debug log
        setOrders(data);
      } else {
        console.error("Failed to fetch orders:", response.status);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/payments/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Payments data:", data); // Debug log
        setPayments(data);
      } else {
        console.error("Failed to fetch payments:", response.status);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ order_status: newStatus }),
        }
      );

      if (response.ok) {
        console.log("Order status updated successfully");
        fetchOrders(); // Refresh data
        setShowModal(false);
        setShowDetailModal(false);
      } else {
        console.error("Failed to update order status:", response.status);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const approvePayment = async (paymentId, adminNotes = "") => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/payments/${paymentId}/approve`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ admin_notes: adminNotes }),
        }
      );

      if (response.ok) {
        alert("Pembayaran berhasil disetujui!");
        fetchPayments();
        fetchOrders();
        setShowPaymentModal(false);
      } else {
        const errorData = await response.json();
        alert("Gagal menyetujui pembayaran: " + errorData.message);
      }
    } catch (error) {
      console.error("Error approving payment:", error);
      alert("Gagal menyetujui pembayaran");
    }
  };

  const rejectPayment = async (paymentId, adminNotes = "") => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/payments/${paymentId}/reject`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ admin_notes: adminNotes }),
        }
      );

      if (response.ok) {
        alert("Pembayaran ditolak!");
        fetchPayments();
        fetchOrders();
        setShowPaymentModal(false);
      } else {
        const errorData = await response.json();
        alert("Gagal menolak pembayaran: " + errorData.message);
      }
    } catch (error) {
      console.error("Error rejecting payment:", error);
      alert("Gagal menolak pembayaran");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Menunggu Konfirmasi":
        return "bg-yellow-100 text-yellow-800";
      case "Disetujui":
        return "bg-blue-100 text-blue-800";
      case "Akan Dikirimkan":
        return "bg-purple-100 text-purple-800";
      case "Dikirim":
        return "bg-indigo-100 text-indigo-800";
      case "Selesai":
        return "bg-green-100 text-green-800";
      case "Dibatalkan":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Menunggu Pembayaran":
        return "bg-yellow-100 text-yellow-800";
      case "Menunggu Konfirmasi":
        return "bg-orange-100 text-orange-800";
      case "Disetujui":
        return "bg-green-100 text-green-800";
      case "Ditolak":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const showOrderDetail = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const showStatusModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const showPaymentDetail = (payment) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
  };

  if (loading) {
    return (
      <AdminLayoutFixed>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading orders...</div>
        </div>
      </AdminLayoutFixed>
    );
  }

  return (
    <AdminLayoutFixed>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Orders & Payments Management
          </h1>
          <div className="text-sm text-gray-500">
            Total Orders: {orders.length} | Total Payments: {payments.length}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setCurrentView("orders")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                currentView === "orders"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              📋 Orders
            </button>
            <button
              onClick={() => setCurrentView("payments")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                currentView === "payments"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              💳 Payments
            </button>
          </nav>
        </div>

        {/* Orders View */}
        {currentView === "orders" && (
          <>
            {/* Order Status Summary */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {[
                "Menunggu Konfirmasi",
                "Disetujui",
                "Akan Dikirimkan",
                "Dikirim",
                "Selesai",
                "Dibatalkan",
              ].map((status) => {
                const count = orders.filter(
                  (order) => order.order_status === status
                ).length;
                return (
                  <div
                    key={status}
                    className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500"
                  >
                    <h3 className="text-xs font-medium text-gray-600">
                      {status}
                    </h3>
                    <p className="text-xl font-bold text-purple-600">{count}</p>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Payments View */}
        {currentView === "payments" && (
          <>
            {/* Payment Status Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                "Menunggu Pembayaran",
                "Menunggu Konfirmasi",
                "Disetujui",
                "Ditolak",
              ].map((status) => {
                const count = payments.filter(
                  (payment) => payment.payment_status === status
                ).length;
                return (
                  <div
                    key={status}
                    className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500"
                  >
                    <h3 className="text-sm font-medium text-gray-600">
                      {status}
                    </h3>
                    <p className="text-2xl font-bold text-blue-600">{count}</p>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Orders Table */}
        {currentView === "orders" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.order_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.order_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.User?.full_name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Rp{" "}
                        {parseFloat(order.total_amount).toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="uppercase font-medium">
                          {order.payment_method}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            order.order_status
                          )}`}
                        >
                          {order.order_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.order_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => showOrderDetail(order)}
                          className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                        >
                          View Detail
                        </button>
                        <button
                          onClick={() => showStatusModal(order)}
                          className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                        >
                          Change Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payments Table */}
        {currentView === "payments" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.payment_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{payment.payment_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        #{payment.order_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.User?.full_name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Rp{" "}
                        {parseFloat(payment.payment_amount).toLocaleString(
                          "id-ID"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(
                            payment.payment_status
                          )}`}
                        >
                          {payment.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.payment_date
                          ? formatDate(payment.payment_date)
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => showPaymentDetail(payment)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View Detail
                        </button>
                        {payment.payment_status === "Menunggu Konfirmasi" && (
                          <>
                            <button
                              onClick={() => approvePayment(payment.payment_id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => rejectPayment(payment.payment_id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Order Detail Modal */}
        {showDetailModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Order Detail #{selectedOrder.order_id}
                  </h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                {/* Order Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Customer Info */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3 text-lg">
                      Customer Information
                    </h3>
                    <div className="space-y-2">
                      <p>
                        <strong>Name:</strong>{" "}
                        {selectedOrder.User?.full_name || "N/A"}
                      </p>
                      <p>
                        <strong>Email:</strong>{" "}
                        {selectedOrder.User?.email || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Order Info */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3 text-lg">
                      Order Information
                    </h3>
                    <div className="space-y-2">
                      <p>
                        <strong>Order Date:</strong>{" "}
                        {formatDate(selectedOrder.order_date)}
                      </p>
                      <p>
                        <strong>Payment Method:</strong>{" "}
                        {selectedOrder.payment_method.toUpperCase()}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            selectedOrder.order_status
                          )}`}
                        >
                          {selectedOrder.order_status}
                        </span>
                      </p>
                      <p>
                        <strong>Total Amount:</strong>{" "}
                        {formatCurrency(selectedOrder.total_amount)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold mb-3 text-lg">
                    Shipping Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p>
                        <strong>Address:</strong>{" "}
                        {selectedOrder.shipping_address || "N/A"}
                      </p>
                      <p>
                        <strong>City:</strong>{" "}
                        {selectedOrder.shipping_city || "N/A"}
                      </p>
                      <p>
                        <strong>Postal Code:</strong>{" "}
                        {selectedOrder.shipping_postal_code || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p>
                        <strong>Tracking Number:</strong>{" "}
                        {selectedOrder.tracking_number || "Not assigned"}
                      </p>
                      {selectedOrder.notes && (
                        <p>
                          <strong>Notes:</strong> {selectedOrder.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-white border rounded-lg">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold text-lg">Order Items</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Product
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Variant
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Quantity
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Price
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Subtotal
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedOrder.OrderItems &&
                        selectedOrder.OrderItems.length > 0 ? (
                          selectedOrder.OrderItems.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-3">
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {item.Product?.product_name || "N/A"}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {item.Product?.description
                                      ? item.Product.description.length > 50
                                        ? item.Product.description.substring(
                                            0,
                                            50
                                          ) + "..."
                                        : item.Product.description
                                      : ""}
                                  </p>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {item.ProductVariant ? (
                                  <div>
                                    <p>
                                      <strong>Size:</strong>{" "}
                                      {item.ProductVariant.size || "N/A"}
                                    </p>
                                    <p>
                                      <strong>Color:</strong>{" "}
                                      {item.ProductVariant.color || "N/A"}
                                    </p>
                                  </div>
                                ) : (
                                  "No variant"
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {item.quantity}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {formatCurrency(item.price_at_purchase)}
                              </td>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                {formatCurrency(
                                  item.quantity * item.price_at_purchase
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="5"
                              className="px-4 py-8 text-center text-gray-500"
                            >
                              No items found for this order
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Order Total */}
                  <div className="border-t bg-gray-50 p-4">
                    <div className="flex justify-end">
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          Total: {formatCurrency(selectedOrder.total_amount)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6 space-x-3">
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      showStatusModal(selectedOrder);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Change Status
                  </button>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Update Modal */}
        {showModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Update Order Status
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="mb-4">
                  <p className="text-gray-600">
                    Order: #{selectedOrder.order_id}
                  </p>
                  <p className="text-gray-600">
                    Customer: {selectedOrder.User?.full_name || "N/A"}
                  </p>
                  <p className="text-gray-600">
                    Current Status:{" "}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        selectedOrder.order_status
                      )}`}
                    >
                      {selectedOrder.order_status}
                    </span>
                  </p>
                </div>

                {/* Status Update */}
                <div className="space-y-2 mb-6">
                  <h3 className="font-semibold mb-3">Select New Status:</h3>
                  {[
                    "Menunggu Konfirmasi",
                    "Disetujui",
                    "Akan Dikirimkan",
                    "Dikirim",
                    "Selesai",
                    "Dibatalkan",
                  ].map((status) => (
                    <button
                      key={status}
                      onClick={() =>
                        updateOrderStatus(selectedOrder.order_id, status)
                      }
                      className={`w-full px-4 py-2 rounded text-sm font-medium text-left ${
                        selectedOrder.order_status === status
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {status}
                      {selectedOrder.order_status === status && (
                        <span className="ml-2 text-xs">(Current)</span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Detail Modal */}
        {showPaymentModal && selectedPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Payment Detail</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Payment Information */}
                  <div>
                    <h3 className="font-semibold mb-3 text-lg">
                      Payment Information
                    </h3>
                    <div className="space-y-2">
                      <p>
                        <strong>Payment ID:</strong> #
                        {selectedPayment.payment_id}
                      </p>
                      <p>
                        <strong>Order ID:</strong> #{selectedPayment.order_id}
                      </p>
                      <p>
                        <strong>Customer:</strong>{" "}
                        {selectedPayment.User?.full_name}
                      </p>
                      <p>
                        <strong>Amount:</strong> Rp{" "}
                        {parseFloat(
                          selectedPayment.payment_amount
                        ).toLocaleString("id-ID")}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(
                            selectedPayment.payment_status
                          )}`}
                        >
                          {selectedPayment.payment_status}
                        </span>
                      </p>
                      <p>
                        <strong>Payment Method:</strong>{" "}
                        {selectedPayment.payment_method}
                      </p>
                      <p>
                        <strong>Payment Date:</strong>{" "}
                        {selectedPayment.payment_date
                          ? formatDate(selectedPayment.payment_date)
                          : "-"}
                      </p>
                      <p>
                        <strong>Confirmation Date:</strong>{" "}
                        {selectedPayment.confirmation_date
                          ? formatDate(selectedPayment.confirmation_date)
                          : "-"}
                      </p>
                    </div>
                  </div>

                  {/* Transfer Details */}
                  <div>
                    <h3 className="font-semibold mb-3 text-lg">
                      Transfer Details
                    </h3>
                    <div className="space-y-2">
                      <p>
                        <strong>Bank Name:</strong>{" "}
                        {selectedPayment.bank_name || "-"}
                      </p>
                      <p>
                        <strong>Account Number:</strong>{" "}
                        {selectedPayment.account_number || "-"}
                      </p>
                      <p>
                        <strong>Account Name:</strong>{" "}
                        {selectedPayment.account_name || "-"}
                      </p>
                      <p>
                        <strong>Transfer Proof:</strong>{" "}
                        {selectedPayment.transfer_proof || "-"}
                      </p>
                      {selectedPayment.admin_notes && (
                        <p>
                          <strong>Admin Notes:</strong>{" "}
                          {selectedPayment.admin_notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-6">
                  {selectedPayment.payment_status === "Menunggu Konfirmasi" && (
                    <>
                      <button
                        onClick={() => {
                          const notes = prompt("Admin notes (optional):");
                          approvePayment(
                            selectedPayment.payment_id,
                            notes || ""
                          );
                        }}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Approve Payment
                      </button>
                      <button
                        onClick={() => {
                          const notes = prompt("Rejection reason:");
                          if (notes) {
                            rejectPayment(selectedPayment.payment_id, notes);
                          }
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Reject Payment
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayoutFixed>
  );
};

export default Orders;
