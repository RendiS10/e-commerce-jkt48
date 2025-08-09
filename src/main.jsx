import React, { StrictMode, useEffect, useState, createContext } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Orders from "./pages/Orders.jsx";
import Whistlist from "./components/Fragments/ProductLainnya.jsx";
import Checkout from "./pages/Checkout.jsx";
import CheckoutDetail from "./pages/CheckoutDetail.jsx";
import Pembayaran from "./pages/Pembayaran.jsx";
import DetailProduct from "./pages/DetailProduct.jsx";

// Context untuk user dan cart
export const UserContext = createContext();
export const CartContext = createContext();

function AppProviders({ children }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user info jika ada token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setCart([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    // Fetch user info
    fetch("http://localhost:5000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null));
    // Fetch cart
    fetch("http://localhost:5000/api/cart", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : { CartItems: [] }))
      .then((data) => setCart(data.CartItems || []))
      .catch(() => setCart([]))
      .finally(() => setLoading(false));
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
    element: <Pembayaran />,
  },
  {
    path: "/detail/:id",
    element: <DetailProduct />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>
);
