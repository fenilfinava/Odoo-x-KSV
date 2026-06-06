"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Filter, FileText, Clock, CheckCircle2, XCircle } from "lucide-react";
import api from "@/lib/axios";

export default function RFQPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        setUserRole(userData.role || "");
      } catch {}
    }
    const fetchRFQs = async () => {
      try {
        const res = await api.get("/rfq");
        setRfqs(res.data);
      } catch (error) {
        console.error("Failed to fetch RFQs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRFQs();
  }, []);

  const filteredRfqs = rfqs.filter(r => {
    if (activeTab === "all") return true;
    return r.status.toLowerCase() === activeTab.toLowerCase();
  });

  const getStatusColor = (status) => {
    switch(status) {
      case "Sent": return "bg-blue-100 text-blue-700";
      case "In Progress": return "bg-amber-100 text-amber-700";
      case "Closed": return "bg-slate-100 text-slate-700";
      case "Draft": return "bg-slate-100 text-slate-600 border border-slate-200";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Request for Quotation (RFQ)</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your procurement requests and vendor quotes.</p>
        </div>
        {["procurement_officer"].includes(userRole) && (
          <Link 
            href="/rfq/create" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            Create RFQ
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><FileText size={20} /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total RFQs</p>
            <p className="text-xl font-bold text-slate-900">{rfqs.length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center"><Clock size={20} /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">In Progress</p>
            <p className="text-xl font-bold text-slate-900">{rfqs.filter(r => r.status === 'In Progress' || r.status === 'Sent').length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center"><CheckCircle2 size={20} /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Closed</p>
            <p className="text-xl font-bold text-slate-900">{rfqs.filter(r => r.status === 'Closed').length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-600 flex items-center justify-center"><XCircle size={20} /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Drafts</p>
            <p className="text-xl font-bold text-slate-900">{rfqs.filter(r => r.status === 'Draft').length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-4 pt-2">
          {["all", "sent", "in progress", "closed", "draft"].map((tab) => (
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
              placeholder="Search RFQs..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors w-full sm:w-auto justify-center">
            <Filter size={18} />
            Filters
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50">
              <tr>
                <th className="px-6 py-4 font-medium">RFQ Number & Title</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Deadline</th>
                <th className="px-6 py-4 font-medium text-center">Quotes Received</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">Loading RFQs...</td>
                </tr>
              ) : filteredRfqs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">No RFQs found.</td>
                </tr>
              ) : (
                filteredRfqs.map((rfq) => (
                  <tr key={rfq.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-blue-600 cursor-pointer hover:underline">{rfq.rfqNumber || rfq.id}</span>
                        <span className="text-slate-700">{rfq.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{rfq.category}</td>
                    <td className="px-6 py-4 text-slate-600">{rfq.deadline}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-medium text-xs">
                        {rfq.quotesCount || rfq.quotes || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(rfq.status)}`}>
                        {rfq.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/rfq/${rfq.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline">
                        View Details
                      </Link>
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
