import { useState, useEffect, useCallback } from "react";
import { api, API_ENDPOINTS } from "../utils/api.js";

/**
 * Custom hook for product search functionality
 */
export const useProductSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState("");

  // Debounced search to avoid too many API calls
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300); // Wait 300ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      performSearch(debouncedQuery);
    } else if (debouncedQuery.trim().length === 0) {
      clearSearch();
    }
  }, [debouncedQuery]);

  const performSearch = useCallback(async (query) => {
    if (!query.trim()) return;

    try {
      setIsSearching(true);
      setSearchError("");

      const response = await api.get(
        `${API_ENDPOINTS.PRODUCTS_SEARCH}?q=${encodeURIComponent(query)}`
      );

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
        setHasSearched(true);
      } else {
        throw new Error("Gagal mencari produk");
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchError(error.message || "Terjadi kesalahan saat mencari");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setHasSearched(false);
    setSearchError("");
    setIsSearching(false);
  }, []);

  const handleSearchInputChange = (value) => {
    setSearchQuery(value);

    // Clear results immediately if input is empty
    if (!value.trim()) {
      clearSearch();
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      performSearch(searchQuery.trim());
    }
  };

  return {
    searchQuery,
    searchResults,
    isSearching,
    hasSearched,
    searchError,
    handleSearchInputChange,
    handleSearchSubmit,
    clearSearch,
    performSearch: (query) => performSearch(query),
  };
};
