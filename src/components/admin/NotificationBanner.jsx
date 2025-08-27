import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const NotificationBanner = () => {
  const [notifications, setNotifications] = useState({
    pendingOrders: 0,
    pendingPayments: 0,
    totalNotifications: 0,
  });
  const [isVisible, setIsVisible] = useState(false);
  const [lastCheck, setLastCheck] = useState(Date.now());

  useEffect(() => {
    fetchNotifications();
    // Auto refresh setiap 1 menit
    const interval = setInterval(() => {
      fetchNotifications();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://e-commerce-jkt48-prototype-production.up.railway.app/api/orders/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setNotifications(data);

        // Show banner jika ada notifikasi
        if (data.totalNotifications > 0) {
          setIsVisible(true);
        }
      }
    } catch (error) {
      console.error("Error fetching notification banner:", error);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setLastCheck(Date.now());
    // Auto show lagi setelah 5 menit jika masih ada notifikasi
    setTimeout(() => {
      if (notifications.totalNotifications > 0) {
        setIsVisible(true);
      }
    }, 300000); // 5 menit
  };

  if (!isVisible || notifications.totalNotifications === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg shadow-lg border-l-4 border-white animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className="text-yellow-300 text-xl animate-bounce"
          />
          <div>
            <h4 className="font-bold text-sm">Perhatian Admin!</h4>
            <p className="text-xs opacity-90">
              {notifications.pendingOrders > 0 && (
                <span className="block">
                  {notifications.pendingOrders} pesanan baru
                </span>
              )}
              {notifications.pendingPayments > 0 && (
                <span className="block">
                  {notifications.pendingPayments} konfirmasi pembayaran
                </span>
              )}
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>

      <div className="mt-3 flex space-x-2">
        {notifications.pendingOrders > 0 && (
          <a
            href="/admin/orders"
            className="bg-white text-orange-500 px-3 py-1 rounded text-xs font-medium hover:bg-gray-100 transition-colors"
          >
            Lihat Pesanan
          </a>
        )}
        {notifications.pendingPayments > 0 && (
          <a
            href="/admin/payments"
            className="bg-white text-red-500 px-3 py-1 rounded text-xs font-medium hover:bg-gray-100 transition-colors"
          >
            Konfirmasi Bayar
          </a>
        )}
      </div>
    </div>
  );
};

export default NotificationBanner;
