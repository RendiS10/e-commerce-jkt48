import React, { forwardRef } from "react";
import PropTypes from "prop-types";

/**
 * Checkbox Atom - Reusable checkbox component following atomic design principles
 * @param {Object} props - Checkbox properties
 * @param {boolean} props.checked - Checked state
 * @param {Function} props.onChange - Change handler
 * @param {string} props.label - Checkbox label
 * @param {string} props.id - Checkbox ID
 * @param {string} props.name - Input name
 * @param {string} props.value - Input value
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.size - Checkbox size
 * @param {string} props.variant - Style variant
 * @param {string} props.labelPosition - Label position relative to checkbox
 * @param {string} props.className - Additional CSS classes
 */
const Checkbox = forwardRef(
  (
    {
      checked = false,
      onChange,
      label,
      id,
      name,
      value,
      disabled = false,
      size = "medium",
      variant = "primary",
      labelPosition = "right",
      className = "",
      ...props
    },
    ref
  ) => {
    // Size styles
    const sizes = {
      small: "w-3 h-3",
      medium: "w-4 h-4",
      large: "w-5 h-5",
    };

    // Variant styles
    const variants = {
      primary: "accent-[#cd0c0d] text-[#cd0c0d]",
      secondary: "accent-gray-600 text-gray-600",
      success: "accent-green-600 text-green-600",
      warning: "accent-yellow-600 text-yellow-600",
      danger: "accent-red-600 text-red-600",
    };

    // Label text size based on checkbox size
    const labelSizes = {
      small: "text-xs",
      medium: "text-sm",
      large: "text-base",
    };

    // Base styles
    const baseStyles =
      "transition-all duration-200 rounded focus:outline-none focus:ring-2 focus:ring-offset-2";
    const disabledStyles = disabled
      ? "opacity-50 cursor-not-allowed"
      : "cursor-pointer";

    // Combine checkbox styles
    const checkboxStyles = [
      baseStyles,
      sizes[size],
      variants[variant],
      disabledStyles,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // Label styles
    const labelStyles = [
      "flex items-center gap-2",
      disabledStyles,
      labelPosition === "left" ? "flex-row-reverse" : "",
    ]
      .filter(Boolean)
      .join(" ");

    const uniqueId =
      id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <label htmlFor={uniqueId} className={labelStyles}>
        <input
          ref={ref}
          type="checkbox"
          id={uniqueId}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={checkboxStyles}
          {...props}
        />
        {label && (
          <span className={`${labelSizes[size]} select-none`}>{label}</span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

Checkbox.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  label: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "success",
    "warning",
    "danger",
  ]),
  labelPosition: PropTypes.oneOf(["left", "right"]),
  className: PropTypes.string,
};

export default Checkbox;
