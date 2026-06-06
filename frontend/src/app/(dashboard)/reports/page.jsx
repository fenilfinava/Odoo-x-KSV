"use client";

import React, { useState, useEffect } from "react";
import { Download, TrendingUp, TrendingDown, Users, Package } from "lucide-react";
import { toast } from "react-toastify";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import api from "@/lib/axios";

export default function ReportsPage() {

  const [stats, setStats] = useState({
    activeRFQs: 0,
    pendingApprovals: 0,
    totalPOMonth: 0,
    overdueInvoices: 0
  });
  const [vendors, setVendors] = useState([]);
  const [rfqs, setRfqs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, vendorsRes, rfqsRes] = await Promise.all([
          api.get("/reports/dashboard-stats"),
          api.get("/vendors"),
          api.get("/rfq"),
        ]);
        setStats(statsRes.data);
        setVendors(vendorsRes.data);
        setRfqs(rfqsRes.data);
      } catch (error) {
        console.error("Failed to fetch report data:", error);
      }
    };
    fetchData();
  }, []);

  // Build category spend data from vendors
  const categoryMap = {};
  vendors.forEach(v => {
    categoryMap[v.category] = (categoryMap[v.category] || 0) + 1;
  });
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  // Build RFQ status data
  const statusMap = {};
  rfqs.forEach(r => {
    statusMap[r.status] = (statusMap[r.status] || 0) + 1;
  });
  const rfqStatusData = Object.entries(statusMap).map(([name, value]) => ({ name, value }));

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reports & Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">Procurement overview and vendor analytics.</p>
        </div>
        <button 
          onClick={() => toast.success('Report exported')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download size={18} />
          Export PDF
        </button>
      </div>

      {/* KPI Cards — Real data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-slate-500 text-sm font-medium">Active RFQs</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">{stats.activeRFQs}</p>
          <div className="mt-2 flex items-center text-sm font-medium text-blue-600">
            <TrendingUp size={16} className="mr-1" /> Open requests
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-slate-500 text-sm font-medium">Pending Approvals</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">{stats.pendingApprovals}</p>
          <div className="mt-2 flex items-center text-sm font-medium text-amber-600">
            <TrendingUp size={16} className="mr-1" /> Awaiting action
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-slate-500 text-sm font-medium">Total Vendors</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">{vendors.length}</p>
          <div className="mt-2 flex items-center text-sm font-medium text-green-600">
            <Users size={16} className="mr-1" /> {vendors.filter(v => v.status === 'Active').length} Active
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-slate-500 text-sm font-medium">Overdue Invoices</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">{stats.overdueInvoices}</p>
          <div className="mt-2 flex items-center text-sm font-medium text-red-600">
            <TrendingDown size={16} className="mr-1" /> Need attention
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RFQ Status Distribution */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">RFQ Status Distribution</h3>
          <div className="h-72">
            {rfqStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rfqStatusData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} name="Count" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">No RFQ data yet</div>
            )}
          </div>
        </div>

        {/* Vendor by Category */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Vendors by Category</h3>
          <div className="h-72 flex items-center justify-center">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-slate-400">No vendor data yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
