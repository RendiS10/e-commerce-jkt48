import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const SidebarWithNotifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    pendingOrders: 0,
    pendingPayments: 0,
    unreadMessages: 0,
  });

  useEffect(() => {
    fetchNotificationCounts();
    // Auto refresh setiap 1 menit
    const interval = setInterval(fetchNotificationCounts, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotificationCounts = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      // Fetch notifications untuk orders dan payments
      const notificationsRes = await fetch(
        "http://localhost:5000/api/orders/notifications",
        { headers }
      );
      if (notificationsRes.ok) {
        const data = await notificationsRes.json();
        setNotifications((prev) => ({
          ...prev,
          pendingOrders: data.pendingOrders || 0,
          pendingPayments: data.pendingPayments || 0,
        }));
      }

      // TODO: Bisa ditambahkan untuk messages
      // const messagesRes = await fetch("http://localhost:5000/api/messages", { headers });
    } catch (error) {
      console.error("Error fetching notification counts:", error);
    }
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: "📊",
      badge: 0,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: "📦",
      badge: 0,
    },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: "📂",
      badge: 0,
    },
    {
      name: "Product Variants",
      path: "/admin/product-variants",
      icon: "🎨",
      badge: 0,
    },
    {
      name: "Product Images",
      path: "/admin/product-images",
      icon: "🖼️",
      badge: 0,
    },
    {
      name: "Product News",
      path: "/admin/news-product",
      icon: "📰",
      badge: 0,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: "🛒",
      badge: notifications.pendingOrders,
      badgeColor: "bg-orange-500",
    },
    {
      name: "Payments",
      path: "/admin/payments",
      icon: "💳",
      badge: notifications.pendingPayments,
      badgeColor: "bg-red-500",
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: "👥",
      badge: 0,
    },
    {
      name: "Reviews",
      path: "/admin/reviews",
      icon: "⭐",
      badge: 0,
    },
    {
      name: "Messages",
      path: "/admin/messages",
      icon: "💬",
      badge: notifications.unreadMessages,
      badgeColor: "bg-blue-500",
    },
    {
      name: "Transactions",
      path: "/admin/transactions",
      icon: "💰",
      badge: 0,
    },
  ];

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen">
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-8">
          <div className="text-2xl">🎌</div>
          <div>
            <h2 className="font-bold text-lg">JKT48 Admin</h2>
            <p className="text-gray-400 text-sm">Management Panel</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-lg transition duration-200 ${
                  isActive
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`
              }
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </div>
              {item.badge > 0 && (
                <span
                  className={`${
                    item.badgeColor || "bg-red-500"
                  } text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse`}
                >
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-8 pt-8 border-t border-gray-700">
          <button
            onClick={() => navigate("/")}
            className="flex items-center space-x-3 px-4 py-3 w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition duration-200"
          >
            <span className="text-xl">🏠</span>
            <span className="font-medium">Main Site</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SidebarWithNotifications;
