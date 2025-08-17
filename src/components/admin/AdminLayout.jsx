import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../main.jsx";
import Sidebar from "./Sidebar.jsx";

const AdminLayout = ({ children }) => {
  const context = useContext(UserContext);
  const navigate = useNavigate();
  const [localLoading, setLocalLoading] = React.useState(true);

  // Safety check: if context is undefined, return loading state
  if (!context) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const { user, setUser, refreshUserAndCart, loading } = context;
  const [localUser, setLocalUser] = React.useState(null);

  // Local user check as fallback when UserContext is loading
  React.useEffect(() => {
    const checkLocalAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLocalLoading(false);
        setLocalUser(null);
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const userData = await response.json();
          setLocalUser(userData);
          console.log("AdminLayout - Local auth success:", userData);
        } else {
          console.log("AdminLayout - Token invalid, removing");
          // Token invalid, remove it
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setLocalUser(null);
        }
      } catch (error) {
        console.error("AdminLayout - Error checking auth:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setLocalUser(null);
      } finally {
        setLocalLoading(false);
      }
    };

    // Always check local auth on mount, regardless of UserContext state
    checkLocalAuth();
  }, []); // Remove dependencies to run only once on mount

  // Sync with UserContext when it updates
  React.useEffect(() => {
    if (!loading && user) {
      setLocalUser(user);
      setLocalLoading(false);
    }
  }, [loading, user]);

  // Debug logging
  React.useEffect(() => {
    console.log(
      "AdminLayout - Loading:",
      loading,
      "LocalLoading:",
      localLoading
    );
    console.log("AdminLayout - User:", user, "LocalUser:", localUser);
    console.log("AdminLayout - Token:", localStorage.getItem("token"));
  }, [loading, localLoading, user, localUser]);

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    await refreshUserAndCart();
    navigate("/admin/login");
  };

  // Show loading while checking authentication
  if (loading || localLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Use local user if available, fallback to context user
  const currentUser = localUser || user;

  // Check if user is admin - only redirect if we're absolutely sure there's no valid admin
  if (!currentUser || currentUser.role !== "admin") {
    console.log("AdminLayout - Access check failed");
    console.log("AdminLayout - CurrentUser:", currentUser);
    console.log("AdminLayout - LocalUser:", localUser);
    console.log("AdminLayout - ContextUser:", user);
    console.log("AdminLayout - Token exists:", !!localStorage.getItem("token"));

    // If we have a token but no user data yet, wait a bit more
    const token = localStorage.getItem("token");
    if (token && !currentUser) {
      console.log("AdminLayout - Token exists but no user, waiting...");
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Verifying admin access...</p>
          </div>
        </div>
      );
    }

    // Only redirect if we're sure there's no admin access
    console.log("AdminLayout - No admin access, redirecting to login");
    navigate("/admin/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Navigation */}
          <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <h1 className="text-xl font-semibold text-gray-900">
                    JKT48 E-Commerce Admin
                  </h1>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">
                    Welcome, {currentUser.full_name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition duration-200"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </nav>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
