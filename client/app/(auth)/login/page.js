"use client";

import { useState, useContext } from "react";
import { loginUser } from "@/services/authService";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Login() {
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(form);
      login(data);
      router.push("/dashboard");
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="h-screen w-screen bg-linear-to-b from-blue-500 to-purple-500 flex  flex-col items-center justify-center text-white">
      <h1 className="text-6xl font-bold text-white">Welcome to task together</h1>
      <p className="text-2xl font-bold text-white">Track your tasks together</p>
      <input
      className="border-2 border-white rounded-full px-4 py-2 text-white"
        type="email"
        placeholder="Email"
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <input
        type="password"
className="border-2 border-white rounded-full px-4 py-2 text-white mt-2.5"
        placeholder="Password"
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      <button type="submit" className="px-5 py-3 rounded-full bg-black text-white mt-2.5">Login</button>
    </form>
  );
}