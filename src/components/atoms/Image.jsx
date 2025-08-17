import React, { useState } from "react";
import PropTypes from "prop-types";

/**
 * Image Atom - Flexible image component with loading states and error handling
 * @param {Object} props - Image properties
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alt text for accessibility
 * @param {string} props.size - Predefined size variant
 * @param {string} props.width - Custom width
 * @param {string} props.height - Custom height
 * @param {string} props.objectFit - CSS object-fit property
 * @param {string} props.borderRadius - Border radius variant
 * @param {boolean} props.lazy - Enable lazy loading
 * @param {string} props.fallback - Fallback image URL
 * @param {ReactNode} props.placeholder - Loading placeholder
 * @param {Function} props.onLoad - Image load callback
 * @param {Function} props.onError - Image error callback
 * @param {string} props.className - Additional CSS classes
 */
const Image = ({
  src,
  alt = "",
  size = "auto",
  width,
  height,
  objectFit = "cover",
  borderRadius = "none",
  lazy = true,
  fallback = "/images/placeholder.jpg",
  placeholder,
  onLoad,
  onError,
  className = "",
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  // Size variants
  const sizes = {
    xs: "w-8 h-8",
    small: "w-16 h-16",
    medium: "w-24 h-24",
    large: "w-32 h-32",
    xl: "w-48 h-48",
    full: "w-full h-full",
    auto: "",
  };

  // Border radius variants
  const borderRadiuses = {
    none: "",
    small: "rounded-sm",
    medium: "rounded-md",
    large: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  };

  // Object fit styles
  const objectFits = {
    contain: "object-contain",
    cover: "object-cover",
    fill: "object-fill",
    none: "object-none",
    "scale-down": "object-scale-down",
  };

  // Handle image load
  const handleLoad = (e) => {
    setIsLoading(false);
    setHasError(false);
    if (onLoad) onLoad(e);
  };

  // Handle image error
  const handleError = (e) => {
    setIsLoading(false);
    setHasError(true);
    if (fallback && imageSrc !== fallback) {
      setImageSrc(fallback);
      setHasError(false);
      setIsLoading(true);
    }
    if (onError) onError(e);
  };

  // Combine styles
  const imageStyles = [
    sizes[size],
    borderRadiuses[borderRadius],
    objectFits[objectFit],
    "transition-opacity duration-200",
    isLoading ? "opacity-50" : "opacity-100",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Custom dimensions
  const style = {
    ...(width && { width }),
    ...(height && { height }),
  };

  return (
    <div className="relative inline-block">
      {isLoading && placeholder && (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-gray-100 ${borderRadiuses[borderRadius]}`}
        >
          {placeholder}
        </div>
      )}

      <img
        src={imageSrc}
        alt={alt}
        loading={lazy ? "lazy" : "eager"}
        onLoad={handleLoad}
        onError={handleError}
        className={imageStyles}
        style={style}
        {...props}
      />

      {hasError && !fallback && (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 text-sm ${borderRadiuses[borderRadius]}`}
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  size: PropTypes.oneOf([
    "xs",
    "small",
    "medium",
    "large",
    "xl",
    "full",
    "auto",
  ]),
  width: PropTypes.string,
  height: PropTypes.string,
  objectFit: PropTypes.oneOf([
    "contain",
    "cover",
    "fill",
    "none",
    "scale-down",
  ]),
  borderRadius: PropTypes.oneOf([
    "none",
    "small",
    "medium",
    "large",
    "xl",
    "full",
  ]),
  lazy: PropTypes.bool,
  fallback: PropTypes.string,
  placeholder: PropTypes.node,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  className: PropTypes.string,
};

export default Image;
