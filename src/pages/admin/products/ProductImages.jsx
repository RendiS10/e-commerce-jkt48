import React, { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { UserContext } from "../../../main.jsx";
import AdminLayout from "../../../components/admin/AdminLayout.jsx";

const ProductImages = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    product_id: "",
    image_path: "",
    alt_text: "",
  });
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetchImages();
    fetchProducts();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch(
        "https://e-commerce-jkt48-prototype-production.up.railway.app/api/product-images"
      );
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "https://e-commerce-jkt48-prototype-production.up.railway.app/api/products"
      );
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

    // Find product for display information
    const selectedProduct = products.find(
      (p) => p.product_id.toString() === formData.product_id.toString()
    );

    // SweetAlert konfirmasi sebelum simpan image
    const result = await Swal.fire({
      icon: "question",
      title: editingImage ? "Edit Gambar Produk" : "Tambah Gambar Produk",
      text: editingImage
        ? "Apakah Anda yakin ingin mengupdate gambar produk ini?"
        : "Apakah Anda yakin ingin menambahkan gambar produk ini?",
      html: `
        <div class="text-center">
          <p><strong>Produk:</strong> ${
            selectedProduct?.product_name || "Unknown"
          }</p>
          <p><strong>URL Gambar:</strong> ${formData.image_path}</p>
          ${
            formData.alt_text
              ? `<p><strong>Alt Text:</strong> ${formData.alt_text}</p>`
              : ""
          }
          <p class="text-sm text-gray-600 mt-2">Pastikan URL gambar sudah benar sebelum melanjutkan.</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: editingImage
        ? "Ya, Update Gambar"
        : "Ya, Tambah Gambar",
      cancelButtonText: "Batal",
      confirmButtonColor: "#cd0c0d",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const url = editingImage
        ? `https://e-commerce-jkt48-prototype-production.up.railway.app/api/product-images/${editingImage.image_id}`
        : "https://e-commerce-jkt48-prototype-production.up.railway.app/api/product-images";

      const response = await fetch(url, {
        method: editingImage ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // SweetAlert sukses gambar disimpan
        await Swal.fire({
          icon: "success",
          title: editingImage
            ? "Gambar Berhasil Diupdate!"
            : "Gambar Berhasil Ditambahkan!",
          text: editingImage
            ? "Gambar produk telah berhasil diupdate."
            : "Gambar produk baru telah berhasil ditambahkan.",
          confirmButtonText: "OK",
          confirmButtonColor: "#cd0c0d",
        });

        fetchImages();
        setShowForm(false);
        setEditingImage(null);
        setFormData({
          product_id: "",
          image_path: "",
          alt_text: "",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menyimpan gambar");
      }
    } catch (error) {
      console.error("Error saving image:", error);

      // SweetAlert error simpan gambar
      Swal.fire({
        icon: "error",
        title: "Gagal Menyimpan Gambar",
        text:
          error.message ||
          "Terjadi kesalahan saat menyimpan gambar. Silakan coba lagi.",
        confirmButtonText: "Coba Lagi",
        confirmButtonColor: "#cd0c0d",
      });
    }
  };

  const handleEdit = (image) => {
    setEditingImage(image);
    setFormData({
      product_id: image.product_id,
      image_path: image.image_path,
      alt_text: image.alt_text || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (imageId) => {
    // Find image and product for display information
    const image = images.find((img) => img.image_id === imageId);
    const product = products.find((p) => p.product_id === image?.product_id);

    // SweetAlert konfirmasi sebelum hapus gambar
    const result = await Swal.fire({
      icon: "warning",
      title: "Hapus Gambar Produk",
      text: "Apakah Anda yakin ingin menghapus gambar produk ini?",
      html: `
        <div class="text-center">
          <p><strong>Produk:</strong> ${product?.product_name || "Unknown"}</p>
          <p><strong>URL:</strong> ${image?.image_path || "Unknown"}</p>
          ${
            image?.alt_text
              ? `<p><strong>Alt Text:</strong> ${image.alt_text}</p>`
              : ""
          }
          <div class="mt-3 mb-2">
            <img src="${
              image?.image_path
            }" alt="Preview" style="max-width: 150px; max-height: 100px; margin: 0 auto; border-radius: 8px;" 
                 onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'150\\' height=\\'100\\' viewBox=\\'0 0 150 100\\'%3E%3Crect width=\\'150\\' height=\\'100\\' fill=\\'%23f3f4f6\\'/%3E%3Ctext x=\\'75\\' y=\\'55\\' text-anchor=\\'middle\\' font-size=\\'14\\'%3EGambar tidak ditemukan%3C/text%3E%3C/svg%3E';">
          </div>
          <p class="text-sm text-gray-600 mt-2">Gambar yang sudah dihapus tidak dapat dikembalikan.</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus Gambar",
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
        `https://e-commerce-jkt48-prototype-production.up.railway.app/api/product-images/${imageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        // SweetAlert sukses gambar dihapus
        await Swal.fire({
          icon: "success",
          title: "Gambar Berhasil Dihapus!",
          text: "Gambar produk telah berhasil dihapus dari sistem.",
          confirmButtonText: "OK",
          confirmButtonColor: "#cd0c0d",
        });

        fetchImages();
      } else {
        throw new Error("Failed to delete image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);

      // SweetAlert error hapus gambar
      Swal.fire({
        icon: "error",
        title: "Gagal Hapus Gambar",
        text:
          error.message ||
          "Terjadi kesalahan saat menghapus gambar. Silakan coba lagi.",
        confirmButtonText: "Coba Lagi",
        confirmButtonColor: "#cd0c0d",
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading images...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Product Images Management
          </h1>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingImage(null);
              setFormData({
                product_id: "",
                image_path: "",
                alt_text: "",
              });
            }}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-200"
          >
            Add New Image
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {editingImage ? "Edit Product Image" : "Add New Product Image"}
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
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image_path}
                    onChange={(e) =>
                      setFormData({ ...formData, image_path: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the URL of the product image
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alt Text
                  </label>
                  <input
                    type="text"
                    value={formData.alt_text}
                    onChange={(e) =>
                      setFormData({ ...formData, alt_text: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Description of the image"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Alternative text for accessibility
                  </p>
                </div>

                {/* Preview Image */}
                {formData.image_path && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preview
                    </label>
                    <div className="border rounded-lg p-2">
                      <img
                        src={formData.image_path}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded"
                        onError={(e) => {
                          e.target.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='100' viewBox='0 0 200 100'%3E%3Crect width='200' height='100' fill='%23f3f4f6'/%3E%3Ctext x='100' y='55' text-anchor='middle' font-size='14'%3EImage not found%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
                  >
                    {editingImage ? "Update" : "Create"}
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
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alt Text
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {images.map((image) => (
                <tr key={image.image_id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex-shrink-0 h-16 w-16">
                      <img
                        className="h-16 w-16 rounded-lg object-cover"
                        src={image.image_path}
                        alt={image.alt_text || "Product image"}
                        onError={(e) => {
                          e.target.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23f3f4f6'/%3E%3Ctext x='32' y='38' text-anchor='middle' font-size='20'%3E📷%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {image.Product?.product_name || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    <a
                      href={image.image_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {image.image_path}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {image.alt_text || "No alt text"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(image)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(image.image_id)}
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

export default ProductImages;
