import React, { useState } from "react";
import PropTypes from "prop-types";
import Input from "../atoms/Input";
import Button from "../atoms/Button";

/**
 * SearchBox Molecule - Search input with search button
 * Combines Input and Button atoms for search functionality
 */
const SearchBox = ({
  placeholder = "Search...",
  onSearch,
  onChange,
  value,
  className = "",
  variant = "outlined",
  size = "medium",
  disabled = false,
  ...props
}) => {
  const [searchValue, setSearchValue] = useState(value || "");

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    if (onChange) {
      onChange(e);
    }
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1">
        <Input
          type="text"
          variant={variant}
          size={size}
          placeholder={placeholder}
          value={searchValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          {...props}
        />
      </div>
      <Button
        variant="primary"
        size={size}
        onClick={handleSearch}
        disabled={disabled || !searchValue.trim()}
        className="flex-shrink-0"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </Button>
    </div>
  );
};

SearchBox.propTypes = {
  placeholder: PropTypes.string,
  onSearch: PropTypes.func,
  onChange: PropTypes.func,
  value: PropTypes.string,
  className: PropTypes.string,
  variant: PropTypes.oneOf(["default", "outlined", "filled"]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  disabled: PropTypes.bool,
};

export default SearchBox;
