"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, CheckCircle, XCircle, Clock, ArrowRight, ShieldCheck } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "react-toastify";

export default function ApprovalsPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Pending");
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApprovals = async () => {
    try {
      const res = await api.get("/approvals");
      setApprovals(res.data);
    } catch (error) {
      console.error("Failed to fetch approvals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.patch(`/approvals/${id}/status`, { status, remarks: "Updated via UI" });
      toast.success(`Approval marked as ${status}`);
      fetchApprovals();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  const filteredApprovals = approvals.filter(a => {
    const matchesTab = activeTab.toLowerCase() === "history" ? a.status !== "Pending" : a.status.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch = !search ||
      (a.rfqTitle || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.vendorName || "").toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Approval Workflow</h1>
        <p className="text-sm text-slate-500 mt-1">Review and manage pending procurement requests.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        
        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-4 pt-2">
          {["pending", "approved", "rejected", "history"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                activeTab.toLowerCase() === tab.toLowerCase() 
                  ? "border-blue-600 text-blue-600" 
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              {tab}
              {tab === "pending" && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-600 text-xs">
                  {approvals.filter(a => a.status === "Pending").length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search approvals..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Approvals List */}
        <div className="p-4 space-y-4">
          {loading ? (
            <div className="text-center py-12 text-slate-500">Loading approvals...</div>
          ) : filteredApprovals.length === 0 ? (
            <div className="text-center py-12">
              <ShieldCheck className="mx-auto text-slate-300 mb-3" size={48} />
              <h3 className="text-lg font-medium text-slate-900">All caught up!</h3>
              <p className="text-slate-500 text-sm mt-1">There are no {activeTab} approvals at the moment.</p>
            </div>
          ) : (
            filteredApprovals.map((approval) => (
              <div key={approval.id} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-xl border border-slate-200 hover:border-blue-300 transition-all bg-white group">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-semibold text-blue-600">APP-{approval.id}</span>
                    <span className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      <Clock size={12} /> {approval.status === 'Pending' ? 'Pending since' : 'Processed on'} {new Date(approval.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{approval.rfqTitle || "Approval Request"}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                    <span>Vendor: <span className="font-medium text-slate-800">{approval.vendorName}</span></span>
                    <span className="hidden sm:inline">•</span>
                    <span>Level: <span className="font-medium text-slate-800">{approval.step}</span></span>
                  </div>
                </div>

                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-4 lg:gap-3">
                  <div className="text-xl font-bold text-slate-900">₹{approval.grandTotal}</div>
                  
                  {approval.status === "Pending" ? (
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleStatusUpdate(approval.id, 'Approved')} className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm">
                        <CheckCircle size={16} /> Approve
                      </button>
                      <button onClick={() => handleStatusUpdate(approval.id, 'Rejected')} className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors">
                        <XCircle size={16} /> Reject
                      </button>
                    </div>
                  ) : (
                    <Link href={`/approvals/${approval.id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                      View Details <ArrowRight size={16} />
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
