"use client";

import React, { useState, useEffect } from "react";
import { Activity, Bell, FileText, CheckCircle2, UserPlus, FileSpreadsheet, Search, Loader2 } from "lucide-react";
import api from "@/lib/axios";

const TYPE_CONFIG = {
  rfq: { icon: FileText, color: "text-blue-600", bg: "bg-blue-100" },
  approval: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100" },
  invoice: { icon: FileSpreadsheet, color: "text-indigo-600", bg: "bg-indigo-100" },
  vendor: { icon: UserPlus, color: "text-purple-600", bg: "bg-purple-100" },
  quotation: { icon: Bell, color: "text-amber-600", bg: "bg-amber-100" },
};

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
}

export default function ActivityLogsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const results = await Promise.allSettled([
          api.get("/rfq"),
          api.get("/quotations"),
          api.get("/approvals"),
          api.get("/invoices"),
        ]);

        const items = [];

        // Process RFQs
        if (results[0].status === "fulfilled") {
          const rfqs = results[0].value.data;
          (Array.isArray(rfqs) ? rfqs : []).forEach((rfq) => {
            items.push({
              id: `rfq-${rfq.id || rfq._id}`,
              type: "rfq",
              title: `RFQ ${rfq.rfqNumber || rfq.id || ""}`,
              desc: `${rfq.title || "RFQ"} — Status: ${rfq.status || "N/A"}`,
              timestamp: rfq.created_at || rfq.createdAt || rfq.deadline || "",
            });
          });
        }

        // Process Quotations
        if (results[1].status === "fulfilled") {
          const quotations = results[1].value.data;
          (Array.isArray(quotations) ? quotations : []).forEach((q) => {
            items.push({
              id: `quotation-${q.id || q._id}`,
              type: "quotation",
              title: `Quotation from ${q.vendorName || q.vendor || "Vendor"}`,
              desc: `Amount: ₹${q.totalAmount || q.amount || "N/A"} — Status: ${q.status || "N/A"}`,
              timestamp: q.created_at || q.createdAt || q.submittedAt || "",
            });
          });
        }

        // Process Approvals
        if (results[2].status === "fulfilled") {
          const approvals = results[2].value.data;
          (Array.isArray(approvals) ? approvals : []).forEach((a) => {
            items.push({
              id: `approval-${a.id || a._id}`,
              type: "approval",
              title: `Approval ${a.status || "Request"}`,
              desc: `${a.rfqTitle || "Approval"} — Vendor: ${a.vendorName || "N/A"}, Total: ₹${a.grandTotal || "N/A"}`,
              timestamp: a.created_at || a.createdAt || a.updated_at || "",
            });
          });
        }

        // Process Invoices
        if (results[3].status === "fulfilled") {
          const invoices = results[3].value.data;
          (Array.isArray(invoices) ? invoices : []).forEach((inv) => {
            items.push({
              id: `invoice-${inv.id || inv._id}`,
              type: "invoice",
              title: `Invoice ${inv.invoiceNumber || inv.id || ""}`,
              desc: `Amount: ₹${inv.amount || inv.totalAmount || "N/A"} — Status: ${inv.status || "N/A"}`,
              timestamp: inv.created_at || inv.createdAt || inv.dueDate || "",
            });
          });
        }

        // Sort by timestamp descending
        items.sort((a, b) => {
          const da = a.timestamp ? new Date(a.timestamp) : new Date(0);
          const db = b.timestamp ? new Date(b.timestamp) : new Date(0);
          return db - da;
        });

        setActivities(items);
      } catch (error) {
        console.error("Failed to fetch activity data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const filteredActivities = activities.filter((a) => {
    const matchesTab = activeTab === "all" || a.type === activeTab;
    const matchesSearch =
      !searchTerm ||
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.desc.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Activity Logs & Notifications</h1>
          <p className="text-sm text-slate-500 mt-1">Track system events, alerts, and complete audit trails.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-4 pt-2 overflow-x-auto">
          {["all", "rfq", "approval", "invoice", "quotation"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium capitalize border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab 
                  ? "border-blue-600 text-blue-600" 
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              {tab === "all" ? "All Activity" : `${tab} Events`}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search logs..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Timeline */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-slate-500">
              <Loader2 className="animate-spin mr-2" size={20} />
              Loading activity...
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Activity className="mx-auto text-slate-300 mb-3" size={48} />
              <p>No activity found.</p>
            </div>
          ) : (
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              {filteredActivities.map((activity) => {
                const config = TYPE_CONFIG[activity.type] || TYPE_CONFIG.rfq;
                const Icon = config.icon;
                return (
                  <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    {/* Icon */}
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white ${config.bg} ${config.color} shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10`}>
                      <Icon size={18} />
                    </div>
                    {/* Card */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-slate-900 text-sm">{activity.title}</h3>
                        <time className="text-xs font-medium text-slate-500">{timeAgo(activity.timestamp)}</time>
                      </div>
                      <p className="text-slate-600 text-sm">{activity.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
