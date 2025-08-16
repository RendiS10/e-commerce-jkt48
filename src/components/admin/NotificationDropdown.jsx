import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faShoppingCart,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState({
    pendingOrders: 0,
    pendingPayments: 0,
    recentOrders: [],
    recentPayments: [],
    totalNotifications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [lastNotificationCount, setLastNotificationCount] = useState(0);

  useEffect(() => {
    // Request notification permission
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    fetchNotifications();
    // Set interval untuk auto-refresh notifikasi setiap 30 detik
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/orders/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Play notification sound jika ada notifikasi baru
        if (
          !loading &&
          data.totalNotifications > lastNotificationCount &&
          lastNotificationCount > 0
        ) {
          playNotificationSound();
          showBrowserNotification(data);
        }

        setLastNotificationCount(data.totalNotifications);
        setNotifications(data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const playNotificationSound = () => {
    // Buat audio notification sederhana
    const audio = new Audio(
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmIaBjaJzPHcjTsFKnTA7t2QQgwYZ7Lr5aVTEApcmNvqvm4gBDAEn+fO+RQBGnvL8N1+JwUucdfn4sR2IwU6dMMfwf8"
    );
    audio.volume = 0.3;
    audio.play().catch((e) => console.log("Could not play notification sound"));
  };

  const showBrowserNotification = (data) => {
    if (Notification.permission === "granted") {
      let title = "JKT48 Admin - Notifikasi Baru!";
      let body = "";

      if (data.pendingOrders > 0 && data.pendingPayments > 0) {
        body = `${data.pendingOrders} pesanan baru dan ${data.pendingPayments} konfirmasi pembayaran menunggu`;
      } else if (data.pendingOrders > 0) {
        body = `${data.pendingOrders} pesanan baru menunggu konfirmasi`;
      } else if (data.pendingPayments > 0) {
        body = `${data.pendingPayments} pembayaran menunggu konfirmasi`;
      }

      const notification = new Notification(title, {
        body: body,
        icon: "/vite.svg", // Gunakan icon yang ada
        tag: "admin-notification",
        renotify: true,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
        if (data.pendingOrders > 0) {
          window.location.href = "/admin/orders";
        } else {
          window.location.href = "/admin/payments";
        }
      };

      // Auto close setelah 5 detik
      setTimeout(() => notification.close(), 5000);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg transition-colors"
      >
        <FontAwesomeIcon icon={faBell} size="lg" />
        {notifications.totalNotifications > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {notifications.totalNotifications > 99
              ? "99+"
              : notifications.totalNotifications}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Notifikasi</h3>
            {loading && (
              <div className="text-sm text-gray-500">Memuat notifikasi...</div>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {/* Pending Orders Section */}
            {notifications.pendingOrders > 0 && (
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center mb-3">
                  <FontAwesomeIcon
                    icon={faShoppingCart}
                    className="text-orange-500 mr-2"
                  />
                  <span className="font-medium text-gray-900">
                    {notifications.pendingOrders} Pesanan Baru
                  </span>
                </div>
                {notifications.recentOrders.map((order) => (
                  <div
                    key={order.order_id}
                    className="mb-2 p-2 bg-orange-50 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Order #{order.order_id}
                        </p>
                        <p className="text-xs text-gray-600">
                          {order.User?.full_name}
                        </p>
                        <p className="text-xs text-orange-600 font-medium">
                          {formatCurrency(order.total_amount)}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(order.order_date)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pending Payments Section */}
            {notifications.pendingPayments > 0 && (
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center mb-3">
                  <FontAwesomeIcon
                    icon={faCreditCard}
                    className="text-blue-500 mr-2"
                  />
                  <span className="font-medium text-gray-900">
                    {notifications.pendingPayments} Konfirmasi Pembayaran
                  </span>
                </div>
                {notifications.recentPayments.map((payment) => (
                  <div
                    key={payment.payment_id}
                    className="mb-2 p-2 bg-blue-50 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Payment #{payment.payment_id}
                        </p>
                        <p className="text-xs text-gray-600">
                          {payment.Order?.User?.full_name}
                        </p>
                        <p className="text-xs text-blue-600 font-medium">
                          {formatCurrency(payment.payment_amount)}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(payment.confirmation_date)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Notifications */}
            {notifications.totalNotifications === 0 && !loading && (
              <div className="p-6 text-center text-gray-500">
                <FontAwesomeIcon
                  icon={faBell}
                  size="2x"
                  className="mb-2 opacity-50"
                />
                <p>Tidak ada notifikasi baru</p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {notifications.totalNotifications > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex space-x-2">
                <a
                  href="/admin/orders"
                  className="flex-1 bg-orange-500 text-white text-center py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Lihat Pesanan
                </a>
                <a
                  href="/admin/payments"
                  className="flex-1 bg-blue-500 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Lihat Pembayaran
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default NotificationDropdown;
