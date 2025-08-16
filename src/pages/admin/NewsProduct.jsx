import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../main.jsx";
import AdminLayout from "../../components/admin/AdminLayout.jsx";

const NewsProduct = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    product_id: "",
    image_highlight: "",
    highlight_link: "",
    alt_text: "",
    display_order: "",
    is_active: true,
  });
  const { user } = useContext(UserContext);

  // Auto-generate highlight link when product is selected
  const handleProductChange = (productId) => {
    const generatedLink = productId
      ? `${window.location.origin}/detail/${productId}`
      : "";
    const selectedProduct = products.find((p) => p.product_id == productId);

    setFormData({
      ...formData,
      product_id: productId,
      highlight_link: generatedLink,
      alt_text: selectedProduct
        ? `News highlight for ${selectedProduct.product_name}`
        : formData.alt_text, // preserve existing alt_text if no product selected
    });
  };

  useEffect(() => {
    fetchNews();
    fetchProducts();
  }, []);

  const fetchNews = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/news", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setNews(data);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
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
    const token = localStorage.getItem("token");

    try {
      const url = editingNews
        ? `http://localhost:5000/api/news/${editingNews.news_id}`
        : "http://localhost:5000/api/news";

      const response = await fetch(url, {
        method: editingNews ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchNews();
        setShowForm(false);
        setEditingNews(null);
        setFormData({
          product_id: "",
          image_highlight: "",
          highlight_link: "",
          alt_text: "",
          display_order: "",
          is_active: true,
        });
      }
    } catch (error) {
      console.error("Error saving news:", error);
    }
  };

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem);
    setFormData({
      product_id: newsItem.product_id,
      image_highlight: newsItem.image_highlight || "",
      highlight_link: newsItem.highlight_link || "",
      alt_text: newsItem.alt_text || "",
      display_order: newsItem.display_order || "",
      is_active: newsItem.is_active,
    });
    setShowForm(true);
  };

  const handleDelete = async (newsId) => {
    if (!confirm("Are you sure you want to delete this news item?")) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:5000/api/news/${newsId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchNews();
      }
    } catch (error) {
      console.error("Error deleting news:", error);
    }
  };

  const toggleActive = async (newsId, currentStatus) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:5000/api/news/${newsId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      if (response.ok) {
        fetchNews();
      }
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading news...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Product News Management
          </h1>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingNews(null);
              setFormData({
                product_id: "",
                image_highlight: "",
                highlight_link: "",
                alt_text: "",
                display_order: "",
                is_active: true,
              });
            }}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-200"
          >
            Add New News
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-screen overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingNews ? "Edit News" : "Add New News"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product
                  </label>
                  <select
                    value={formData.product_id}
                    onChange={(e) => handleProductChange(e.target.value)}
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
                    Highlight Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image_highlight}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        image_highlight: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://example.com/highlight-image.jpg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Highlight Link
                  </label>
                  <input
                    type="url"
                    value={formData.highlight_link}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        highlight_link: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                    placeholder="Auto-generated when product is selected"
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Link akan otomatis di-generate ke halaman detail produk yang
                    dipilih
                  </p>
                  {formData.highlight_link && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                      <strong>Generated Link:</strong> <br />
                      <a
                        href={formData.highlight_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {formData.highlight_link}
                      </a>
                    </div>
                  )}
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
                    placeholder="Description for accessibility"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        display_order: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Order number for display"
                    min="1"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData({ ...formData, is_active: e.target.checked })
                    }
                    className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                  />
                  <label
                    htmlFor="is_active"
                    className="text-sm font-medium text-gray-700"
                  >
                    Active
                  </label>
                </div>

                {/* Preview Image */}
                {formData.image_highlight && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preview
                    </label>
                    <div className="border rounded-lg p-2">
                      <img
                        src={formData.image_highlight}
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
                    {editingNews ? "Update" : "Create"}
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
                  Link
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {news.map((newsItem) => (
                <tr key={newsItem.news_id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex-shrink-0 h-16 w-16">
                      {newsItem.image_highlight ? (
                        <img
                          className="h-16 w-16 rounded-lg object-cover"
                          src={newsItem.image_highlight}
                          alt={newsItem.alt_text || "News highlight"}
                          onError={(e) => {
                            e.target.src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23f3f4f6'/%3E%3Ctext x='32' y='38' text-anchor='middle' font-size='20'%3E📰%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center">
                          📰
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {newsItem.Product?.product_name || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {newsItem.highlight_link ? (
                      <a
                        href={newsItem.highlight_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        {newsItem.highlight_link}
                      </a>
                    ) : (
                      "No link"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {newsItem.display_order || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() =>
                        toggleActive(newsItem.news_id, newsItem.is_active)
                      }
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        newsItem.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {newsItem.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(newsItem)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(newsItem.news_id)}
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

export default NewsProduct;
