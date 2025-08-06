import React, { StrictMode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Whistlist from "./components/Fragments/ProductLainnya.jsx";
import Checkout from "./pages/Checkout.jsx";
import Pembayaran from "./pages/Pembayaran.jsx";
import DetailProduct from "./pages/DetailProduct.jsx";

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
    path: "/checkout",
    element: <Checkout />,
  },
  {
    path: "/pembayaran",
    element: <Pembayaran />,
  },
  {
    path: "/detailproduct",
    element: <DetailProduct />,
  },
]);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
