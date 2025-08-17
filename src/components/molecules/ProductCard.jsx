import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Image from "../atoms/Image";
import Text from "../atoms/Text";

/**
 * ProductCard Molecule - Product display card component
 * Combines multiple atoms to create a product card
 */
const ProductCard = ({
  image,
  name,
  price,
  oldPrice,
  rating = 0,
  reviews = 0,
  link,
  className = "",
  ...props
}) => {
  // Generate star rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={i <= rating ? "text-[#ffb400]" : "text-gray-300"}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const cardStyles = [
    "bg-white rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#eee]",
    "w-[200px] p-4 pt-4 pb-3 flex flex-col gap-2 relative",
    "transition-all duration-200 hover:shadow-md hover:-translate-y-1",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link to={link} className={cardStyles} {...props}>
      {/* Product Image */}
      <div className="relative w-full h-[120px] flex items-center justify-center bg-[#fafafa] rounded-lg overflow-hidden">
        <Image
          src={image}
          alt={name}
          className="max-w-[100px] max-h-[100px] object-contain"
          lazy={true}
          placeholder={
            <div className="w-16 h-16 bg-gray-200 rounded animate-pulse"></div>
          }
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-1">
        {/* Product Name */}
        <Text
          variant="body"
          size="medium"
          weight="medium"
          className="mb-[2px] line-clamp-2"
          title={name}
        >
          {name}
        </Text>

        {/* Price Section */}
        <div className="flex gap-2 items-center">
          <Text variant="body" size="medium" weight="semibold" color="primary">
            {price}
          </Text>
          {oldPrice && (
            <Text
              variant="body"
              size="small"
              color="muted"
              className="line-through"
            >
              {oldPrice}
            </Text>
          )}
        </div>

        {/* Rating Section */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center text-base">
            {renderStars(rating)}
          </div>
          <Text variant="caption" color="muted">
            ({reviews})
          </Text>
        </div>
      </div>
    </Link>
  );
};

ProductCard.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  oldPrice: PropTypes.string,
  rating: PropTypes.number,
  reviews: PropTypes.number,
  link: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default ProductCard;
