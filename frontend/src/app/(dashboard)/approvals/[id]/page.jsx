"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  FileText,
  User,
  Package,
  IndianRupee,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import api from "@/lib/axios";
import { toast } from "react-toastify";

export default function ApprovalDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();

  const [approval, setApproval] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchApproval = async () => {
      try {
        const res = await api.get("/approvals");
        const all = res.data;
        const found = all.find((a) => String(a.id) === String(id));
        if (found) {
          setApproval(found);
        } else {
          setError("Approval not found.");
        }
      } catch (err) {
        console.error("Failed to fetch approval:", err);
        setError("Failed to load approval details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchApproval();
  }, [id]);

  const handleStatusUpdate = async (status) => {
    if (!remarks.trim()) {
      toast.warn("Please add remarks before submitting.");
      return;
    }
    setSubmitting(true);
    try {
      await api.patch(`/approvals/${id}/status`, { status, remarks });
      toast.success(`Approval ${status.toLowerCase()} successfully!`);
      router.push("/approvals");
    } catch (err) {
      console.error("Failed to update approval:", err);
      toast.error("Failed to update approval status.");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
            <CheckCircle2 size={14} /> Approved
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
            <XCircle size={14} /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
            <Clock size={14} /> Pending
          </span>
        );
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Loader2 className="animate-spin text-blue-500" size={32} />
        <p className="text-slate-500 text-sm">Loading approval details...</p>
      </div>
    );
  }

  // Error state
  if (error || !approval) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertTriangle className="text-red-400" size={40} />
        <p className="text-slate-700 font-medium">{error || "Approval not found."}</p>
        <Link
          href="/approvals"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
        >
          <ArrowLeft size={16} /> Back to Approvals
        </Link>
      </div>
    );
  }

  const isPending = approval.status === "Pending";

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/approvals"
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              APP-{approval.id}
            </h1>
            {getStatusBadge(approval.status)}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {approval.rfqTitle || "Approval Request"} &middot; Step: {approval.step || "N/A"}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <User size={18} className="text-blue-600" />
            </div>
            <span className="text-sm font-medium text-slate-500">Vendor</span>
          </div>
          <p className="text-lg font-bold text-slate-900 truncate">
            {approval.vendorName || "N/A"}
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 rounded-lg">
              <IndianRupee size={18} className="text-green-600" />
            </div>
            <span className="text-sm font-medium text-slate-500">Grand Total</span>
          </div>
          <p className="text-lg font-bold text-slate-900">
            ₹{approval.grandTotal?.toLocaleString() || "N/A"}
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-50 rounded-lg">
              <ShieldCheck size={18} className="text-purple-600" />
            </div>
            <span className="text-sm font-medium text-slate-500">Approval Step</span>
          </div>
          <p className="text-lg font-bold text-slate-900">{approval.step || "N/A"}</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Clock size={18} className="text-amber-600" />
            </div>
            <span className="text-sm font-medium text-slate-500">Created</span>
          </div>
          <p className="text-lg font-bold text-slate-900">
            {approval.created_at
              ? new Date(approval.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "N/A"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Action / Status Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Approval Info Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
              Approval Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500">Approval ID</span>
                <p className="font-semibold text-slate-900 mt-0.5">APP-{approval.id}</p>
              </div>
              <div>
                <span className="text-slate-500">Status</span>
                <div className="mt-0.5">{getStatusBadge(approval.status)}</div>
              </div>
              <div>
                <span className="text-slate-500">RFQ Title</span>
                <p className="font-semibold text-slate-900 mt-0.5">
                  {approval.rfqTitle || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-slate-500">Vendor</span>
                <p className="font-semibold text-slate-900 mt-0.5">
                  {approval.vendorName || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-slate-500">Approval Step</span>
                <p className="font-semibold text-slate-900 mt-0.5">{approval.step || "N/A"}</p>
              </div>
              <div>
                <span className="text-slate-500">Grand Total</span>
                <p className="font-semibold text-slate-900 mt-0.5">
                  ₹{approval.grandTotal?.toLocaleString() || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Action / Result Section */}
          {isPending ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                Take Action
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Remarks <span className="text-red-500">*</span>
                </label>
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-1">
                  <textarea
                    rows={4}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Add your comments, conditions, or reasons..."
                    className="w-full bg-transparent border-none outline-none resize-none text-slate-700 placeholder:text-slate-400 p-3 text-sm"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleStatusUpdate("Approved")}
                  disabled={submitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors shadow-sm"
                >
                  {submitting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={18} />
                  )}
                  Approve
                </button>
                <button
                  onClick={() => handleStatusUpdate("Rejected")}
                  disabled={submitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium py-3 rounded-xl transition-colors"
                >
                  {submitting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <XCircle size={18} />
                  )}
                  Reject
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                Decision
              </h3>
              <div className="flex items-start gap-4">
                <div className="mt-0.5">
                  {approval.status === "Approved" ? (
                    <CheckCircle2 className="text-green-500" size={28} />
                  ) : (
                    <XCircle className="text-red-500" size={28} />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-lg">
                    This approval has been{" "}
                    <span
                      className={
                        approval.status === "Approved"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {approval.status}
                    </span>
                  </p>
                  {approval.remarks && (
                    <div className="mt-3 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-700">
                      <span className="font-medium text-slate-500 block mb-1">Remarks:</span>
                      {approval.remarks}
                    </div>
                  )}
                  {approval.updated_at && (
                    <p className="text-xs text-slate-400 mt-3">
                      Processed on{" "}
                      {new Date(approval.updated_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Quotation Summary */}
        <div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
              Quotation Summary
            </h3>
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-0">
              <div className="flex justify-between items-center py-3 border-b border-slate-200 border-dashed">
                <span className="text-sm text-slate-600">Vendor</span>
                <span className="text-sm font-semibold text-slate-900 text-right max-w-[60%] truncate">
                  {approval.vendorName || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-200 border-dashed">
                <span className="text-sm text-slate-600">RFQ</span>
                <span className="text-sm font-semibold text-slate-900 text-right max-w-[60%] truncate">
                  {approval.rfqTitle || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-200 border-dashed">
                <span className="text-sm text-slate-600">Total Amount</span>
                <span className="font-bold text-slate-900 text-lg">
                  ₹{approval.grandTotal?.toLocaleString() || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-200 border-dashed">
                <span className="text-sm text-slate-600">Approval Step</span>
                <span className="text-sm font-medium text-slate-900">
                  {approval.step || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-200 border-dashed">
                <span className="text-sm text-slate-600">Delivery</span>
                <span className="text-sm font-medium text-slate-900">
                  {approval.deliveryDays ? `${approval.deliveryDays} Days` : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-sm text-slate-600">Created</span>
                <span className="text-sm font-medium text-slate-900">
                  {approval.created_at
                    ? new Date(approval.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </span>
              </div>
            </div>

            {approval.quotation_id && (
              <div className="mt-4">
                <Link
                  href={`/quotations/${approval.quotation_id}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors text-sm"
                >
                  <FileText size={18} /> View Full Quotation
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex justify-start">
        <Link
          href="/approvals"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <ArrowLeft size={16} /> Back to Approvals
        </Link>
      </div>
    </div>
  );
}
