"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, MoreVertical, Edit2, Eye, Trash2, Star, Ban, CheckCircle } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "react-toastify";

export default function VendorsPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        setUserRole(userData.role || "");
      } catch {}
    }
  }, []);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await api.get("/vendors");
        setVendors(res.data);
      } catch (error) {
        console.error("Failed to fetch vendors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  const filteredVendors = vendors.filter(v => {
    const matchesTab = activeTab === "all" || v.status.toLowerCase() === activeTab;
    const matchesSearch = !search ||
      (v.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (v.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (v.category || "").toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleBlockVendor = async (id) => {
    if (!confirm("Are you sure you want to block this vendor?")) return;
    try {
      await api.patch(`/vendors/${id}/status`, { status: "Blocked" });
      setVendors(vendors.map(v => v.id === id ? { ...v, status: "Blocked" } : v));
      toast.success("Vendor has been blocked successfully.");
    } catch (error) {
      console.error("Failed to block vendor:", error);
      toast.error("Failed to block vendor.");
    }
  };

  const handleApproveVendor = async (id) => {
    try {
      await api.patch(`/vendors/${id}/status`, { status: "Active" });
      setVendors(vendors.map(v => v.id === id ? { ...v, status: "Active" } : v));
      toast.success("Vendor has been approved and is now active.");
    } catch (error) {
      console.error("Failed to approve vendor:", error);
      toast.error("Failed to approve vendor.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Vendors</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your vendor relationships and performance.</p>
        </div>
        {userRole !== 'vendor' && (
          <Link 
            href="/vendors/add" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            Add Vendor
          </Link>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-4 pt-2">
          {["all", "active", "pending", "blocked"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                activeTab === tab 
                  ? "border-blue-600 text-blue-600" 
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search vendors..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50">
              <tr>
                <th className="px-6 py-4 font-medium">Vendor</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">GST no.</th>
                <th className="px-6 py-4 font-medium">contact no.</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">Loading vendors...</td>
                </tr>
              ) : filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">No vendors found.</td>
                </tr>
              ) : (
                filteredVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">{vendor.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{vendor.category}</td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-xs">{vendor.gstNo || vendor.gst}</td>
                    <td className="px-6 py-4 text-slate-600">{vendor.phone || vendor.contact}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        vendor.status === 'Active' ? 'bg-green-100 text-green-700' : 
                        vendor.status === 'Blocked' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {vendor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/vendors/${vendor.id}`} className="px-4 py-1.5 border border-slate-300 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors">
                          View
                        </Link>
                        {userRole === 'admin' && vendor.status !== 'Blocked' && (
                          <button 
                            onClick={() => handleBlockVendor(vendor.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                            title="Block Vendor"
                          >
                            <Ban size={16} />
                          </button>
                        )}
                        {userRole === 'admin' && vendor.status !== 'Active' && (
                          <button 
                            onClick={() => handleApproveVendor(vendor.id)}
                            className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" 
                            title="Approve / Activate Vendor"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
