import React from "react";

function Button({ children, onClick, className = "", ...props }) {
  return (
    <button
      onClick={onClick}
      className={`bg-[#cd0c0d] text-white rounded px-8 py-2 mt-2 text-base font-medium hover:bg-[#b00a0a] transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
