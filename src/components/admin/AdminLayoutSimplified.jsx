import React from "react";
import { useAdminAuth } from "../../hooks/useAdminAuth.js";
import Sidebar from "./Sidebar.jsx";
import LoadingSpinner from "../atoms/LoadingSpinner.jsx";

/**
 * Simplified Admin Layout using custom auth hook
 * Eliminates all duplicate auth logic
 */
const AdminLayoutSimplified = ({ children }) => {
  const { isAuthorized, authChecked, loading, handleLogout } = useAdminAuth();

  // Show loading while checking auth
  if (!authChecked || loading) {
    return <LoadingSpinner message="Checking admin access..." />;
  }

  // Show nothing if not authorized (redirect will happen via hook)
  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <Sidebar onLogout={handleLogout} />
        <main className="flex-1 p-8">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900">
                Admin Dashboard
              </h1>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayoutSimplified;
