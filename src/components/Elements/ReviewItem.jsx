import React from "react";
import { FaStar } from "react-icons/fa";

function ReviewItem({ review }) {
  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <FaStar
          key={i}
          className={`w-4 h-4 ${
            i < rating ? "text-yellow-400" : "text-gray-300"
          }`}
        />
      ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-gray-600 font-medium text-sm">
            {review.User?.full_name?.charAt(0)?.toUpperCase() || "A"}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">
              {review.User?.full_name || "Anonymous"}
            </h4>
            <span className="text-sm text-gray-500">
              {formatDate(review.review_date)}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1 mb-2">
            {renderStars(review.rating)}
            <span className="text-sm text-gray-600 ml-1">
              ({review.rating}/5)
            </span>
          </div>
          {review.comment && (
            <p className="text-gray-700 text-sm leading-relaxed">
              {review.comment}
            </p>
          )}

          {/* Admin Reply */}
          {review.admin_reply && (
            <div className="mt-3 ml-4 pl-4 border-l-2 border-blue-200 bg-blue-50 p-3 rounded-r-lg">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-xs">A</span>
                </div>
                <span className="text-sm font-medium text-blue-700">Admin</span>
              </div>
              <p className="text-sm text-blue-800 leading-relaxed">
                {review.admin_reply}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReviewItem;
