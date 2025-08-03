import React, { StrictMode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Whistlist from "./pages/Whistlist.jsx";
import Checkout from "./pages/Checkout.jsx";
import Pembayaran from "./pages/Pembayaran.jsx";

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
    path: "/whistlist",
    element: <Whistlist />,
  },
  {
    path: "/checkout",
    element: <Checkout />,
  },
  {
    path: "/pembayaran",
    element: <Pembayaran />,
  },
]);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
