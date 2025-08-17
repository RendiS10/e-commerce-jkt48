import React from "react";
import PropTypes from "prop-types";

/**
 * Text Atom - Flexible text component for consistent typography
 * @param {Object} props - Text properties
 * @param {string} props.as - HTML element to render as
 * @param {string} props.variant - Text style variant
 * @param {string} props.size - Text size
 * @param {string} props.weight - Font weight
 * @param {string} props.color - Text color
 * @param {string} props.align - Text alignment
 * @param {boolean} props.italic - Italic text
 * @param {boolean} props.underline - Underlined text
 * @param {ReactNode} props.children - Text content
 * @param {string} props.className - Additional CSS classes
 */
const Text = ({
  as: Component = "span",
  variant = "body",
  size = "medium",
  weight = "normal",
  color = "default",
  align = "left",
  italic = false,
  underline = false,
  children,
  className = "",
  ...props
}) => {
  // Variant styles
  const variants = {
    heading: "font-semibold leading-tight",
    subheading: "font-medium leading-snug",
    body: "leading-relaxed",
    caption: "text-xs leading-normal",
    label: "font-medium leading-none",
  };

  // Size styles
  const sizes = {
    xs: "text-xs",
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
  };

  // Weight styles
  const weights = {
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    extrabold: "font-extrabold",
  };

  // Color styles
  const colors = {
    default: "text-gray-900",
    muted: "text-gray-600",
    light: "text-gray-400",
    primary: "text-[#cd0c0d]",
    secondary: "text-gray-700",
    success: "text-green-600",
    warning: "text-yellow-600",
    danger: "text-red-600",
    white: "text-white",
    black: "text-black",
  };

  // Alignment styles
  const alignments = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
  };

  // Additional styles
  const italicStyle = italic ? "italic" : "";
  const underlineStyle = underline ? "underline" : "";

  // Combine all styles
  const textStyles = [
    variants[variant],
    sizes[size],
    weights[weight],
    colors[color],
    alignments[align],
    italicStyle,
    underlineStyle,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={textStyles} {...props}>
      {children}
    </Component>
  );
};

Text.propTypes = {
  as: PropTypes.string,
  variant: PropTypes.oneOf([
    "heading",
    "subheading",
    "body",
    "caption",
    "label",
  ]),
  size: PropTypes.oneOf([
    "xs",
    "small",
    "medium",
    "large",
    "xl",
    "2xl",
    "3xl",
    "4xl",
  ]),
  weight: PropTypes.oneOf([
    "light",
    "normal",
    "medium",
    "semibold",
    "bold",
    "extrabold",
  ]),
  color: PropTypes.oneOf([
    "default",
    "muted",
    "light",
    "primary",
    "secondary",
    "success",
    "warning",
    "danger",
    "white",
    "black",
  ]),
  align: PropTypes.oneOf(["left", "center", "right", "justify"]),
  italic: PropTypes.bool,
  underline: PropTypes.bool,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Text;
