"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, ClipboardList, Check, X, ArrowRight } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "react-toastify";

export default function QuotationsPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQuotations = async () => {
    try {
      const res = await api.get("/quotations");
      setQuotations(res.data);
    } catch (error) {
      console.error("Failed to fetch quotations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  const filteredQuotations = quotations.filter(q => {
    const matchesTab = activeTab === "all" || q.status.toLowerCase() === activeTab;
    const matchesSearch = !search || 
      (q.qtNumber || "").toLowerCase().includes(search.toLowerCase()) ||
      (q.rfqTitle || "").toLowerCase().includes(search.toLowerCase()) ||
      (q.vendorName || "").toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusStyle = (status) => {
    switch(status) {
      case "Submitted": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Selected": return "bg-green-100 text-green-700 border-green-200";
      case "Rejected": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quotations</h1>
          <p className="text-sm text-slate-500 mt-1">Review, compare, and select vendor quotations.</p>
        </div>
        <Link 
          href="/quotations/compare"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <ClipboardList size={18} />
          Compare Quotes
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-4 pt-2">
          {["all", "submitted", "selected", "rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                activeTab === tab 
                  ? "border-indigo-600 text-indigo-600" 
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
              placeholder="Search quotations..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* List View */}
        <div className="p-4 space-y-4">
          {loading ? (
            <div className="text-center py-8 text-slate-500">Loading quotations...</div>
          ) : filteredQuotations.length === 0 ? (
            <div className="text-center py-8 text-slate-500">No quotations found.</div>
          ) : (
            filteredQuotations.map((quote) => (
              <div key={quote.id} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all bg-white group">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-semibold text-indigo-600">{quote.qtNumber || quote.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(quote.status)}`}>
                      {quote.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{quote.rfqTitle}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">Vendor: <span className="font-medium text-slate-700">{quote.vendorName || quote.vendor}</span></span>
                    <span className="hidden sm:inline">•</span>
                    <span>Submitted on {quote.created_at ? new Date(quote.created_at).toLocaleDateString() : "N/A"}</span>
                  </div>
                </div>

                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-4 lg:gap-2">
                  <div className="text-xl font-bold text-slate-900">₹{(quote.grandTotal || quote.amount || 0).toLocaleString()}</div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/quotations/${quote.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                    >
                      View <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
