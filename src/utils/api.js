// API Configuration and Utilities
const API_BASE_URL = "http://localhost:5000/api";

/**
 * Get authorization headers with token
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Get authorization headers for multipart/form-data
 */
export const getAuthHeadersMultipart = () => {
  const token = localStorage.getItem("token");
  return {
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Make authenticated API call
 */
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    return response;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

/**
 * API methods for common operations
 */
export const api = {
  // GET request
  get: (endpoint) => apiCall(endpoint, { method: "GET" }),

  // POST request
  post: (endpoint, data) =>
    apiCall(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // PUT request
  put: (endpoint, data) =>
    apiCall(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // DELETE request
  delete: (endpoint) => apiCall(endpoint, { method: "DELETE" }),

  // GET with auth headers only (no content-type for file uploads)
  getWithAuth: (endpoint) =>
    fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getAuthHeadersMultipart(),
    }),
};

/**
 * Handle API response
 */
export const handleApiResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP error! status: ${response.status}`);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }

  return await response.text();
};

/**
 * API endpoints constants
 */
export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: "/auth/login",
  AUTH_REGISTER: "/auth/register",
  AUTH_ME: "/auth/me",
  AUTH_PROFILE: "/auth/profile",

  // Categories
  CATEGORIES: "/categories",

  // Products
  PRODUCTS: "/products",
  PRODUCTS_SEARCH: "/products/search",
  PRODUCT_IMAGES: "/product-images",
  VARIANTS: "/variants",

  // Cart
  CART: "/cart",

  // Orders
  ORDERS: "/orders",
  ORDERS_ALL: "/orders/all",
  ORDERS_NOTIFICATIONS: "/orders/notifications",

  // Payments
  PAYMENTS_ALL: "/payments/all",

  // Users
  USERS: "/users",

  // Reviews
  REVIEWS: "/reviews",

  // News
  NEWS: "/news",

  // Transactions
  TRANSACTIONS: "/transactions",

  // Messages
  MESSAGES: "/messages",
};
