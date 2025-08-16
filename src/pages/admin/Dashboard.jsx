import React, { useState, useEffect } from "react";
import AdminLayoutFixed from "../../components/admin/AdminLayoutFixed.jsx";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // AdminLayoutFixed sudah handle auth, jadi langsung fetch data
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      // Fetch dashboard stats
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        fetch("http://localhost:5000/api/users", { headers }),
        fetch("http://localhost:5000/api/products", { headers }),
        fetch("http://localhost:5000/api/orders", { headers }),
      ]);

      const users = usersRes.ok ? await usersRes.json() : [];
      const products = productsRes.ok ? await productsRes.json() : [];
      const orders = ordersRes.ok ? await ordersRes.json() : [];

      const totalRevenue = orders.reduce(
        (sum, order) => sum + parseFloat(order.total_amount || 0),
        0
      );
      const recentOrders = orders.slice(0, 5);

      setStats({
        totalUsers: users.length || 0,
        totalProducts: products.length || 0,
        totalOrders: orders.length || 0,
        totalRevenue: totalRevenue,
        recentOrders: recentOrders,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayoutFixed>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </AdminLayoutFixed>
    );
  }

  return (
    <AdminLayoutFixed>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="flex-1">
                <h2 className="text-lg font-medium text-gray-900">
                  Total Users
                </h2>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.totalUsers}
                </p>
              </div>
              <div className="text-blue-500 text-3xl">👥</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="flex-1">
                <h2 className="text-lg font-medium text-gray-900">
                  Total Products
                </h2>
                <p className="text-3xl font-bold text-green-600">
                  {stats.totalProducts}
                </p>
              </div>
              <div className="text-green-500 text-3xl">📦</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="flex-1">
                <h2 className="text-lg font-medium text-gray-900">
                  Total Orders
                </h2>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.totalOrders}
                </p>
              </div>
              <div className="text-yellow-500 text-3xl">🛒</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="flex-1">
                <h2 className="text-lg font-medium text-gray-900">
                  Total Revenue
                </h2>
                <p className="text-3xl font-bold text-purple-600">
                  Rp {stats.totalRevenue.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="text-purple-500 text-3xl">💰</div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Orders
            </h2>
          </div>
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
                    Total
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
                {stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order) => (
                    <tr key={order.order_id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.order_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.User?.full_name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Rp{" "}
                        {parseFloat(order.total_amount).toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.order_status === "Selesai"
                              ? "bg-green-100 text-green-800"
                              : order.order_status === "Diproses"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.order_status === "Dikirim"
                              ? "bg-blue-100 text-blue-800"
                              : order.order_status === "Dibatalkan"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.order_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.order_date).toLocaleDateString("id-ID")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No recent orders
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayoutFixed>
  );
};

export default Dashboard;
