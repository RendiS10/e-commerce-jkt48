import React, { useState } from "react";
import Input from "../../components/Elements/Input";
import Button from "../../components/Elements/Button";

function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // handle login logic here
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
        <a href="#" className="text-[#cd0c0d] text-sm ml-4 hover:underline">
          Forget Password?
        </a>
      </div>
    </form>
  );
}

export default LoginForm;
