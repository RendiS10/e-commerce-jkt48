import React from "react";

/**
 * Reusable Loading Spinner Component
 */
const LoadingSpinner = ({
  message = "Loading...",
  size = "default",
  className = "",
  showSpinner = true,
}) => {
  const sizeClasses = {
    small: "h-32",
    default: "h-64",
    large: "h-96",
  };

  return (
    <div
      className={`flex items-center justify-center ${sizeClasses[size]} ${className}`}
    >
      <div className="flex flex-col items-center gap-4">
        {showSpinner && (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#cd0c0d]"></div>
        )}
        <div className="text-lg text-gray-600">{message}</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
