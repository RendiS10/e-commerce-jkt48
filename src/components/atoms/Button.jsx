import React from "react";
import PropTypes from "prop-types";

/**
 * Button Atom - Basic button component following atomic design principles
 * @param {Object} props - Button properties
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.variant - Button style variant
 * @param {string} props.size - Button size
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.loading - Loading state
 * @param {string} props.type - Button type
 * @param {Function} props.onClick - Click handler
 * @param {string} props.className - Additional CSS classes
 */
function Button({
  children,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  type = "button",
  onClick,
  className = "",
  ...props
}) {
  // Base button styles
  const baseStyles =
    "font-medium rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  // Variant styles
  const variants = {
    primary: "bg-[#cd0c0d] text-white hover:bg-[#b00a0a] focus:ring-red-500",
    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
    outline:
      "border-2 border-[#cd0c0d] text-[#cd0c0d] hover:bg-[#cd0c0d] hover:text-white focus:ring-red-500",
    ghost: "text-[#cd0c0d] hover:bg-red-50 focus:ring-red-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
  };

  // Size styles
  const sizes = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-6 py-2 text-base",
    large: "px-8 py-3 text-lg",
  };

  // Disabled styles
  const disabledStyles = "opacity-50 cursor-not-allowed hover:bg-current";

  // Loading styles
  const loadingStyles = "relative overflow-hidden";

  // Combine all styles
  const buttonStyles = [
    baseStyles,
    variants[variant],
    sizes[size],
    disabled && disabledStyles,
    loading && loadingStyles,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonStyles}
      {...props}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg
            className="animate-spin h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
      )}
      <span className={loading ? "opacity-0" : ""}>{children}</span>
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "outline",
    "ghost",
    "danger",
    "success",
  ]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Button;
