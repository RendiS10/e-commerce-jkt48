import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout.jsx";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    todayRevenue: 0,
    monthlyRevenue: 0,
    transactionCount: 0,
  });

  useEffect(() => {
    fetchTransactions();
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
        calculateStats(data);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (transactionData) => {
    const now = new Date();
    const today = now.toDateString();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const totalRevenue = transactionData.reduce(
      (sum, transaction) => sum + parseFloat(transaction.amount || 0),
      0
    );

    const todayRevenue = transactionData
      .filter(
        (transaction) =>
          new Date(transaction.transaction_date).toDateString() === today
      )
      .reduce(
        (sum, transaction) => sum + parseFloat(transaction.amount || 0),
        0
      );

    const monthlyRevenue = transactionData
      .filter((transaction) => {
        const transDate = new Date(transaction.transaction_date);
        return (
          transDate.getMonth() === currentMonth &&
          transDate.getFullYear() === currentYear
        );
      })
      .reduce(
        (sum, transaction) => sum + parseFloat(transaction.amount || 0),
        0
      );

    setStats({
      totalRevenue,
      todayRevenue,
      monthlyRevenue,
      transactionCount: transactionData.length,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
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
            Transactions Management
          </h1>
          <div className="text-sm text-gray-500">
            Total Transactions: {stats.transactionCount}
          </div>
        </div>

        {/* Revenue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
            <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
            <p className="text-2xl font-bold text-green-600">
              Rp {stats.totalRevenue.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
            <h3 className="text-sm font-medium text-gray-600">
              Today's Revenue
            </h3>
            <p className="text-2xl font-bold text-blue-600">
              Rp {stats.todayRevenue.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
            <h3 className="text-sm font-medium text-gray-600">
              Monthly Revenue
            </h3>
            <p className="text-2xl font-bold text-purple-600">
              Rp {stats.monthlyRevenue.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
            <h3 className="text-sm font-medium text-gray-600">
              Total Transactions
            </h3>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.transactionCount}
            </p>
          </div>
        </div>

        {/* Transaction Status Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {["success", "pending", "failed", "refunded"].map((status) => {
            const count = transactions.filter(
              (transaction) => transaction.transaction_status === status
            ).length;
            return (
              <div key={status} className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-600 capitalize">
                  {status} Transactions
                </h3>
                <p className="text-xl font-bold text-gray-900">{count}</p>
              </div>
            );
          })}
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
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
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <tr
                      key={transaction.transaction_id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{transaction.transaction_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        #{transaction.order_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.User?.full_name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Rp{" "}
                        {parseFloat(transaction.amount || 0).toLocaleString(
                          "id-ID"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="uppercase font-medium">
                          {transaction.Order?.payment_method || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            transaction.transaction_status
                          )}`}
                        >
                          {transaction.transaction_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(transaction.transaction_date)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Transactions;
