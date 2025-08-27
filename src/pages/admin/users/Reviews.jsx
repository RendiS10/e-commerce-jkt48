import React, { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { UserContext } from "../../../main.jsx";
import AdminLayout from "../../../components/admin/AdminLayout.jsx";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyingToReview, setReplyingToReview] = useState(null);
  const [replyText, setReplyText] = useState("");
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        "https://e-commerce-jkt48-prototype-production.up.railway.app/api/reviews"
      );
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = (review) => {
    setReplyingToReview(review);
    setReplyText(review.admin_reply || "");
    setShowReplyForm(true);
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();

    // Validasi input
    if (!replyText.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Balasan Kosong",
        text: "Mohon tulis balasan sebelum mengirim.",
        confirmButtonText: "OK",
        confirmButtonColor: "#cd0c0d",
      });
      return;
    }

    // SweetAlert konfirmasi sebelum mengirim balasan
    const result = await Swal.fire({
      icon: "question",
      title: "Konfirmasi Balasan",
      text: "Apakah Anda yakin ingin mengirim balasan ini?",
      html: `
        <div class="text-left">
          <p><strong>Produk:</strong> ${
            replyingToReview?.Product?.product_name || "N/A"
          }</p>
          <p><strong>Pelanggan:</strong> ${
            replyingToReview?.User?.full_name || "N/A"
          }</p>
          <p><strong>Rating:</strong> ${getStarRating(
            replyingToReview?.rating
          )}</p>
          <p><strong>Balasan Anda:</strong></p>
          <div class="bg-gray-100 p-2 rounded text-sm mt-1">${replyText}</div>
          <p class="text-sm text-gray-600 mt-2">Balasan ini akan terlihat oleh pelanggan dan pengunjung lainnya.</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Ya, Kirim Balasan",
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
      const response = await fetch(
        `https://e-commerce-jkt48-prototype-production.up.railway.app/api/reviews/reply/${replyingToReview.review_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ admin_reply: replyText }),
        }
      );

      if (response.ok) {
        // SweetAlert sukses balasan terkirim
        await Swal.fire({
          icon: "success",
          title: "Balasan Berhasil Dikirim!",
          text: "Balasan Anda telah berhasil disimpan dan akan terlihat di halaman review.",
          confirmButtonText: "OK",
          confirmButtonColor: "#cd0c0d",
        });

        fetchReviews();
        setShowReplyForm(false);
        setReplyingToReview(null);
        setReplyText("");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send reply");
      }
    } catch (error) {
      console.error("Error saving reply:", error);

      // SweetAlert error balasan gagal
      Swal.fire({
        icon: "error",
        title: "Gagal Mengirim Balasan",
        text:
          error.message ||
          "Terjadi kesalahan saat mengirim balasan. Silakan coba lagi.",
        confirmButtonText: "Coba Lagi",
        confirmButtonColor: "#cd0c0d",
      });
    }
  };

  const getStarRating = (rating) => {
    return "⭐".repeat(rating) + "☆".repeat(5 - rating);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading reviews...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Reviews Management
          </h1>
          <div className="text-sm text-gray-600">
            Manage customer reviews and provide responses
          </div>
        </div>

        {showReplyForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Reply to Review</h2>
              <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">
                  Customer Review:
                </div>
                <div className="font-medium">
                  {replyingToReview?.Product?.product_name}
                </div>
                <div className="text-sm text-gray-600">
                  {replyingToReview?.User?.full_name}
                </div>
                <div className="mt-1">
                  {getStarRating(replyingToReview?.rating)}
                </div>
                <div className="mt-2 text-sm">{replyingToReview?.comment}</div>
              </div>
              <form onSubmit={handleSubmitReply} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admin Reply
                  </label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows="4"
                    placeholder="Write your reply to the customer..."
                    required
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
                  >
                    Send Reply
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReplyForm(false)}
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
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin Reply
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reviews.map((review) => (
                <tr key={review.review_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {review.Product?.product_name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {review.User?.full_name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getStarRating(review.rating)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {review.comment || "No comment"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                    {review.admin_reply ? (
                      <div className="bg-blue-50 p-2 rounded text-xs">
                        {review.admin_reply}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">No reply yet</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(review.review_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleReply(review)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      {review.admin_reply ? "Edit Reply" : "Reply"}
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

export default Reviews;
