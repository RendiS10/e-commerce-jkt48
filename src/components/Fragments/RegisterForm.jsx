import React, { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../atoms/Input";
import Button from "../../components/Elements/Button";

function RegisterForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.name,
          email: form.email,
          password: form.password,
          role: "customer",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Register failed");
      setSuccess("Register success! Please login.");
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <Input
        type="text"
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <Input
        type="text"
        name="email"
        placeholder="Email or Phone Number"
        value={form.email}
        onChange={handleChange}
        required
      />
      <Input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      />
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
