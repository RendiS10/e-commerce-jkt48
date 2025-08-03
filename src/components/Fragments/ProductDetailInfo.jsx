import React, { useState } from "react";
import RatingStars from "../Elements/RatingStars";
import PriceTag from "../Elements/PriceTag";
import ColorSelector from "../Elements/ColorSelector";
import SizeSelector from "../Elements/SizeSelector";
import QuantitySelector from "../Elements/QuantitySelector";
import Button from "../Elements/Button";
import WishlistButton from "../Elements/WishlistButton";
import DeliveryInfo from "../Elements/DeliveryInfo";

function ProductDetailInfo({ product }) {
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(product.sizes[2]);
  const [qty, setQty] = useState(2);

  return (
    <div className="flex-1">
      <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
      <div className="flex items-center gap-2 mb-2">
        <RatingStars value={product.rating} />
        <span className="text-sm text-gray-500">
          ({product.reviews} Reviews)
        </span>
        <span className="text-green-600 text-sm ml-2">
          {product.stock ? "In Stock" : "Out of Stock"}
        </span>
      </div>
      <PriceTag price={product.price} oldPrice={product.oldPrice} />
      <p className="text-gray-600 my-3">{product.description}</p>
      <div className="flex items-center gap-2 mb-2">
        <span>Colours:</span>
        <ColorSelector
          colors={product.colors}
          value={color}
          onChange={setColor}
        />
      </div>
      <div className="flex items-center gap-2 mb-2">
        <span>Size:</span>
        <SizeSelector sizes={product.sizes} value={size} onChange={setSize} />
      </div>
      <div className="flex items-center gap-2 mb-4">
        <QuantitySelector value={qty} setValue={setQty} />
        <Button className="bg-[#cd0c0d] text-white px-6 py-2 rounded">
          Buy Now
        </Button>
        <WishlistButton />
      </div>
      <DeliveryInfo />
    </div>
  );
}

export default ProductDetailInfo;
