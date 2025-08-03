import React from "react";

function DeliveryInfo() {
  return (
    <div className="border rounded-lg p-4 mt-4 text-sm bg-gray-50">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">🚚</span>
        <span>Free Delivery</span>
        <a href="#" className="ml-auto underline text-xs text-gray-500">
          Enter your postal code for Delivery Availability
        </a>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xl">↩️</span>
        <span>Return Delivery</span>
        <span className="ml-auto text-xs text-gray-500">
          Free 30 Days Delivery Returns.{" "}
          <a href="#" className="underline">
            Details
          </a>
        </span>
      </div>
    </div>
  );
}

export default DeliveryInfo;
