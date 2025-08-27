import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import AdminLayout from "../../../components/admin/AdminLayout.jsx";
import LoadingSpinner from "../../../components/atoms/LoadingSpinner.jsx";
import ErrorDisplay from "../../../components/atoms/ErrorDisplay.jsx";
import { useFetch, useMutation } from "../../../hooks/useFetch.js";
import { API_ENDPOINTS } from "../../../utils/api.js";

const Categories = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [productCounts, setProductCounts] = useState({});
  const [formData, setFormData] = useState({
    category_name: "",
    slug: "",
    image_url: "",
  });

  // Fetch data using custom hooks - Modified to include product counts
  const {
    data: categories,
    loading,
    error,
    refetch: refetchCategories,
  } = useFetch("/categories?include=products");

  const { mutate, loading: mutating, error: mutationError } = useMutation();

  // Fetch product counts for each category
  useEffect(() => {
    const fetchProductCounts = async () => {
      if (categories && categories.length > 0) {
        try {
          const token = localStorage.getItem("token");
          const counts = {};

          // Fetch products and group by category
          const response = await fetch(
            "https://e-commerce-jkt48-prototype-production.up.railway.app/api/products",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const products = await response.json();

            // Count products for each category
            categories.forEach((category) => {
              counts[category.category_id] = products.filter(
                (product) => product.category_id === category.category_id
              ).length;
            });

            setProductCounts(counts);
          }
        } catch (error) {
          console.error("Error fetching product counts:", error);
        }
      }
    };

    fetchProductCounts();
  }, [categories]);

  // Helper function to refresh data
  const refreshData = () => {
    refetchCategories();
    // Trigger useEffect to refetch product counts
    setTimeout(() => {
      // This will be called after categories are updated
    }, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // SweetAlert konfirmasi sebelum menyimpan kategori
    const result = await Swal.fire({
      icon: "question",
      title: editingCategory
        ? "Konfirmasi Update Kategori"
        : "Konfirmasi Tambah Kategori",
      text: editingCategory
        ? "Apakah Anda yakin ingin mengupdate kategori ini?"
        : "Apakah Anda yakin ingin menambahkan kategori baru?",
      html: `
        <div class="text-left">
          <p><strong>Nama Kategori:</strong> ${formData.category_name}</p>
          <p><strong>Slug:</strong> ${formData.slug || "Auto-generated"}</p>
          <p class="text-sm text-gray-600 mt-2">Pastikan semua data sudah benar sebelum melanjutkan.</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: editingCategory
        ? "Ya, Update Kategori"
        : "Ya, Tambah Kategori",
      cancelButtonText: "Batal",
      confirmButtonColor: "#cd0c0d",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return; // User membatalkan
    }

    try {
      await mutate(
        async () => {
          const endpoint = editingCategory
            ? `${API_ENDPOINTS.CATEGORIES}/${editingCategory.category_id}`
            : API_ENDPOINTS.CATEGORIES;

          const method = editingCategory ? "PUT" : "POST";
          return await fetch(
            `https://e-commerce-jkt48-prototype-production.up.railway.app/api${endpoint}`,
            {
              method,
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify(formData),
            }
          );
        },
        {
          onSuccess: () => {
            // SweetAlert sukses kategori disimpan
            Swal.fire({
              icon: "success",
              title: editingCategory
                ? "Kategori Berhasil Diupdate!"
                : "Kategori Berhasil Ditambahkan!",
              text: editingCategory
                ? "Kategori telah berhasil diupdate ke dalam sistem."
                : "Kategori baru telah berhasil ditambahkan ke dalam sistem.",
              confirmButtonText: "OK",
              confirmButtonColor: "#cd0c0d",
            });

            refreshData();
            setShowForm(false);
            setEditingCategory(null);
            setFormData({ category_name: "", slug: "", image_url: "" });
          },
          successMessage: `Category ${
            editingCategory ? "updated" : "created"
          } successfully!`,
        }
      );
    } catch (error) {
      console.error("Error saving category:", error);

      // SweetAlert error menyimpan kategori
      Swal.fire({
        icon: "error",
        title: editingCategory
          ? "Gagal Update Kategori"
          : "Gagal Tambah Kategori",
        text:
          error.message ||
          "Terjadi kesalahan saat menyimpan kategori. Silakan coba lagi.",
        confirmButtonText: "Coba Lagi",
        confirmButtonColor: "#cd0c0d",
      });
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      category_name: category.category_name,
      slug: category.slug || "",
      image_url: category.image_url || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (categoryId) => {
    // Cari kategori untuk mendapatkan informasi produk
    const category = categories.find((cat) => cat.category_id === categoryId);
    const productCount = productCounts[categoryId] || 0;

    // SweetAlert konfirmasi sebelum hapus kategori
    const result = await Swal.fire({
      icon: "warning",
      title: "Hapus Kategori",
      text: "Apakah Anda yakin ingin menghapus kategori ini?",
      html: `
        <div class="text-center">
          <p><strong>Kategori:</strong> ${category?.category_name}</p>
          <p><strong>Jumlah Produk:</strong> ${productCount} produk</p>
          ${
            productCount > 0
              ? '<p class="text-red-600 text-sm mt-2">⚠️ Menghapus kategori ini akan mempengaruhi produk yang menggunakan kategori tersebut.</p>'
              : '<p class="text-gray-600 text-sm mt-2">Kategori ini tidak memiliki produk.</p>'
          }
          <p class="text-sm text-gray-600 mt-2">Kategori yang sudah dihapus tidak dapat dikembalikan.</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus Kategori",
      cancelButtonText: "Batal",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await mutate(
        async () => {
          return await fetch(
            `https://e-commerce-jkt48-prototype-production.up.railway.app/api/categories/${categoryId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
        },
        {
          onSuccess: () => {
            // SweetAlert sukses kategori dihapus
            Swal.fire({
              icon: "success",
              title: "Kategori Berhasil Dihapus!",
              text: "Kategori telah berhasil dihapus dari sistem.",
              confirmButtonText: "OK",
              confirmButtonColor: "#cd0c0d",
            });

            refreshData();
          },
          successMessage: "Category deleted successfully!",
        }
      );
    } catch (error) {
      console.error("Error deleting category:", error);

      // SweetAlert error hapus kategori
      Swal.fire({
        icon: "error",
        title: "Gagal Hapus Kategori",
        text:
          error.message ||
          "Terjadi kesalahan saat menghapus kategori. Silakan coba lagi.",
        confirmButtonText: "Coba Lagi",
        confirmButtonColor: "#cd0c0d",
      });
    }
  };

  // Loading state
  if (loading) {
    return (
      <AdminLayout>
        <LoadingSpinner message="Loading categories..." />
      </AdminLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <AdminLayout>
        <ErrorDisplay error={error} onRetry={refetchCategories} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Categories Management
          </h1>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingCategory(null);
              setFormData({ category_name: "", slug: "", image_url: "" });
            }}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-200"
          >
            Add New Category
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={formData.category_name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name
                        .toLowerCase()
                        .replace(/[^a-z0-9 -]/g, "")
                        .replace(/\s+/g, "-")
                        .replace(/-+/g, "-");
                      setFormData({
                        ...formData,
                        category_name: name,
                        slug: slug,
                      });
                    }}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="category-slug"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL-friendly version of the name
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) =>
                      setFormData({ ...formData, image_url: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL of the category image
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
                  >
                    {editingCategory ? "Update" : "Create"}
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
                  Category Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.category_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {category.category_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.slug}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        (productCounts[category.category_id] || 0) > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {productCounts[category.category_id] || 0} produk
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.category_id)}
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

export default Categories;
