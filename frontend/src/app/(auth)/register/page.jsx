"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Phone, Building2, Globe, ArrowRight } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "procurement_officer",
    organization: "",
    country: "India",
    additionalInfo: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/register", formData);
      toast.success("Registration successful! Please login.");
      router.push("/login");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-5/12 bg-slate-900 relative overflow-hidden flex-col justify-center px-16">
        <div className="absolute inset-0 bg-indigo-900/20" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl" />
        <div className="absolute bottom-32 right-32 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 text-white">
          <h1 className="text-4xl font-bold mb-6 tracking-tight">Join VendorBridge.</h1>
          <p className="text-lg text-slate-300 mb-8">
            Create an account to digitize your procurement processes. Connect with vendors, manage RFQs, and automate approvals seamlessly.
          </p>
        </div>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-2xl py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Create an account</h2>
            <p className="mt-2 text-slate-500">Get started with VendorBridge today</p>
          </div>

          <div className="bg-white px-8 py-10 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="block w-full pl-10 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                      placeholder="John"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="block w-full pl-10 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-10 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="block w-full pl-10 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe className="h-5 w-5 text-slate-400" />
                    </div>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="block w-full pl-10 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all outline-none appearance-none"
                    >
                      <option value="procurement_officer">Procurement Officer</option>
                      <option value="approver">Manager / Approver</option>
                      <option value="vendor">Vendor</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Country</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe className="h-5 w-5 text-slate-400" />
                    </div>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="block w-full pl-10 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all outline-none appearance-none"
                    >
                      <option value="India">India</option>
                      <option value="USA">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="Canada">Canada</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Additional Information ....</label>
                <div className="relative">
                  <textarea
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    rows="3"
                    className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all outline-none resize-none"
                    placeholder="Any other details..."
                  ></textarea>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    placeholder="Create a strong password"
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">Must be at least 8 characters, include an uppercase letter and a number.</p>
              </div>

              <div className="flex items-start mt-6">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 mt-1 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded cursor-pointer"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-slate-600 cursor-pointer">
                  I agree to the <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 mt-6 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Create Account"}
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="mt-8 text-center border-t border-slate-100 pt-6">
              <p className="text-sm text-slate-600">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
