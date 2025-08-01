import React from "react";

function CategoryCard({ icon, label, active, onClick }) {
  return (
    <div
      className={`border-2 rounded-lg bg-white w-[120px] h-[120px] flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 ${
        active
        // ? "bg-[#cd0c0d] text-white border-[#cd0c0d]"
        // : "border-[#e0e0e0] hover:border-[#cd0c0d]"
      }`}
      onClick={onClick}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-xs font-medium text-center">{label}</div>
    </div>
  );
}

export default CategoryCard;
