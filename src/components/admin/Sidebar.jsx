import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: "📊",
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: "📦",
    },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: "📂",
    },
    {
      name: "Product Variants",
      path: "/admin/product-variants",
      icon: "🎨",
    },
    {
      name: "Product Images",
      path: "/admin/product-images",
      icon: "🖼️",
    },
    {
      name: "Product News",
      path: "/admin/news-product",
      icon: "📰",
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: "🛒",
    },
    {
      name: "Payments",
      path: "/admin/payments",
      icon: "💳",
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: "👥",
    },
    {
      name: "Reviews",
      path: "/admin/reviews",
      icon: "⭐",
    },
    {
      name: "Messages",
      path: "/admin/messages",
      icon: "💬",
    },
    {
      name: "Transactions",
      path: "/admin/transactions",
      icon: "💰",
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
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-200 ${
                  isActive
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
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

export default Sidebar;
