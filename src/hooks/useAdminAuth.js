import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../main.jsx";

/**
 * Custom hook for admin authentication
 * Handles all admin auth logic in one place
 */
export const useAdminAuth = () => {
  const context = useContext(UserContext);
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Safety check: if context is undefined, return loading state
  if (!context) {
    return {
      isAuthorized: false,
      authChecked: false,
      loading: true,
      user: null,
    };
  }

  const { user, setUser, refreshUserAndCart, loading } = context;

  useEffect(() => {
    const checkAdminAuth = async () => {
      console.log("useAdminAuth: Starting auth check...");

      const token = localStorage.getItem("token");

      if (!token) {
        console.log("useAdminAuth: No token found");
        setAuthChecked(true);
        setIsAuthorized(false);
        navigate("/admin/login");
        return;
      }

      // If we already have user from context and they're admin, we're good
      if (user && user.role === "admin") {
        console.log("useAdminAuth: User already loaded and is admin");
        setAuthChecked(true);
        setIsAuthorized(true);
        return;
      }

      // If context is still loading, wait for it
      if (loading) {
        console.log("useAdminAuth: UserContext still loading, waiting...");
        return;
      }

      // Double-check with direct API call
      try {
        const response = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const userData = await response.json();
          console.log("useAdminAuth: Direct API auth result:", userData);

          if (userData.role === "admin") {
            setIsAuthorized(true);
          } else {
            console.log("useAdminAuth: User is not admin");
            navigate("/admin/login");
          }
        } else {
          console.log("useAdminAuth: Token validation failed");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/admin/login");
        }
      } catch (error) {
        console.log("useAdminAuth: Auth check error:", error);
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

  return {
    isAuthorized,
    authChecked,
    loading,
    user,
    handleLogout,
  };
};
