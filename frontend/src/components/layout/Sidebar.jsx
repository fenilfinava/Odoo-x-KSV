"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  ClipboardList, 
  CheckSquare, 
  FileSpreadsheet, 
  BarChart2, 
  LogOut,
  Menu,
  X,
  Shield,
  Activity
} from "lucide-react";

// Role-based navigation config
const allNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["admin", "procurement_officer", "approver", "vendor"] },
  { name: "Vendors", href: "/vendors", icon: Users, roles: ["admin", "procurement_officer"] },
  { name: "RFQs", href: "/rfq", icon: FileText, roles: ["admin", "procurement_officer", "vendor"] },
  { name: "Quotations", href: "/quotations", icon: ClipboardList, roles: ["admin", "procurement_officer", "vendor"] },
  { name: "Approvals", href: "/approvals", icon: CheckSquare, roles: ["admin", "approver"] },
  { name: "POs & Invoices", href: "/invoices", icon: FileSpreadsheet, roles: ["admin", "procurement_officer", "vendor"] },
  { name: "Activity Logs", href: "/activity", icon: Activity, roles: ["admin", "procurement_officer", "approver", "vendor"] },
  { name: "Reports", href: "/reports", icon: BarChart2, roles: ["admin", "approver"] },
];

const roleLabels = {
  admin: "Admin",
  procurement_officer: "Procurement Officer",
  approver: "Manager / Approver",
  vendor: "Vendor",
};

export default function Sidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userRole, setUserRole] = useState("procurement_officer");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        setUserRole(userData.role || "procurement_officer");
        setUserName(`${userData.firstName || ""} ${userData.lastName || ""}`.trim());
      } catch {
        setUserRole("procurement_officer");
      }
    }
  }, []);

  const navigation = allNavItems.filter(item => item.roles.includes(userRole));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            VendorBridge
          </span>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-500 hover:text-slate-700">
            <X size={20} />
          </button>
        </div>

        {/* User info & role badge */}
        <div className="px-4 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              {userName ? userName.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{userName || "User"}</p>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700">
                <Shield size={10} />
                {roleLabels[userRole] || userRole}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col h-[calc(100vh-8.5rem)] justify-between overflow-y-auto">
          <nav className="px-4 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    isActive 
                      ? "bg-blue-50 text-blue-700" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon size={20} className={isActive ? "text-blue-700" : "text-slate-400"} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-200">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
