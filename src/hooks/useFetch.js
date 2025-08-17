import { useState, useEffect } from "react";
import { api, handleApiResponse } from "../utils/api";

/**
 * Custom hook for data fetching with loading and error states
 */
export const useFetch = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { dependencies = [], transform } = options;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(endpoint);
        const result = await handleApiResponse(response);

        // Apply transformation if provided
        const finalData = transform ? transform(result) : result;
        setData(finalData);
      } catch (err) {
        setError(err.message || "Terjadi kesalahan saat memuat data");
        console.error(`Error fetching ${endpoint}:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, ...dependencies]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(endpoint);
      const result = await handleApiResponse(response);

      const finalData = transform ? transform(result) : result;
      setData(finalData);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat memuat data");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch, setData };
};

/**
 * Custom hook for authentication-required API calls
 */
export const useAuthenticatedFetch = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { dependencies = [], transform, requireAuth = true } = options;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Check if token exists when auth is required
        if (requireAuth && !localStorage.getItem("token")) {
          throw new Error("Authentication required");
        }

        const response = await api.get(endpoint);
        const result = await handleApiResponse(response);

        const finalData = transform ? transform(result) : result;
        setData(finalData);
      } catch (err) {
        setError(err.message || "Terjadi kesalahan saat memuat data");
        console.error(`Error fetching ${endpoint}:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, ...dependencies]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError("");

      if (requireAuth && !localStorage.getItem("token")) {
        throw new Error("Authentication required");
      }

      const response = await api.get(endpoint);
      const result = await handleApiResponse(response);

      const finalData = transform ? transform(result) : result;
      setData(finalData);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat memuat data");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch, setData };
};

/**
 * Custom hook for API mutations (POST, PUT, DELETE)
 */
export const useMutation = (options = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const mutate = async (apiCall, mutationOptions = {}) => {
    const {
      onSuccess,
      onError,
      successMessage,
      showToast = false,
    } = {
      ...options,
      ...mutationOptions,
    };

    try {
      setLoading(true);
      setError("");

      const response = await apiCall();
      const result = await handleApiResponse(response);

      if (onSuccess) {
        onSuccess(result);
      }

      if (successMessage) {
        if (showToast && window.toast) {
          window.toast.success(successMessage);
        } else {
          console.log(successMessage);
        }
      }

      return result;
    } catch (err) {
      const errorMessage = err.message || "Terjadi kesalahan";
      setError(errorMessage);

      if (showToast && window.toast) {
        window.toast.error(errorMessage);
      }

      if (onError) {
        onError(err);
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
};
