import React, { StrictMode, useEffect, useState, createContext } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Orders from "./pages/Orders.jsx";
import Checkout from "./pages/Checkout.jsx";
import CheckoutDetail from "./pages/CheckoutDetail.jsx";
import DetailProduct from "./pages/DetailProduct.jsx";
import PembayaranPage from "./pages/Pembayaran.jsx";

// Admin imports
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import Products from "./pages/admin/Products.jsx";
import Categories from "./pages/admin/Categories.jsx";
import ProductVariants from "./pages/admin/ProductVariants.jsx";
import ProductImages from "./pages/admin/ProductImages.jsx";
import NewsProduct from "./pages/admin/NewsProduct.jsx";
import AdminOrders from "./pages/admin/Orders.jsx";
import Payments from "./pages/admin/Payments.jsx";
import Users from "./pages/admin/Users.jsx";
import Reviews from "./pages/admin/Reviews.jsx";
import Complaints from "./pages/admin/Complaints.jsx";
import Messages from "./pages/admin/Messages.jsx";
import Transactions from "./pages/admin/Transactions.jsx";
import AdminChat from "./pages/admin/Chat.jsx";

// Context untuk user dan cart
export const UserContext = createContext();
export const CartContext = createContext();

function AppProviders({ children }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user info jika ada token
  useEffect(() => {
    console.log("UserContext: Initializing...");
    const token = localStorage.getItem("token");
    console.log("UserContext: Token exists:", !!token);

    if (!token) {
      console.log("UserContext: No token found, setting user to null");
      setUser(null);
      setCart([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    console.log("UserContext: Fetching user data...");

    // Fetch user info first, then cart
    const fetchUserAndCart = async () => {
      try {
        // Fetch user info
        const userResponse = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("UserContext: Auth response status:", userResponse.status);

        if (userResponse.ok) {
          const userData = await userResponse.json();
          console.log("UserContext: User data received:", userData);
          setUser(userData);

          // Only fetch cart if user is successfully loaded
          try {
            const cartResponse = await fetch("http://localhost:5000/api/cart", {
              headers: { Authorization: `Bearer ${token}` },
            });

            if (cartResponse.ok) {
              const cartData = await cartResponse.json();
              setCart(cartData.CartItems || []);
            } else {
              setCart([]);
            }
          } catch (cartError) {
            console.log("UserContext: Cart fetch error:", cartError);
            setCart([]);
          }
        } else {
          console.log("UserContext: Invalid token, clearing user");
          setUser(null);
          setCart([]);
          // Optionally remove invalid token
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.log("UserContext: Auth error:", error);
        setUser(null);
        setCart([]);
      } finally {
        console.log("UserContext: Loading completed");
        setLoading(false);
      }
    };

    fetchUserAndCart();
  }, []);

  // Fungsi untuk refresh user/cart setelah login/logout
  const refreshUserAndCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setCart([]);
      return;
    }
    try {
      const userRes = await fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userRes.ok ? await userRes.json() : null);
      const cartRes = await fetch("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const cartData = cartRes.ok ? await cartRes.json() : { CartItems: [] };
      setCart(cartData.CartItems || []);
    } catch {
      setUser(null);
      setCart([]);
    }
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, refreshUserAndCart, loading }}
    >
      <CartContext.Provider value={{ cart, setCart, refreshUserAndCart }}>
        {children}
      </CartContext.Provider>
    </UserContext.Provider>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/orders",
    element: <Orders />,
  },
  {
    path: "/checkout",
    element: <Checkout />,
  },
  {
    path: "/checkout-detail",
    element: <CheckoutDetail />,
  },
  {
    path: "/pembayaran",
    element: <PembayaranPage />,
  },
  {
    path: "/detail/:id",
    element: <DetailProduct />,
  },
  // Admin Routes
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/admin/products",
    element: <Products />,
  },
  {
    path: "/admin/categories",
    element: <Categories />,
  },
  {
    path: "/admin/product-variants",
    element: <ProductVariants />,
  },
  {
    path: "/admin/product-images",
    element: <ProductImages />,
  },
  {
    path: "/admin/news-product",
    element: <NewsProduct />,
  },
  {
    path: "/admin/orders",
    element: <AdminOrders />,
  },
  {
    path: "/admin/payments",
    element: <Payments />,
  },
  {
    path: "/admin/users",
    element: <Users />,
  },
  {
    path: "/admin/reviews",
    element: <Reviews />,
  },
  {
    path: "/admin/complaints",
    element: <Complaints />,
  },
  {
    path: "/admin/messages",
    element: <Messages />,
  },
  {
    path: "/admin/transactions",
    element: <Transactions />,
  },
  {
    path: "/admin/chat",
    element: <AdminChat />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>
);
