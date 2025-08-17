import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../main.jsx";
import AdminLayoutFixed from "../../../components/admin/AdminLayoutFixed.jsx";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // AdminLayoutFixed already handles auth check, so just fetch data
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Fetch users
      const usersResponse = await fetch("http://localhost:5000/api/users", {
        headers,
      });
      const users = usersResponse.ok ? await usersResponse.json() : [];

      // Fetch products
      const productsResponse = await fetch(
        "http://localhost:5000/api/products"
      );
      const products = productsResponse.ok ? await productsResponse.json() : [];

      // Fetch orders
      const ordersResponse = await fetch("http://localhost:5000/api/orders", {
        headers,
      });
      const orders = ordersResponse.ok ? await ordersResponse.json() : [];

      // Calculate total revenue
      const totalRevenue = orders.reduce(
        (sum, order) => sum + parseFloat(order.total_amount || 0),
        0
      );

      // Get recent orders (last 5)
      const recentOrders = orders.slice(-5).reverse();

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
          <div className="text-sm text-gray-500">
            Welcome back, {user?.name || "Admin"}!
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">👥</div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">
                  Total Users
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalUsers}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">📦</div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">
                  Total Products
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {stats.totalProducts}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">🛒</div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">
                  Total Orders
                </div>
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.totalOrders}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">💰</div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">
                  Total Revenue
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  Rp {stats.totalRevenue.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
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
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.User?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Rp{" "}
                        {parseFloat(order.total_amount || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
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
