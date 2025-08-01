import React from "react";
import Button from "./Button";

function CartActions() {
  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <Button className="bg-white border border-gray-400 text-gray-700 px-6 py-2 rounded hover:bg-gray-50">
        Return To Shop
      </Button>
      <Button className="bg-white border border-gray-400 text-gray-700 px-6 py-2 rounded hover:bg-gray-50">
        Update Cart
      </Button>
    </div>
  );
}

export default CartActions;
