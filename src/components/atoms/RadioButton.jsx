import React, { forwardRef } from "react";
import PropTypes from "prop-types";

/**
 * RadioButton Atom - Reusable radio button component following atomic design principles
 * @param {Object} props - RadioButton properties
 * @param {string} props.label - Radio button label
 * @param {boolean} props.checked - Checked state
 * @param {Function} props.onChange - Change handler
 * @param {string} props.value - Input value
 * @param {string} props.name - Input name (required for radio groups)
 * @param {string} props.id - Radio button ID
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.size - Radio button size
 * @param {string} props.variant - Style variant
 * @param {string} props.labelPosition - Label position relative to radio button
 * @param {ReactNode} props.children - Additional content
 * @param {string} props.className - Additional CSS classes
 */
const RadioButton = forwardRef(
  (
    {
      label,
      checked = false,
      onChange,
      value,
      name,
      id,
      disabled = false,
      size = "medium",
      variant = "primary",
      labelPosition = "right",
      children,
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

    // Label text size based on radio button size
    const labelSizes = {
      small: "text-xs",
      medium: "text-sm",
      large: "text-base",
    };

    // Base styles
    const baseStyles =
      "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
    const disabledStyles = disabled
      ? "opacity-50 cursor-not-allowed"
      : "cursor-pointer";

    // Combine radio button styles
    const radioStyles = [
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
      "flex items-center gap-2 mb-2",
      disabledStyles,
      labelPosition === "left" ? "flex-row-reverse" : "",
    ]
      .filter(Boolean)
      .join(" ");

    const uniqueId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <label htmlFor={uniqueId} className={labelStyles}>
        <input
          ref={ref}
          type="radio"
          id={uniqueId}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={radioStyles}
          {...props}
        />
        <div className="flex flex-col">
          {label && (
            <span className={`${labelSizes[size]} select-none`}>{label}</span>
          )}
          {children && <div className="mt-1">{children}</div>}
        </div>
      </label>
    );
  }
);

RadioButton.displayName = "RadioButton";

RadioButton.propTypes = {
  label: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
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
  children: PropTypes.node,
  className: PropTypes.string,
};

export default RadioButton;
