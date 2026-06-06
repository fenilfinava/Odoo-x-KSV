"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Users, FileText } from "lucide-react";
import api from "@/lib/axios";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    activeRFQs: 0,
    pendingApprovals: 0,
    totalPOMonth: 0,
    overdueInvoices: 0
  });
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [roleKey, setRoleKey] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await api.get('/reports/dashboard-stats');
        setStats(statsRes.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };
    fetchDashboardData();

    if (typeof window !== "undefined") {
      try {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        setUserName(`${userData.firstName || ""} ${userData.lastName || ""}`.trim());
        const roleMap = {
          admin: "Admin",
          procurement_officer: "Procurement Officer",
          approver: "Manager / Approver",
          vendor: "Vendor",
        };
        setUserRole(roleMap[userData.role] || userData.role || "User");
        setRoleKey(userData.role || "");
      } catch {}
    }
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Welcome back, {userName || "User"} — {userRole}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 text-center flex flex-col justify-center">
          <p className="text-3xl font-bold text-blue-600">{stats.activeRFQs}</p>
          <h3 className="text-slate-600 text-sm mt-1">Active RFQ's</h3>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 text-center flex flex-col justify-center">
          <p className="text-3xl font-bold text-amber-600">{stats.pendingApprovals}</p>
          <h3 className="text-slate-600 text-sm mt-1">Pending Approvals</h3>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 text-center flex flex-col justify-center">
          <p className="text-3xl font-bold text-green-600">₹{stats.totalPOMonth > 0 ? (stats.totalPOMonth / 100000).toFixed(1) + 'L' : '0'}</p>
          <h3 className="text-slate-600 text-sm mt-1">PO's This Month</h3>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 text-center flex flex-col justify-center">
          <p className="text-3xl font-bold text-red-600">{stats.overdueInvoices}</p>
          <h3 className="text-slate-600 text-sm mt-1">Overdue Invoices</h3>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["procurement_officer"].includes(roleKey) && (
          <Link href="/rfq/create" className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
              <FileText className="text-blue-600" size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Create New RFQ</h3>
            <p className="text-sm text-slate-500">Request quotations from vendors for your procurement needs.</p>
          </Link>
        )}

        {["admin"].includes(roleKey) && (
          <Link href="/vendors/add" className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-green-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
              <Users className="text-green-600" size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Add New Vendor</h3>
            <p className="text-sm text-slate-500">Register and manage your vendor partnerships.</p>
          </Link>
        )}

        {["procurement_officer", "vendor"].includes(roleKey) && (
          <Link href="/invoices" className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-100 transition-colors">
              <Plus className="text-amber-600" size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">View Invoices</h3>
            <p className="text-sm text-slate-500">Track payments and manage invoice statuses.</p>
          </Link>
        )}
      </div>
    </div>
  );
}
