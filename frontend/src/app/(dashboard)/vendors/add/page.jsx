"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Upload } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "react-toastify";

export default function AddVendorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    gstNo: "",
    email: "",
    contactPerson: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.gstNo || !formData.email) {
      toast.error("Please fill all required fields");
      return;
    }
    setLoading(true);
    try {
      await api.post("/vendors", formData);
      toast.success("Vendor created successfully!");
      router.push("/vendors");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create vendor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link 
          href="/vendors"
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Add New Vendor</h1>
          <p className="text-sm text-slate-500 mt-1">Register a new vendor in the system.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Company Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Enter company name" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category *</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none" required>
                  <option value="">Select category</option>
                  <option value="IT Hardware">IT Hardware</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Stationery">Stationery</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Services">Services</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">GST Identification Number (GSTIN) *</label>
                <input type="text" name="gstNo" value={formData.gstNo} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all uppercase" placeholder="e.g. 27AAPFU0939F1ZV" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Company Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="contact@company.com" required />
              </div>
            </div>
          </div>

          {/* Contact Person */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">Contact Person</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="+91 98765 43210" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-100">
            <Link 
              href="/vendors"
              className="px-6 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </Link>
            <button 
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {loading ? "Saving..." : "Save Vendor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
