import React, { useState, useEffect } from "react";
import AdminLayoutFixed from "../../../components/admin/AdminLayoutFixed";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/payments/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Gagal mengambil data pembayaran");
      }

      const data = await response.json();
      setPayments(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching payments:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleOpenDetail = (payment) => {
    setSelectedPayment(payment);
    setShowDetailModal(true);
  };

  const handleCloseDetail = () => {
    setSelectedPayment(null);
    setShowDetailModal(false);
  };

  const handleApprovePayment = async (paymentId, adminNotes = "") => {
    if (!window.confirm("Apakah Anda yakin ingin menyetujui pembayaran ini?")) {
      return;
    }

    setActionLoading(true);
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menyetujui pembayaran");
      }

      alert("Pembayaran berhasil disetujui");
      fetchPayments(); // Refresh data
      handleCloseDetail();
    } catch (error) {
      console.error("Error approving payment:", error);
      alert(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectPayment = async (paymentId) => {
    const adminNotes = prompt("Masukkan alasan penolakan:");
    if (!adminNotes) return;

    if (!window.confirm("Apakah Anda yakin ingin menolak pembayaran ini?")) {
      return;
    }

    setActionLoading(true);
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menolak pembayaran");
      }

      alert("Pembayaran berhasil ditolak");
      fetchPayments(); // Refresh data
      handleCloseDetail();
    } catch (error) {
      console.error("Error rejecting payment:", error);
      alert(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const formatRupiah = (amount) => {
    if (!amount || isNaN(amount)) return "Rp0";
    return "Rp" + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("id-ID");
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      "Menunggu Pembayaran": "bg-yellow-100 text-yellow-800",
      "Menunggu Konfirmasi": "bg-orange-100 text-orange-800",
      Disetujui: "bg-green-100 text-green-800",
      Ditolak: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          statusMap[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <AdminLayoutFixed>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </AdminLayoutFixed>
    );
  }

  if (error) {
    return (
      <AdminLayoutFixed>
        <div className="text-center text-red-600 p-4">
          <p>Error: {error}</p>
        </div>
      </AdminLayoutFixed>
    );
  }

  return (
    <AdminLayoutFixed>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Manajemen Pembayaran
          </h1>
          <p className="text-gray-600">Kelola konfirmasi pembayaran transfer</p>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
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
                {payments.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Belum ada data pembayaran
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment.payment_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{payment.payment_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        #{payment.order_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.User?.full_name || "Unknown"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {formatRupiah(payment.payment_amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(payment.payment_status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(payment.payment_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleOpenDetail(payment)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          Detail
                        </button>
                        {payment.payment_status === "Menunggu Konfirmasi" && (
                          <>
                            <button
                              onClick={() =>
                                handleApprovePayment(payment.payment_id)
                              }
                              className="text-green-600 hover:text-green-900 mr-3"
                              disabled={actionLoading}
                            >
                              Setujui
                            </button>
                            <button
                              onClick={() =>
                                handleRejectPayment(payment.payment_id)
                              }
                              className="text-red-600 hover:text-red-900"
                              disabled={actionLoading}
                            >
                              Tolak
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Detail Pembayaran</h3>
                <button
                  onClick={handleCloseDetail}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* Payment Info */}
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="font-semibold mb-2">Informasi Pembayaran</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Payment ID: #{selectedPayment.payment_id}</div>
                    <div>Order ID: #{selectedPayment.order_id}</div>
                    <div>
                      Amount: {formatRupiah(selectedPayment.payment_amount)}
                    </div>
                    <div>
                      Status: {getStatusBadge(selectedPayment.payment_status)}
                    </div>
                    <div>Method: {selectedPayment.payment_method}</div>
                    <div>Date: {formatDate(selectedPayment.payment_date)}</div>
                  </div>
                </div>

                {/* Transfer Details */}
                {selectedPayment.bank_name && (
                  <div className="bg-blue-50 p-4 rounded">
                    <h4 className="font-semibold mb-2">Detail Transfer</h4>
                    <div className="space-y-1 text-sm">
                      <div>Bank: {selectedPayment.bank_name}</div>
                      <div>No. Rekening: {selectedPayment.account_number}</div>
                      <div>Nama Pemilik: {selectedPayment.account_name}</div>
                      <div>
                        Tanggal Transfer:{" "}
                        {formatDate(selectedPayment.payment_date)}
                      </div>
                    </div>
                  </div>
                )}

                {/* Customer Info */}
                {selectedPayment.User && (
                  <div className="bg-green-50 p-4 rounded">
                    <h4 className="font-semibold mb-2">Informasi Customer</h4>
                    <div className="space-y-1 text-sm">
                      <div>Nama: {selectedPayment.User.full_name}</div>
                      <div>Email: {selectedPayment.User.email}</div>
                    </div>
                  </div>
                )}

                {/* Order Details */}
                {selectedPayment.Order && (
                  <div className="bg-purple-50 p-4 rounded">
                    <h4 className="font-semibold mb-2">Detail Pesanan</h4>
                    <div className="space-y-1 text-sm">
                      <div>
                        Total:{" "}
                        {formatRupiah(selectedPayment.Order.total_amount)}
                      </div>
                      <div>Status: {selectedPayment.Order.order_status}</div>
                      <div>
                        Alamat: {selectedPayment.Order.shipping_address}
                      </div>
                    </div>
                  </div>
                )}

                {/* Admin Notes */}
                {selectedPayment.admin_notes && (
                  <div className="bg-yellow-50 p-4 rounded">
                    <h4 className="font-semibold mb-2">Catatan Admin</h4>
                    <p className="text-sm">{selectedPayment.admin_notes}</p>
                  </div>
                )}

                {/* Action Buttons */}
                {selectedPayment.payment_status === "Menunggu Konfirmasi" && (
                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      onClick={() =>
                        handleApprovePayment(selectedPayment.payment_id)
                      }
                      className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                      disabled={actionLoading}
                    >
                      ✅ Setujui Pembayaran
                    </button>
                    <button
                      onClick={() =>
                        handleRejectPayment(selectedPayment.payment_id)
                      }
                      className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                      disabled={actionLoading}
                    >
                      ❌ Tolak Pembayaran
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayoutFixed>
  );
}

export default Payments;
