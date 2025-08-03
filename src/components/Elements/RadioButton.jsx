import React from "react";

function RadioButton({ label, checked, onChange, value, children }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer mb-2">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        value={value}
        className="accent-[#cd0c0d]"
      />
      <span>{label}</span>
      {children}
    </label>
  );
}

export default RadioButton;
