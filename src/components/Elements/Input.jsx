import React from "react";

function Input({ type = "text", placeholder, value, onChange, ...props }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full border-b border-gray-300 py-2 px-1 text-sm focus:outline-none focus:border-[#cd0c0d] bg-transparent mb-6"
      {...props}
    />
  );
}

export default Input;
