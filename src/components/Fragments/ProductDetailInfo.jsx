import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import RatingStars from "../Elements/RatingStars";
import PriceTag from "../Elements/PriceTag";
import ColorSelector from "../Elements/ColorSelector";
import SizeSelector from "../Elements/SizeSelector";
import Button from "../Elements/Button";
import WishlistButton from "../Elements/WishlistButton";
import DeliveryInfo from "../Elements/DeliveryInfo";

function ProductDetailInfo({ product }) {
  // Fungsi format Rupiah
  function formatRupiah(amount) {
    if (!amount) return "Rp0";
    // Hilangkan semua karakter non-digit dan non-koma
    let str = amount.toString().replace(/[^\d,]/g, "");
    // Jika ada koma/desimal, pisahkan
    let [main, decimal] = str.split(",");
    let formatted = main.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return "Rp" + formatted + (decimal ? "," + decimal : "");
  }
  // Pastikan colors dan sizes selalu array
  const colors = Array.isArray(product.colors) ? product.colors : [];
  const sizes = Array.isArray(product.sizes) ? product.sizes : [];
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [cartLoading, setCartLoading] = useState(false);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    if (product?.product_id) {
      fetch(
        `https://e-commerce-jkt48-prototype-production.up.railway.app/api/variants`
      )
        .then((res) => res.json())
        .then((data) =>
          setVariants(data.filter((v) => v.product_id == product.product_id))
        );
    }
  }, [product?.product_id]);

  useEffect(() => {
    if (size) {
      setSelectedVariant(variants.find((v) => v.size === size));
    } else {
      setSelectedVariant(null);
    }
  }, [size, variants]);

  // Prefill qty dari cart jika sudah ada item ini di cart
  useEffect(() => {
    const fetchCartQty = async () => {
      if (!isLoggedIn) return;
      setCartLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "https://e-commerce-jkt48-prototype-production.up.railway.app/api/cart",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Gagal mengambil data keranjang");
        const data = await res.json();
        const items = data.CartItems || [];
        // Cari variant_id jika ada
        let variant_id = null;
        if (product.ProductVariants && Array.isArray(product.ProductVariants)) {
          const found = product.ProductVariants.find(
            (v) => (v.color === color || !color) && (v.size === size || !size)
          );
          if (found) variant_id = found.variant_id;
        }
        // Temukan item di cart yang cocok
        const foundItem = items.find(
          (item) =>
            item.product_id === (product.product_id || product.id) &&
            ((variant_id && item.variant_id === variant_id) ||
              (!variant_id && !item.variant_id))
        );
        if (foundItem) setQty(foundItem.quantity);
      } catch (err) {
        // Bisa diabaikan, biar qty default 1
      } finally {
        setCartLoading(false);
      }
    };
    fetchCartQty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.product_id, product.id, color, size, isLoggedIn]);

  const handleAddToCart = async () => {
    if (!size || !color) {
      Swal.fire({
        icon: "warning",
        title: "Pilih Ukuran dan Warna",
        text: "Silakan pilih ukuran dan warna yang tersedia terlebih dahulu",
        confirmButtonText: "OK",
        confirmButtonColor: "#cd0c0d",
      });
      return;
    }
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    // Cari variant_id jika ada (jika product.variants tersedia)
    let variant_id = null;
    if (product.ProductVariants && Array.isArray(product.ProductVariants)) {
      const found = product.ProductVariants.find(
        (v) => (v.color === color || !color) && (v.size === size || !size)
      );
      if (found) variant_id = found.variant_id;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "https://e-commerce-jkt48-prototype-production.up.railway.app/api/cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            product_id: product.product_id || product.id,
            quantity: qty,
            variant_id: variant_id || null,
          }),
        }
      );
      if (!res.ok) {
        const data = await res.json();
        Swal.fire({
          icon: "error",
          title: "Gagal Menambah ke Keranjang",
          text: data.message || "Gagal menambah ke keranjang",
          confirmButtonColor: "#cd0c0d",
        });
        return;
      }

      // Notifikasi sukses
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Produk berhasil ditambahkan ke keranjang",
        confirmButtonColor: "#cd0c0d",
        timer: 2000,
        timerProgressBar: true,
      });

      navigate("/checkout");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Koneksi Gagal",
        text: "Gagal koneksi ke server",
        confirmButtonColor: "#cd0c0d",
      });
    }
  };

  const handleBuyNow = () => {
    if (!size || !color) {
      Swal.fire({
        icon: "warning",
        title: "Pilih Ukuran dan Warna",
        text: "Silakan pilih ukuran dan warna yang tersedia terlebih dahulu",
        confirmButtonText: "OK",
        confirmButtonColor: "#cd0c0d",
      });
      return;
    }
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    // Cari variant_id jika ada
    let variant_id = null;
    if (product.ProductVariants && Array.isArray(product.ProductVariants)) {
      const found = product.ProductVariants.find(
        (v) => (v.color === color || !color) && (v.size === size || !size)
      );
      if (found) variant_id = found.variant_id;
    }

    // Siapkan data produk untuk checkout langsung
    const checkoutData = {
      product_id: product.product_id || product.id,
      product_name: product.product_name || product.name,
      price: product.price,
      quantity: qty,
      variant_id: variant_id || null,
      size: size,
      color: color,
      image_url: product.image_url,
      isDirect: true, // Flag untuk menandai ini direct buy
    };

    // Simpan data sementara di localStorage untuk checkout-detail
    localStorage.setItem("directBuyItem", JSON.stringify(checkoutData));

    // Redirect ke checkout-detail
    navigate("/checkout-detail");
  };

  return (
    <div className="flex-1">
      <h2 className="text-2xl font-bold mb-2">
        {product.product_name || product.name}
      </h2>
      <div className="flex items-center gap-2 mb-2">
        <RatingStars value={product.rating || product.average_rating || 0} />
        <span className="text-sm text-gray-500">
          ({product.reviews || product.total_reviews || 0} Reviews)
        </span>
        <span className="text-green-600 text-sm ml-2">
          {product.stock ? "In Stock" : "Out of Stock"}
        </span>
      </div>
      <PriceTag
        price={formatRupiah(product.price)}
        oldPrice={product.oldPrice ? formatRupiah(product.oldPrice) : undefined}
      />
      <p className="text-gray-600 my-3">{product.description}</p>
      {/* Komponen ColorSelector dan SizeSelector dihapus, hanya UI variant yang tampil */}
      {/* UI untuk size, stok, dan warna dari variant */}
      <div className="mt-6 mb-4">
        <div className="font-semibold mb-2">Ukuran Tersedia:</div>
        {Array.from(new Set(variants.map((v) => v.size).filter(Boolean))).map(
          (sz) => (
            <button
              key={sz}
              onClick={() => setSize(sz)}
              className={`px-3 py-1 rounded border m-1 ${
                size === sz ? "bg-[#cd0c0d] text-white" : "bg-white"
              }`}
            >
              {sz}
            </button>
          )
        )}
        {selectedVariant && (
          <div className="mt-2">
            <span className="font-semibold">Stok:</span>{" "}
            {selectedVariant.variant_stock}
            <br />
            <span className="font-semibold">Warna:</span>{" "}
            {selectedVariant.color || "-"}
          </div>
        )}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Warna Tersedia:</span>
        {Array.from(new Set(variants.map((v) => v.color).filter(Boolean))).map(
          (clr) => (
            <button
              key={clr}
              onClick={() => setColor(clr)}
              className={`ml-2 px-2 py-1 border rounded ${
                color === clr ? "bg-[#cd0c0d] text-white" : "bg-white"
              }`}
              type="button"
            >
              {clr}
            </button>
          )
        )}
      </div>
      <div className="flex items-center gap-2 mb-4">
        <input
          type="number"
          min={0}
          max={99}
          value={qty}
          onChange={(e) =>
            setQty(Math.max(0, Math.min(99, Number(e.target.value))))
          }
          disabled={cartLoading}
          className="border border-gray-300 rounded px-2 py-1 w-20 text-center focus:border-[#cd0c0d]"
        />
        <Button
          className="bg-[#cd0c0d] text-white px-6 py-2 rounded"
          onClick={handleBuyNow}
        >
          Buy Now
        </Button>
        <Button
          className="bg-green-600 text-white px-6 py-2 rounded"
          onClick={handleAddToCart}
        >
          Masukkan ke Keranjang
        </Button>
      </div>
    </div>
  );
}

export default ProductDetailInfo;
