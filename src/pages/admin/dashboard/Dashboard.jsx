import React from "react";
import AdminLayoutSimplified from "../../../components/admin/AdminLayoutSimplified.jsx";
import LoadingSpinner from "../../../components/atoms/LoadingSpinner.jsx";
import ErrorDisplay from "../../../components/atoms/ErrorDisplay.jsx";
import { useFetch } from "../../../hooks/useFetch.js";
import { API_ENDPOINTS } from "../../../utils/api.js";

const Dashboard = () => {
  // Use multiple fetch hooks for different data
  const {
    data: users,
    loading: usersLoading,
    error: usersError,
  } = useFetch(API_ENDPOINTS.USERS, { requireAuth: true });

  const {
    data: products,
    loading: productsLoading,
    error: productsError,
  } = useFetch(API_ENDPOINTS.PRODUCTS);

  const {
    data: orders,
    loading: ordersLoading,
    error: ordersError,
  } = useFetch(API_ENDPOINTS.ORDERS, { requireAuth: true });

  const {
    data: notifications,
    loading: notificationsLoading,
    error: notificationsError,
  } = useFetch(API_ENDPOINTS.ORDERS_NOTIFICATIONS, { requireAuth: true });

  // Calculate stats from fetched data
  const stats = {
    totalUsers: users?.length || 0,
    totalProducts: products?.length || 0,
    totalOrders: orders?.length || 0,
    totalRevenue:
      orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0,
    recentOrders: orders?.slice(0, 5) || [],
    pendingOrders: notifications?.pendingOrders || 0,
    pendingPayments: notifications?.pendingPayments || 0,
  };

  const loading =
    usersLoading || productsLoading || ordersLoading || notificationsLoading;
  const error =
    usersError || productsError || ordersError || notificationsError;

  // Loading state
  if (loading) {
    return (
      <AdminLayoutSimplified>
        <LoadingSpinner message="Loading dashboard..." />
      </AdminLayoutSimplified>
    );
  }

  // Error state
  if (error) {
    return (
      <AdminLayoutSimplified>
        <ErrorDisplay error={error} />
      </AdminLayoutSimplified>
    );
  }

  return (
    <AdminLayoutSimplified>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
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

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
            <div className="flex items-center">
              <div className="flex-1">
                <h2 className="text-lg font-medium text-gray-900">
                  Pending Orders
                </h2>
                <p className="text-3xl font-bold text-orange-600">
                  {stats.pendingOrders}
                </p>
              </div>
              <div className="text-orange-500 text-3xl">🔔</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
            <div className="flex items-center">
              <div className="flex-1">
                <h2 className="text-lg font-medium text-gray-900">
                  Pending Payments
                </h2>
                <p className="text-3xl font-bold text-red-600">
                  {stats.pendingPayments}
                </p>
              </div>
              <div className="text-red-500 text-3xl">💳</div>
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
    </AdminLayoutSimplified>
  );
};

export default Dashboard;
