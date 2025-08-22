import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../main.jsx";
import Sidebar from "./Sidebar.jsx";
import NotificationBanner from "./NotificationBanner.jsx";

const AdminLayout = ({ children }) => {
  const { user, setUser, refreshUserAndCart, loading } =
    useContext(UserContext);
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAdminAuth = async () => {
      console.log("AdminLayout: Starting auth check...");

      const token = localStorage.getItem("token");

      if (!token) {
        console.log("AdminLayout: No token found");
        setAuthChecked(true);
        setIsAuthorized(false);
        navigate("/admin/login");
        return;
      }

      // If we already have user from context and they're admin, we're good
      if (user && user.role === "admin") {
        console.log("AdminLayout: User already loaded and is admin");
        setAuthChecked(true);
        setIsAuthorized(true);
        return;
      }

      // If context is still loading, wait for it
      if (loading) {
        console.log("AdminLayout: UserContext still loading, waiting...");
        return;
      }

      // Double-check with direct API call
      try {
        const response = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const userData = await response.json();
          console.log("AdminLayout: Direct API auth result:", userData);

          if (userData.role === "admin") {
            setIsAuthorized(true);
          } else {
            console.log("AdminLayout: User is not admin");
            navigate("/admin/login");
          }
        } else {
          console.log("AdminLayout: Token validation failed");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/admin/login");
        }
      } catch (error) {
        console.log("AdminLayout: Auth check error:", error);
        navigate("/admin/login");
      } finally {
        setAuthChecked(true);
      }
    };

    checkAdminAuth();
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    await refreshUserAndCart();
    navigate("/admin/login");
  };

  // Show loading while checking auth
  if (!authChecked || loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking admin access...</p>
        </div>
      </div>
    );
  }

  // If not authorized, show access denied (this shouldn't show if navigate works)
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            You need admin privileges to access this page.
          </p>
          <button
            onClick={() => navigate("/admin/login")}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Go to Admin Login
          </button>
        </div>
      </div>
    );
  }

  // Render admin layout
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white shadow-sm z-10">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Welcome, {user?.name || "Admin"}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Notification Banner - Global untuk semua halaman admin */}
          <NotificationBanner />

          {/* Main Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
