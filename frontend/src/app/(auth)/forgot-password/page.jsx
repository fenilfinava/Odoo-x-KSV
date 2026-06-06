"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Send } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
        
        <Link href="/login" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mb-8">
          <ArrowLeft size={16} className="mr-2" />
          Back to login
        </Link>

        {submitted ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Send size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h2>
            <p className="text-slate-600 mb-8">
              We've sent a password reset link to <br/><span className="font-medium text-slate-900">{email}</span>
            </p>
            <button 
              onClick={() => setSubmitted(false)}
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Didn't receive the email? Click to resend
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Forgot Password</h2>
              <p className="mt-2 text-slate-500 text-sm">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

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
                    className="block w-full pl-10 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              >
                Send Reset Link
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
