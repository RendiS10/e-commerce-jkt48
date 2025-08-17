import React from "react";

/**
 * Reusable Error Display Component
 */
const ErrorDisplay = ({
  error,
  onRetry,
  retryText = "Coba Lagi",
  className = "",
  showIcon = true,
}) => {
  return (
    <div className={`text-center py-8 ${className}`}>
      <div className="flex flex-col items-center gap-4">
        {showIcon && <div className="text-4xl text-red-500">⚠️</div>}
        <div className="text-red-500 text-lg">{error}</div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-[#cd0c0d] text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
          >
            {retryText}
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;
