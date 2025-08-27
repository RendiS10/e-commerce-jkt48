import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../main.jsx";
import Sidebar from "./Sidebar.jsx";
import NotificationBanner from "./NotificationBanner.jsx";

const AdminLayoutSimple = ({ children }) => {
  const { user, setUser, refreshUserAndCart, loading } =
    useContext(UserContext);
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      console.log("AdminLayout: Auth check started");
      console.log("AdminLayout: Loading:", loading, "User:", user);

      const token = localStorage.getItem("token");

      // No token = immediate redirect
      if (!token) {
        console.log("AdminLayout: No token, redirecting");
        setShouldRedirect(true);
        setCheckingAuth(false);
        return;
      }

      // If UserContext is still loading, wait
      if (loading) {
        console.log("AdminLayout: UserContext loading, waiting...");
        setCheckingAuth(true);
        return;
      }

      // Give UserContext a bit more time if user is still null but we have a token
      if (!user && token) {
        console.log(
          "AdminLayout: Token exists but no user, giving UserContext more time..."
        );
        // Wait a brief moment for UserContext to finish
        setTimeout(() => {
          setCheckingAuth(false);
        }, 500);
        return;
      }

      // If we have user from context and is admin, we're good
      if (user && user.role === "admin") {
        console.log("AdminLayout: User is admin, access granted");
        setCheckingAuth(false);
        setShouldRedirect(false);
        return;
      }

      // If we have token but no user after timeout, try direct API call
      if (!user) {
        console.log("AdminLayout: No user but have token, checking API...");
        try {
          const response = await fetch(
            "https://e-commerce-jkt48-prototype-production.up.railway.app/api/auth/me",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.ok) {
            const userData = await response.json();
            console.log("AdminLayout: API check result:", userData);

            if (userData.role === "admin") {
              console.log("AdminLayout: API confirms admin access");
              setCheckingAuth(false);
              setShouldRedirect(false);
              return;
            }
          }
        } catch (error) {
          console.log("AdminLayout: API check failed:", error);
        }
      }

      // If user exists but not admin
      if (user && user.role !== "admin") {
        console.log("AdminLayout: User exists but not admin");
        setShouldRedirect(true);
      } else {
        console.log("AdminLayout: No valid admin user found");
        setShouldRedirect(true);
      }

      setCheckingAuth(false);
    };

    checkAuth();
  }, [user, loading, navigate]);

  // Handle redirect after auth check is complete
  useEffect(() => {
    if (!checkingAuth && shouldRedirect) {
      console.log("AdminLayout: Redirecting to login");
      navigate("/admin/login");
    }
  }, [checkingAuth, shouldRedirect, navigate]);

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    await refreshUserAndCart();
    navigate("/admin/login");
  };

  // Show loading while checking auth
  if (loading || checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {loading ? "Loading user..." : "Checking admin access..."}
          </p>
        </div>
      </div>
    );
  }

  // If should redirect, show brief message (redirect will happen via useEffect)
  if (shouldRedirect) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">Redirecting to login...</p>
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

export default AdminLayoutSimple;
