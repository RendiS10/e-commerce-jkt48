import React from "react";
import PropTypes from "prop-types";
import Text from "../atoms/Text";

/**
 * CategoryCard Molecule - Category selection card component
 * Combines multiple atoms to create a category card
 */
const CategoryCard = ({
  icon,
  label,
  active = false,
  onClick,
  className = "",
  variant = "default",
  size = "medium",
  ...props
}) => {
  // Size variants
  const sizes = {
    small: "w-[80px] h-[80px]",
    medium: "w-[120px] h-[120px]",
    large: "w-[160px] h-[160px]",
  };

  // Icon sizes based on card size
  const iconSizes = {
    small: "text-lg",
    medium: "text-2xl",
    large: "text-3xl",
  };

  // Text sizes based on card size
  const textSizes = {
    small: "xs",
    medium: "xs",
    large: "small",
  };

  // Base styles
  const baseStyles = [
    "border-2 rounded-lg bg-white flex flex-col items-center justify-center gap-3",
    "cursor-pointer transition-all duration-200",
    sizes[size],
  ];

  // Active/inactive styles
  const stateStyles = active
    ? "bg-[#cd0c0d] text-white border-[#cd0c0d] shadow-lg"
    : "border-[#e0e0e0] hover:border-[#cd0c0d] hover:shadow-md hover:-translate-y-1";

  // Combine all styles
  const cardStyles = [...baseStyles, stateStyles, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={cardStyles}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick && onClick();
        }
      }}
      {...props}
    >
      {/* Category Icon */}
      <div
        className={`${iconSizes[size]} mb-2 transition-transform duration-200 ${
          active ? "" : "group-hover:scale-110"
        }`}
      >
        {typeof icon === "string" ? <span>{icon}</span> : icon}
      </div>

      {/* Category Label */}
      <Text
        variant="label"
        size={textSizes[size]}
        weight="medium"
        align="center"
        color={active ? "white" : "default"}
        className="transition-colors duration-200"
      >
        {label}
      </Text>
    </div>
  );
};

CategoryCard.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  label: PropTypes.string.isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  variant: PropTypes.oneOf(["default"]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
};

export default CategoryCard;
