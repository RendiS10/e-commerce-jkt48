import { useState } from "react";
import { useMutation } from "./useFetch.js";

/**
 * Custom hook for form handling with validation and submission
 */
export const useForm = (initialValues, validationRules = {}) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const { mutate, loading, error } = useMutation();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle input blur
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validate field on blur
    validateField(name, formData[name]);
  };

  // Validate individual field
  const validateField = (name, value) => {
    const rule = validationRules[name];
    if (!rule) return "";

    let error = "";

    if (rule.required && (!value || value.toString().trim() === "")) {
      error = rule.message || `${name} is required`;
    } else if (rule.minLength && value.length < rule.minLength) {
      error =
        rule.message || `${name} must be at least ${rule.minLength} characters`;
    } else if (rule.maxLength && value.length > rule.maxLength) {
      error =
        rule.message ||
        `${name} must be no more than ${rule.maxLength} characters`;
    } else if (rule.pattern && !rule.pattern.test(value)) {
      error = rule.message || `${name} format is invalid`;
    } else if (rule.custom && !rule.custom(value)) {
      error = rule.message || `${name} is invalid`;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    return error;
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (apiCall, options = {}) => {
    const { onSuccess, onError, successMessage, resetForm = true } = options;

    if (!validateForm()) {
      return;
    }

    try {
      const result = await mutate(() => apiCall(formData), {
        onSuccess: (data) => {
          if (resetForm) {
            setFormData(initialValues);
            setErrors({});
            setTouched({});
          }
          if (onSuccess) onSuccess(data);
        },
        onError,
        successMessage,
      });
      return result;
    } catch (err) {
      console.error("Form submission error:", err);
      throw err;
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData(initialValues);
    setErrors({});
    setTouched({});
  };

  // Set form data (for editing)
  const setData = (data) => {
    setFormData(data);
  };

  return {
    formData,
    errors,
    touched,
    loading,
    error,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setData,
    validateForm,
  };
};
