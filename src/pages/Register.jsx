import Header from "../components/Layouts/Header";
import React from "react";
import RegisterForm from "../components/Fragments/RegisterForm";
import Footer from "../components/Layouts/Footer";
import Navbar from "../components/Layouts/Navbar";

function Register() {
  return (
    <>
      <Header />
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex w-full max-w-5xl bg-white rounded-lg shadow-none">
          {/* Left Side - Image */}
          <div className="hidden md:flex flex-1 items-center justify-center p-8">
            <img
              src="https://img.freepik.com/free-photo/shopping-cart-with-smartphone-bags-blue-background-3d-rendering_56104-1547.jpg?w=900&t=st=1690000000~exp=1690000600~hmac=example"
              alt="Shopping Cart"
              className="w-full max-w-md rounded-lg object-cover"
            />
          </div>
          {/* Right Side - Form */}
          <div className="flex-1 flex flex-col justify-center px-8 py-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-[#222]">
              Create an account
            </h2>
            <p className="text-sm text-[#222] mb-8">Enter your details below</p>
            <RegisterForm />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
export default Register;
