import React from "react";
import AdminLayoutSimplified from "../../../components/admin/AdminLayoutSimplified.jsx";
import AdminProfile from "./AdminProfile.jsx";
import { API_ENDPOINTS } from "../../../utils/api.js";

const Dashboard = () => {
  const [stats, setStats] = React.useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const { getAuthHeaders } = await import("../../../utils/api.js");
      const API_BASE_URL =
        "https://e-commerce-jkt48-prototype-production.up.railway.app/api";
      const headers = getAuthHeaders();

      // Fetch users
      const usersRes = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USERS}`, {
        headers,
      });
      const users = usersRes.ok ? await usersRes.json() : [];

      // Fetch products
      const productsRes = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.PRODUCTS}`,
        { headers }
      );
      const products = productsRes.ok ? await productsRes.json() : [];

      // Fetch orders (admin: all orders)
      const ordersRes = await fetch(`${API_BASE_URL}/orders/all`, { headers });
      const orders = ordersRes.ok ? await ordersRes.json() : [];

      // Filter only completed orders
      const completedOrders = orders.filter(
        (order) =>
          order.order_status === "Selesai" || order.order_status === "Dikirim"
      );

      // Calculate total revenue from completed orders
      const totalRevenue = completedOrders.reduce(
        (sum, order) => sum + parseFloat(order.total_amount || 0),
        0
      );

      setStats({
        totalUsers: users.length || 0,
        totalProducts: products.length || 0,
        totalOrders: completedOrders.length || 0,
        totalRevenue,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayoutSimplified>
      <div className="space-y-6">
        {/* Dashboard Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="text-2xl">👥</div>
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
              <div className="text-2xl">📦</div>
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
              <div className="text-2xl">🛒</div>
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
              <div className="text-2xl">💰</div>
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
        {/* Admin Profile */}
        <AdminProfile />
      </div>
    </AdminLayoutSimplified>
  );
};

export default Dashboard;
