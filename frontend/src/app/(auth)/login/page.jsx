"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "react-toastify";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-center px-16">
        <div className="absolute inset-0 bg-blue-900/20" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl" />
        <div className="absolute bottom-32 right-32 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 text-white max-w-xl">
          <h1 className="text-5xl font-bold mb-6 tracking-tight">VendorBridge.</h1>
          <p className="text-xl text-slate-300 mb-12">
            The next-generation Procurement & Vendor Management ERP. Streamline your RFQs, quotations, and approvals in one unified platform.
          </p>
          
          <div className="space-y-4">
            {[
              "Centralized Vendor Management",
              "Automated RFQ Workflows",
              "Multi-level Approval Process",
              "Real-time Procurement Analytics"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="text-blue-400" size={24} />
                <span className="text-lg">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back</h2>
            <p className="mt-2 text-slate-500">Sign in to your account to continue</p>
          </div>

          <div className="bg-white px-8 py-10 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700">Password</label>
                  <Link href="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 cursor-pointer">
                  Remember me for 30 days
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign In"}
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-600">
                Don't have an account?{" "}
                <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
