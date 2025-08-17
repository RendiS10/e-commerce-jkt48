import React from "react";
import PropTypes from "prop-types";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Image from "../atoms/Image";
import Text from "../atoms/Text";

/**
 * CartRow Molecule - Individual cart item row component
 * Combines atoms to display cart item information
 */
const CartRow = ({ item, onRemove, onQuantityChange }) => {
  // Fungsi format Rupiah
  const formatRupiah = (amount) => {
    if (!amount || isNaN(amount)) return "Rp0";
    let str = amount.toString().replace(/[^\d,]/g, "");
    let [main, decimal] = str.split(",");
    main = main || "0";
    let formatted = main.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return "Rp" + formatted + (decimal ? "," + decimal : "");
  };

  // Ambil image dari item.Product.main_image jika ada, fallback ke item.image
  let image =
    (item.Product &&
    item.Product.main_image &&
    (item.Product.main_image.startsWith("uploads/") ||
      item.Product.main_image.startsWith("/uploads/"))
      ? `http://localhost:5000/${item.Product.main_image.replace(/^\/+/, "")}`
      : item.Product &&
        item.Product.main_image &&
        item.Product.main_image.startsWith("http")
      ? item.Product.main_image
      : item.image) || "/no-image.png";

  const handleQuantityChange = (e) => {
    const newQuantity = Math.max(0, Math.min(99, Number(e.target.value)));
    onQuantityChange(item.id, newQuantity);
  };

  return (
    <div className="grid grid-cols-6 items-center px-6 py-4 border-b last:border-b-0 bg-white relative">
      {/* Product Info */}
      <div className="flex items-center gap-4">
        <Button
          variant="danger"
          size="small"
          onClick={() => onRemove(item.id)}
          className="absolute left-2 top-2 !w-6 !h-6 !p-0 !min-w-0 rounded-full flex items-center justify-center text-xs font-bold"
          title="Remove item"
        >
          ×
        </Button>
        <Image
          src={image}
          alt={item.name}
          className="w-14 h-14 object-contain rounded"
          fallback="/no-image.png"
          size="auto"
        />
        <Text variant="body" weight="medium" color="default">
          {item.name}
        </Text>
      </div>

      {/* Size */}
      <Text variant="body" size="small" color="muted">
        {item.ProductVariant?.size || item.size || "-"}
      </Text>

      {/* Color */}
      <Text variant="body" size="small" color="muted">
        {item.ProductVariant?.color || item.color || "-"}
      </Text>

      {/* Price */}
      <Text variant="body" weight="medium" color="default">
        {formatRupiah(item.price)}
      </Text>

      {/* Quantity */}
      <Input
        type="number"
        min={0}
        max={99}
        value={item.quantity}
        onChange={handleQuantityChange}
        variant="outlined"
        size="small"
        className="!w-16 !mb-0"
      />

      {/* Subtotal */}
      <Text variant="body" weight="medium" color="default">
        {formatRupiah(item.price * item.quantity)}
      </Text>
    </div>
  );
};

CartRow.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    image: PropTypes.string,
    size: PropTypes.string,
    color: PropTypes.string,
    Product: PropTypes.shape({
      main_image: PropTypes.string,
    }),
    ProductVariant: PropTypes.shape({
      size: PropTypes.string,
      color: PropTypes.string,
    }),
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
  onQuantityChange: PropTypes.func.isRequired,
};

export default CartRow;
