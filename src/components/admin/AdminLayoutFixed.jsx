import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../main.jsx";
import SidebarWithNotifications from "./SidebarWithNotifications.jsx";
import NotificationDropdown from "./NotificationDropdown.jsx";
import NotificationBanner from "./NotificationBanner.jsx";

const AdminLayoutFixed = ({ children }) => {
  const context = useContext(UserContext);
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Safety check: if context is undefined, return loading state
  if (!context) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const { user, setUser, refreshUserAndCart, loading } = context;

  useEffect(() => {
    console.log("AdminLayout: Auth check - Loading:", loading, "User:", user);

    // Wait for UserContext to finish loading
    if (loading) {
      console.log("AdminLayout: UserContext still loading, waiting...");
      return;
    }

    // UserContext finished loading
    console.log("AdminLayout: UserContext finished loading");

    const token = localStorage.getItem("token");

    // No token = redirect
    if (!token) {
      console.log("AdminLayout: No token found, redirecting to login");
      setIsAuthorized(false);
      setAuthChecked(true);
      navigate("/admin/login");
      return;
    }

    // Check if user is admin
    if (user && user.role === "admin") {
      console.log("AdminLayout: User is admin, access granted");
      setIsAuthorized(true);
      setAuthChecked(true);
      return;
    }

    // If we have token but no user or non-admin user
    if (!user || user.role !== "admin") {
      console.log("AdminLayout: User not admin or not found, redirecting");
      setIsAuthorized(false);
      setAuthChecked(true);
      navigate("/admin/login");
      return;
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    localStorage.removeItem("token");
    setUser(null);
    await refreshUserAndCart();
    navigate("/admin/login");
  };

  // Show loading while checking auth
  if (!authChecked || loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show nothing if not authorized (redirect will happen)
  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NotificationBanner />
      <div className="flex">
        <SidebarWithNotifications onLogout={handleLogout} />
        <main className="flex-1 p-8">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
              <div className="flex items-center space-x-4">
                <NotificationDropdown />
                <span className="text-sm text-gray-600">
                  Welcome, {user?.full_name || "Admin"}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayoutFixed;
