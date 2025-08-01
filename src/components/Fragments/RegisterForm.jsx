import React, { useState } from "react";
import Input from "../../components/Elements/Input";
import Button from "../../components/Elements/Button";

function RegisterForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // handle register logic here
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <Input
        type="text"
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
      />
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
      <Button type="submit" className="w-full mt-2 mb-3">
        Create Account
      </Button>
      <button
        type="button"
        className="w-full flex items-center justify-center border border-gray-300 rounded py-2 text-base font-medium mb-6 hover:bg-gray-50 transition"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
          alt="Google"
          className="w-5 h-5 mr-2"
        />
        Sign up with Google
      </button>
      <div className="flex items-center justify-center text-sm text-gray-600 mt-2">
        Already have account?
        <a href="/login" className="ml-1 text-[#cd0c0d] hover:underline">
          Log in
        </a>
      </div>
    </form>
  );
}

export default RegisterForm;
