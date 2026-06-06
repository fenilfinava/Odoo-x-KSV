"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, Download, Package, Clock, User } from "lucide-react";
import api from "@/lib/axios";

export default function QuotationDetailPage() {
  const params = useParams();
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        const res = await api.get(`/quotations/${params.id}`);
        setQuotation(res.data);
      } catch (error) {
        console.error("Failed to fetch quotation:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuotation();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading quotation details...</div>
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Quotation not found.</div>
      </div>
    );
  }

  const getStatusStyle = (status) => {
    switch(status) {
      case "Submitted": return "bg-blue-100 text-blue-700";
      case "Selected": return "bg-green-100 text-green-700";
      case "Rejected": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link 
          href="/quotations"
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{quotation.qtNumber}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(quotation.status)}`}>
              {quotation.status}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">{quotation.rfqTitle || "Quotation Details"}</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg"><User size={18} className="text-blue-600" /></div>
            <span className="text-sm font-medium text-slate-500">Vendor</span>
          </div>
          <p className="text-lg font-bold text-slate-900">{quotation.vendorName || "N/A"}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 rounded-lg"><Package size={18} className="text-green-600" /></div>
            <span className="text-sm font-medium text-slate-500">Delivery</span>
          </div>
          <p className="text-lg font-bold text-slate-900">{quotation.deliveryDays} Days</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-50 rounded-lg"><Clock size={18} className="text-amber-600" /></div>
            <span className="text-sm font-medium text-slate-500">Submitted</span>
          </div>
          <p className="text-lg font-bold text-slate-900">
            {quotation.created_at ? new Date(quotation.created_at).toLocaleDateString() : "N/A"}
          </p>
        </div>
      </div>

      {/* Line Items */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">Line Items</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-100 bg-slate-50">
                <th className="px-6 py-3 font-medium">#</th>
                <th className="px-6 py-3 font-medium">Item</th>
                <th className="px-6 py-3 font-medium">Qty</th>
                <th className="px-6 py-3 font-medium">Unit Price</th>
                <th className="px-6 py-3 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {(quotation.items || []).map((item, index) => (
                <tr key={item.id || index} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-6 py-4 text-slate-500">{index + 1}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                  <td className="px-6 py-4">{item.quantity}</td>
                  <td className="px-6 py-4">₹{item.unitPrice?.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right font-medium">₹{item.totalPrice?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Price Summary */}
        <div className="px-6 py-5 bg-slate-50 border-t border-slate-100">
          <div className="flex flex-col items-end space-y-2">
            <div className="flex justify-between w-64 text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-medium text-slate-900">₹{quotation.subtotal?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between w-64 text-sm">
              <span className="text-slate-500">GST ({quotation.gstPercent}%)</span>
              <span className="font-medium text-slate-900">₹{quotation.gstAmount?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between w-64 text-base border-t border-slate-200 pt-2 mt-1">
              <span className="font-bold text-slate-900">Grand Total</span>
              <span className="font-bold text-blue-600 text-lg">₹{quotation.grandTotal?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {quotation.notes && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Notes</h3>
          <p className="text-sm text-slate-600">{quotation.notes}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Link
          href="/quotations"
          className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
        >
          Back to Quotations
        </Link>
      </div>
    </div>
  );
}
