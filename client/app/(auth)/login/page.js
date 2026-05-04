"use client";

import { useState, useContext } from "react";
import { loginUser } from "@/services/authService";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Login() {
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginUser(form);
      login(data);
      router.push("/dashboard");
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 selection:bg-primary/30 relative overflow-hidden font-sans">
      {/* Background Shapes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/70 backdrop-blur-xl p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/50">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-500">Sign in to your TaskTogether account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                className="w-full bg-white/50 border border-gray-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-800 placeholder-gray-400"
                type="email"
                placeholder="Email Address"
                required
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>

            <div>
              <input
                type="password"
                required
                className="w-full bg-white/50 border border-gray-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-800 placeholder-gray-400"
                placeholder="Password"
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:scale-105 hover:opacity-90 text-white font-semibold rounded-3xl py-4 transition-all duration-300 shadow-md hover:shadow-primary/30 disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary font-semibold hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}