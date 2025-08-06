import React, { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../../components/Elements/Input";
import Button from "../../components/Elements/Button";

function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Login gagal");
        return;
      }
      // Simpan token dan user ke localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/"; // redirect ke home
    } catch (err) {
      alert("Terjadi kesalahan jaringan");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <Input
        type="text"
        name="email"
        placeholder="Email or Phone Number"
        value={form.email}
        onChange={handleChange}
      />
      <Input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />
      <div className="flex items-center justify-between mt-2">
        <Button type="submit">Log In</Button>
        <Link
          to="/register"
          className="text-[#cd0c0d] text-sm ml-4 hover:underline"
        >
          Belum punya akun? Daftar Sekarang
        </Link>
      </div>
    </form>
  );
}

export default LoginForm;
