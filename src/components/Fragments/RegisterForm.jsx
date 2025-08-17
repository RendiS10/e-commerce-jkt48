import React from "react";
import { Link } from "react-router-dom";
import Input from "../atoms/Input";
import Button from "../../components/Elements/Button";
import { useForm } from "../../hooks/useForm.js";
import { api, API_ENDPOINTS } from "../../utils/api.js";

function RegisterForm() {
  const validationRules = {
    name: {
      required: true,
      minLength: 2,
      message: "Name must be at least 2 characters",
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email",
    },
    password: {
      required: true,
      minLength: 6,
      message: "Password must be at least 6 characters",
    },
  };

  const {
    formData,
    errors,
    loading,
    error,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm({ name: "", email: "", password: "" }, validationRules);

  const onSubmit = (e) => {
    e.preventDefault();

    handleSubmit(
      async (data) => {
        return await api.post(API_ENDPOINTS.AUTH_REGISTER || "/auth/register", {
          full_name: data.name,
          email: data.email,
          password: data.password,
          role: "customer",
        });
      },
      {
        successMessage: "Register success! Please login.",
        onSuccess: () => {
          console.log("Registration successful");
        },
      }
    );
  };

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm">
      <Input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        onBlur={handleBlur}
        required
      />
      {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}

      <Input
        type="text"
        name="email"
        placeholder="Email or Phone Number"
        value={formData.email}
        onChange={handleChange}
        onBlur={handleBlur}
        required
      />
      {errors.email && (
        <div className="text-red-500 text-sm">{errors.email}</div>
      )}

      <Input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        onBlur={handleBlur}
        required
      />
      {errors.password && (
        <div className="text-red-500 text-sm">{errors.password}</div>
      )}
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      {success && <div className="text-green-600 text-sm mb-2">{success}</div>}
      <Button type="submit" className="w-full mt-2 mb-3" disabled={loading}>
        {loading ? "Registering..." : "Create Account"}
      </Button>

      <div className="flex items-center justify-center text-sm text-gray-600 mt-2">
        Already have account?
        <Link to="/login" className="ml-1 text-[#cd0c0d] hover:underline">
          Log in
        </Link>
      </div>
    </form>
  );
}

export default RegisterForm;
