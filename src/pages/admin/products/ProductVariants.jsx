import React, { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { UserContext } from "../../../main.jsx";
import AdminLayout from "../../../components/admin/AdminLayout.jsx";

const ProductVariants = () => {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    product_id: "",
    color: "",
    size: "",
    variant_stock: "",
  });
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetchVariants();
    fetchProducts();
  }, []);

  const fetchVariants = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/variants");
      if (response.ok) {
        const data = await response.json();
        setVariants(data);
      }
    } catch (error) {
      console.error("Error fetching variants:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get selected product name for display
    const selectedProduct = products.find(
      (p) => p.product_id == formData.product_id
    );

    // SweetAlert konfirmasi sebelum menyimpan variant
    const result = await Swal.fire({
      icon: "question",
      title: editingVariant
        ? "Konfirmasi Update Variant"
        : "Konfirmasi Tambah Variant",
      text: editingVariant
        ? "Apakah Anda yakin ingin mengupdate variant ini?"
        : "Apakah Anda yakin ingin menambahkan variant baru?",
      html: `
        <div class="text-left">
          <p><strong>Produk:</strong> ${
            selectedProduct?.product_name || "Tidak dipilih"
          }</p>
          <p><strong>Warna:</strong> ${formData.color || "Tidak ada"}</p>
          <p><strong>Ukuran:</strong> ${formData.size || "Tidak ada"}</p>
          <p><strong>Stok:</strong> ${formData.variant_stock || 0}</p>
          <p class="text-sm text-gray-600 mt-2">Pastikan semua data sudah benar sebelum melanjutkan.</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: editingVariant
        ? "Ya, Update Variant"
        : "Ya, Tambah Variant",
      cancelButtonText: "Batal",
      confirmButtonColor: "#cd0c0d",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return; // User membatalkan
    }

    const token = localStorage.getItem("token");

    try {
      const url = editingVariant
        ? `http://localhost:5000/api/variants/${editingVariant.variant_id}`
        : "http://localhost:5000/api/variants";

      const response = await fetch(url, {
        method: editingVariant ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // SweetAlert sukses variant disimpan
        await Swal.fire({
          icon: "success",
          title: editingVariant
            ? "Variant Berhasil Diupdate!"
            : "Variant Berhasil Ditambahkan!",
          text: editingVariant
            ? "Variant telah berhasil diupdate ke dalam sistem."
            : "Variant baru telah berhasil ditambahkan ke dalam sistem.",
          confirmButtonText: "OK",
          confirmButtonColor: "#cd0c0d",
        });

        fetchVariants();
        setShowForm(false);
        setEditingVariant(null);
        setFormData({
          product_id: "",
          color: "",
          size: "",
          variant_stock: "",
        });
      } else {
        throw new Error("Failed to save variant");
      }
    } catch (error) {
      console.error("Error saving variant:", error);

      // SweetAlert error menyimpan variant
      Swal.fire({
        icon: "error",
        title: editingVariant ? "Gagal Update Variant" : "Gagal Tambah Variant",
        text:
          error.message ||
          "Terjadi kesalahan saat menyimpan variant. Silakan coba lagi.",
        confirmButtonText: "Coba Lagi",
        confirmButtonColor: "#cd0c0d",
      });
    }
  };

  const handleEdit = (variant) => {
    setEditingVariant(variant);
    setFormData({
      product_id: variant.product_id,
      color: variant.color || "",
      size: variant.size || "",
      variant_stock: variant.variant_stock,
    });
    setShowForm(true);
  };

  const handleDelete = async (variantId) => {
    // Find variant and product for display information
    const variant = variants.find((v) => v.variant_id === variantId);
    const product = products.find((p) => p.product_id === variant?.product_id);

    // SweetAlert konfirmasi sebelum hapus variant
    const result = await Swal.fire({
      icon: "warning",
      title: "Hapus Variant",
      text: "Apakah Anda yakin ingin menghapus variant ini?",
      html: `
        <div class="text-center">
          <p><strong>Produk:</strong> ${product?.product_name || "Unknown"}</p>
          <p><strong>Warna:</strong> ${variant?.color || "Tidak ada"}</p>
          <p><strong>Ukuran:</strong> ${variant?.size || "Tidak ada"}</p>
          <p><strong>Stok:</strong> ${variant?.variant_stock || 0}</p>
          <p class="text-sm text-gray-600 mt-2">Variant yang sudah dihapus tidak dapat dikembalikan.</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus Variant",
      cancelButtonText: "Batal",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:5000/api/variants/${variantId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        // SweetAlert sukses variant dihapus
        await Swal.fire({
          icon: "success",
          title: "Variant Berhasil Dihapus!",
          text: "Variant telah berhasil dihapus dari sistem.",
          confirmButtonText: "OK",
          confirmButtonColor: "#cd0c0d",
        });

        fetchVariants();
      } else {
        throw new Error("Failed to delete variant");
      }
    } catch (error) {
      console.error("Error deleting variant:", error);

      // SweetAlert error hapus variant
      Swal.fire({
        icon: "error",
        title: "Gagal Hapus Variant",
        text:
          error.message ||
          "Terjadi kesalahan saat menghapus variant. Silakan coba lagi.",
        confirmButtonText: "Coba Lagi",
        confirmButtonColor: "#cd0c0d",
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading variants...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Product Variants Management
          </h1>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingVariant(null);
              setFormData({
                product_id: "",
                color: "",
                size: "",
                variant_stock: "",
              });
            }}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-200"
          >
            Add New Variant
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {editingVariant ? "Edit Variant" : "Add New Variant"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product
                  </label>
                  <select
                    value={formData.product_id}
                    onChange={(e) =>
                      setFormData({ ...formData, product_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select Product</option>
                    {products.map((product) => (
                      <option
                        key={product.product_id}
                        value={product.product_id}
                      >
                        {product.product_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Red, Blue, Black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Size
                  </label>
                  <input
                    type="text"
                    value={formData.size}
                    onChange={(e) =>
                      setFormData({ ...formData, size: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., S, M, L, XL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Variant Stock
                  </label>
                  <input
                    type="number"
                    value={formData.variant_stock}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        variant_stock: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                    min="0"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
                  >
                    {editingVariant ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Color
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {variants.map((variant) => (
                <tr key={variant.variant_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {variant.Product?.product_name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span
                      className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        variant.color
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {variant.color || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span
                      className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        variant.size
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {variant.size || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        variant.variant_stock > 0
                          ? variant.variant_stock > 10
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {variant.variant_stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(variant)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(variant.variant_id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductVariants;
