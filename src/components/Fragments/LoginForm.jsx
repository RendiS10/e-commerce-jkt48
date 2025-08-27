import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Input from "../atoms/Input";
import Button from "../../components/Elements/Button";

function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        "https://e-commerce-jkt48-prototype-production.up.railway.app/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const data = await res.json();

      if (!res.ok) {
        // Tentukan pesan error yang lebih user-friendly
        let errorMessage = "Email atau password yang Anda masukkan salah";

        if (data.message) {
          // Mapping pesan error dari backend ke pesan yang lebih user-friendly
          if (
            data.message.toLowerCase().includes("invalid credentials") ||
            data.message.toLowerCase().includes("invalid") ||
            data.message.toLowerCase().includes("wrong") ||
            data.message.toLowerCase().includes("incorrect")
          ) {
            errorMessage = "Email atau password yang Anda masukkan salah";
          } else if (
            data.message.toLowerCase().includes("not found") ||
            data.message.toLowerCase().includes("user") ||
            data.message.toLowerCase().includes("email")
          ) {
            errorMessage =
              "Email tidak ditemukan. Pastikan email yang Anda masukkan benar";
          } else if (data.message.toLowerCase().includes("password")) {
            errorMessage = "Password yang Anda masukkan salah";
          } else {
            errorMessage = data.message;
          }
        }

        // SweetAlert untuk error login
        Swal.fire({
          icon: "error",
          title: "Login Gagal!",
          text: errorMessage,
          confirmButtonText: "Coba Lagi",
          confirmButtonColor: "#cd0c0d",
        });
        setLoading(false);
        return;
      }

      // Simpan token dan user ke localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // SweetAlert untuk login berhasil
      Swal.fire({
        icon: "success",
        title: "Login Berhasil!",
        text: `Selamat datang, ${data.user.full_name || data.user.email}!`,
        confirmButtonText: "Lanjutkan",
        confirmButtonColor: "#cd0c0d",
        timer: 2000,
        timerProgressBar: true,
      }).then(() => {
        navigate("/"); // redirect ke home
      });
    } catch (err) {
      // SweetAlert untuk error jaringan
      Swal.fire({
        icon: "error",
        title: "Terjadi Kesalahan!",
        text: "Tidak dapat terhubung ke server. Silakan coba lagi.",
        confirmButtonText: "OK",
        confirmButtonColor: "#cd0c0d",
      });
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <Input
        type="text"
        name="email"
        placeholder="Email"
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
        <Button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </Button>
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
