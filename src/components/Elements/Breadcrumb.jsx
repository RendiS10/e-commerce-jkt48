import React from "react";

function Breadcrumb({ items }) {
  return (
    <div className="text-sm text-gray-500 mb-6 flex gap-2 items-center">
      {items.map((item, idx) => (
        <React.Fragment key={item.label}>
          <span className={item.active ? "text-[#cd0c0d]" : ""}>
            {item.label}
          </span>
          {idx < items.length - 1 && <span>/</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

export default Breadcrumb;
