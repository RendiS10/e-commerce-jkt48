import React from "react";

function Checkbox({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer mt-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="accent-[#cd0c0d]"
      />
      <span className="text-sm">{label}</span>
    </label>
  );
}

export default Checkbox;
