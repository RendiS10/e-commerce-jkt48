import Header from "../../components/Layouts/Header";
import React from "react";
import RegisterForm from "../../components/Fragments/RegisterForm";
import Footer from "../../components/Layouts/Footer";
import Navbar from "../../components/Layouts/Navbar";

function Register() {
  return (
    <div className="h-screen flex flex-col">
      {/* Header and Navbar */}
      <div className="flex-shrink-0">
        <Header />
        <Navbar />
      </div>

      {/* Main Content - Full Height */}
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="flex w-full max-w-5xl bg-white rounded-lg shadow-none gap-4">
          {/* Left Side - Image */}
          <div className="hidden md:flex flex-1 items-center justify-end">
            <img
              src="https://jkt48.com/images/logo.svg"
              alt="JKT48 Logo"
              className="w-[300px] h-[300px] max-w-md object-contain"
              style={{ width: "300px", height: "300px" }}
            />
          </div>
          {/* Right Side - Form */}
          <div className="flex-1 flex flex-col justify-center px-4 py-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-[#222]">
              Daftar Akun ?
            </h2>
            <p className="text-sm text-[#222] mb-8">Lengkapi Data Anda !</p>
            <RegisterForm />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0">
        <Footer />
      </div>
    </div>
  );
}
export default Register;
