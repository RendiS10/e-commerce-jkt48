import React, { useState, useEffect } from "react";
import AdminLayout from "../../../components/admin/AdminLayout.jsx";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    todayRevenue: 0,
    monthlyRevenue: 0,
    yearlyRevenue: 0,
    transactionCount: 0,
    totalOrders: 0,
    totalProductsSold: 0,
  });

  useEffect(() => {
    fetchTransactions();
    fetchStats();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/transactions/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const formatRupiah = (amount) => {
    if (!amount || isNaN(amount)) return "Rp0";
    return "Rp" + amount.toLocaleString("id-ID");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Selesai":
      case "completed":
        return "bg-green-100 text-green-800";
      case "Dikirim":
      case "delivered":
        return "bg-blue-100 text-blue-800";
      case "Akan Dikirimkan":
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "Menunggu Konfirmasi":
      case "Disetujui":
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "Dibatalkan":
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading transactions...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Sales Report & Transactions
          </h1>
          <div className="text-sm text-gray-500">
            Total Sales: {stats.transactionCount} items
          </div>
        </div>

        {/* Revenue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
            <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
            <p className="text-2xl font-bold text-green-600">
              {formatRupiah(stats.totalRevenue)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
            <h3 className="text-sm font-medium text-gray-600">Today Revenue</h3>
            <p className="text-2xl font-bold text-blue-600">
              {formatRupiah(stats.todayRevenue)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
            <h3 className="text-sm font-medium text-gray-600">
              Monthly Revenue
            </h3>
            <p className="text-2xl font-bold text-purple-600">
              {formatRupiah(stats.monthlyRevenue)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
            <h3 className="text-sm font-medium text-gray-600">Products Sold</h3>
            <p className="text-2xl font-bold text-orange-600">
              {stats.totalProductsSold || 0}
            </p>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-indigo-500">
            <h3 className="text-sm font-medium text-gray-600">
              Yearly Revenue
            </h3>
            <p className="text-xl font-bold text-indigo-600">
              {formatRupiah(stats.yearlyRevenue)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-pink-500">
            <h3 className="text-sm font-medium text-gray-600">
              Completed Orders
            </h3>
            <p className="text-xl font-bold text-pink-600">
              {stats.totalOrders || 0}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-cyan-500">
            <h3 className="text-sm font-medium text-gray-600">
              Average Order Value
            </h3>
            <p className="text-xl font-bold text-cyan-600">
              {formatRupiah(
                stats.totalOrders > 0
                  ? stats.totalRevenue / stats.totalOrders
                  : 0
              )}
            </p>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.transaction_id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{transaction.tracking_number}
                      </div>
                      <div className="text-sm text-gray-500">
                        Order ID: {transaction.order_id}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.product_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatRupiah(transaction.product_price)} per item
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.customer_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transaction.customer_email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatRupiah(transaction.revenue)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          transaction.order_status
                        )}`}
                      >
                        {transaction.order_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.transaction_date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {transactions.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No sales data found
              </h3>
              <p className="text-gray-500">
                Complete some orders to see transaction data here.
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Transactions;
