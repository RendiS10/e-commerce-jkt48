import React, { useState, useEffect, useRef } from "react";
import { api, API_ENDPOINTS } from "../../utils/api.js";

/**
 * Search Suggestions Dropdown Component
 * Shows search suggestions as user types
 */
const SearchSuggestions = ({
  searchQuery,
  onSuggestionClick,
  isVisible,
  onClose,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch suggestions based on search query
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(
          `${API_ENDPOINTS.PRODUCTS}?search=${encodeURIComponent(
            searchQuery
          )}&limit=5`
        );

        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.slice(0, 5)); // Limit to 5 suggestions
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 200);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isVisible, onClose]);

  if (!isVisible || searchQuery.trim().length < 2) {
    return null;
  }

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg z-50 max-h-60 overflow-y-auto"
    >
      {loading ? (
        <div className="p-4 text-center text-gray-500">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#cd0c0d] mx-auto"></div>
          <span className="ml-2 text-sm">Mencari...</span>
        </div>
      ) : suggestions.length > 0 ? (
        <ul className="py-2">
          {suggestions.map((product) => (
            <li
              key={product.product_id || product.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
              onClick={() => onSuggestionClick(product)}
            >
              <img
                src={product.image_url || "/no-image.png"}
                alt={product.product_name}
                className="w-8 h-8 object-cover rounded"
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">
                  {product.product_name}
                </div>
                <div className="text-xs text-gray-500">
                  Rp {Number(product.price).toLocaleString("id-ID")}
                </div>
              </div>
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </li>
          ))}
          <li className="px-4 py-2 border-t border-gray-100">
            <button
              onClick={() => onSuggestionClick({ searchAll: true })}
              className="text-sm text-[#cd0c0d] hover:underline"
            >
              Lihat semua hasil untuk "{searchQuery}"
            </button>
          </li>
        </ul>
      ) : (
        <div className="p-4 text-center text-gray-500 text-sm">
          Tidak ada saran pencarian
        </div>
      )}
    </div>
  );
};

export default SearchSuggestions;
