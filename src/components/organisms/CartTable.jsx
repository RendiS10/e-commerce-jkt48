import React from "react";
import PropTypes from "prop-types";
import CartRow from "../molecules/CartRow";
import Text from "../atoms/Text";

/**
 * CartTable Organism - Complete cart display with header and items
 * Combines CartRow molecules to create full cart functionality
 */
const CartTable = ({ cart, onRemove, onQuantityChange, className = "" }) => {
  const headers = ["Product", "Size", "Warna", "Harga", "Jumlah", "Subtotal"];

  if (!cart || cart.length === 0) {
    return (
      <div
        className={`bg-white rounded-lg shadow-none mb-6 p-8 text-center ${className}`}
      >
        <Text variant="body" size="large" color="muted">
          Your cart is empty
        </Text>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-none mb-6 ${className}`}>
      {/* Table Header */}
      <div className="grid grid-cols-6 text-left px-6 py-4 border-b bg-gray-50">
        {headers.map((header, index) => (
          <Text key={index} variant="label" weight="semibold" color="secondary">
            {header}
          </Text>
        ))}
      </div>

      {/* Cart Items */}
      <div>
        {cart.map((item) => (
          <CartRow
            key={item.id}
            item={item}
            onRemove={onRemove}
            onQuantityChange={onQuantityChange}
          />
        ))}
      </div>

      {/* Cart Summary Info */}
      <div className="px-6 py-4 border-t bg-gray-50">
        <Text variant="body" size="small" color="muted">
          Total Items: {cart.length}
        </Text>
      </div>
    </div>
  );
};

CartTable.propTypes = {
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
  onRemove: PropTypes.func.isRequired,
  onQuantityChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default CartTable;
