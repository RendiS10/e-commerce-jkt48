import React, { forwardRef } from "react";
import PropTypes from "prop-types";

/**
 * Input Atom - Flexible input component following atomic design principles
 * @param {Object} props - Input properties
 * @param {string} props.type - Input type
 * @param {string} props.variant - Input style variant
 * @param {string} props.size - Input size
 * @param {string} props.label - Input label
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.error - Error message
 * @param {string} props.helperText - Helper text
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.required - Required field
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.className - Additional CSS classes
 */
const Input = forwardRef(
  (
    {
      type = "text",
      variant = "default",
      size = "medium",
      label,
      placeholder,
      error,
      helperText,
      disabled = false,
      required = false,
      value,
      onChange,
      className = "",
      ...props
    },
    ref
  ) => {
    // Base input styles
    const baseStyles = "transition-all duration-200 focus:outline-none";

    // Variant styles
    const variants = {
      default:
        "w-full border-b border-gray-300 bg-transparent focus:border-[#cd0c0d]",
      outlined:
        "w-full border border-gray-300 rounded-md bg-white focus:border-[#cd0c0d] focus:ring-1 focus:ring-[#cd0c0d]",
      filled:
        "w-full bg-gray-100 border-0 rounded-md focus:bg-white focus:ring-2 focus:ring-[#cd0c0d]",
    };

    // Size styles
    const sizes = {
      small: "px-2 py-1 text-sm",
      medium: "px-3 py-2 text-base",
      large: "px-4 py-3 text-lg",
    };

    // Error styles
    const errorStyles = error
      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
      : "";

    // Disabled styles
    const disabledStyles = disabled
      ? "opacity-50 cursor-not-allowed bg-gray-50"
      : "";

    // Combine all styles
    const inputStyles = [
      baseStyles,
      variants[variant],
      sizes[size],
      errorStyles,
      disabledStyles,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="w-full mb-4">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={inputStyles}
          {...props}
        />

        {error && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

Input.propTypes = {
  type: PropTypes.string,
  variant: PropTypes.oneOf(["default", "outlined", "filled"]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  label: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  className: PropTypes.string,
};

export default Input;
