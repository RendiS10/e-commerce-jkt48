import React from "react";
import { FaStar, FaUser } from "react-icons/fa";
import ReviewItem from "../Elements/ReviewItem";
import LoadingSpinner from "../atoms/LoadingSpinner";
import ErrorDisplay from "../atoms/ErrorDisplay";

function ReviewList({ reviews, loading, error, averageRating, totalReviews }) {
  // Hitung rating dan total review dari data yang di-fetch
  const calculateRatingStats = () => {
    if (!reviews || reviews.length === 0) {
      return { avgRating: 0, totalCount: 0 };
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = totalRating / reviews.length;

    return {
      avgRating: avgRating,
      totalCount: reviews.length,
    };
  };

  const { avgRating, totalCount } = calculateRatingStats();

  if (loading) {
    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Ulasan Pelanggan</h3>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Ulasan Pelanggan</h3>
        <ErrorDisplay message="Gagal memuat ulasan" />
      </div>
    );
  }

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <FaStar
          key={i}
          className={`w-5 h-5 ${
            i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
          }`}
        />
      ));
  };

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Ulasan Pelanggan</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {renderStars(avgRating)}
            <span className="text-lg font-medium ml-2">
              {avgRating > 0 ? avgRating.toFixed(1) : "0.0"}
            </span>
          </div>
          <span className="text-gray-500">({totalCount} ulasan)</span>
        </div>
      </div>

      {reviews && reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewItem key={review.review_id} review={review} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <FaUser className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Belum ada ulasan untuk produk ini</p>
          <p className="text-sm mt-1">
            Jadilah yang pertama memberikan ulasan!
          </p>
        </div>
      )}
    </div>
  );
}

export default ReviewList;
