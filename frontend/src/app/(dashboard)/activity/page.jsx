"use client";

import React, { useState } from "react";
import { Activity, Bell, FileText, CheckCircle2, UserPlus, FileSpreadsheet, Search, Filter } from "lucide-react";

export default function ActivityLogsPage() {
  const [activeTab, setActiveTab] = useState("all");
  
  // Mock activity data to fulfill Problem Statement Requirements
  const activities = [
    { id: 1, type: "approval", title: "Approval Granted", desc: "Purchase Order PO-2026-005 was approved by Finance Manager.", time: "10 mins ago", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100" },
    { id: 2, type: "rfq", title: "New RFQ Created", desc: "RFQ-2026-012 for Office Supplies was created and sent to 4 vendors.", time: "2 hours ago", icon: FileText, color: "text-blue-600", bg: "bg-blue-100" },
    { id: 3, type: "invoice", title: "Invoice Paid", desc: "Invoice INV-0992 from TechCore Ltd has been marked as Paid.", time: "5 hours ago", icon: FileSpreadsheet, color: "text-indigo-600", bg: "bg-indigo-100" },
    { id: 4, type: "vendor", title: "New Vendor Registered", desc: "Global Logistics Corp completed registration.", time: "1 day ago", icon: UserPlus, color: "text-purple-600", bg: "bg-purple-100" },
    { id: 5, type: "rfq", title: "Quotation Received", desc: "FastLag submitted a quotation for RFQ-2026-010.", time: "1 day ago", icon: Bell, color: "text-amber-600", bg: "bg-amber-100" },
    { id: 6, type: "approval", title: "Approval Pending", desc: "PO-2026-006 is waiting for Level 2 Approval.", time: "2 days ago", icon: Activity, color: "text-slate-600", bg: "bg-slate-100" },
  ];

  const filteredActivities = activities.filter(a => activeTab === "all" || a.type === activeTab);

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
          {["all", "rfq", "approval", "invoice", "vendor"].map((tab) => (
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
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search logs..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors w-full sm:w-auto justify-center">
            <Filter size={18} />
            Filter
          </button>
        </div>

        {/* Timeline */}
        <div className="p-6">
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {filteredActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  {/* Icon */}
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white ${activity.bg} ${activity.color} shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10`}>
                    <Icon size={18} />
                  </div>
                  {/* Card */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-slate-900 text-sm">{activity.title}</h3>
                      <time className="text-xs font-medium text-slate-500">{activity.time}</time>
                    </div>
                    <p className="text-slate-600 text-sm">{activity.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
