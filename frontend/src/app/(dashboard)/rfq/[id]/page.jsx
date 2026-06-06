"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Tag, Package, Building } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "react-toastify";

export default function RFQDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [rfq, setRfq] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRFQ = async () => {
      try {
        const res = await api.get(`/rfq/${params.id}`);
        setRfq(res.data);
      } catch (error) {
        console.error("Failed to fetch RFQ details:", error);
        toast.error("Failed to load RFQ details");
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchRFQ();
  }, [params.id]);

  if (loading) {
    return <div className="text-center py-12 text-slate-500">Loading RFQ details...</div>;
  }

  if (!rfq) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-slate-800">RFQ Not Found</h2>
        <button onClick={() => router.push("/rfq")} className="mt-4 text-blue-600 hover:underline">
          Go back to RFQ list
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.push("/rfq")}
          className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {rfq.rfqNumber || `RFQ-${rfq.id}`} - {rfq.title}
          </h1>
          <p className="text-sm text-slate-500 mt-1">View detailed requirements and items.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Description</h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
              {rfq.description || "No description provided for this RFQ."}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Package size={20} className="text-blue-500" />
                Requested Items
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 font-medium">Item Name</th>
                    <th className="px-6 py-4 font-medium text-right">Quantity</th>
                    <th className="px-6 py-4 font-medium text-right">Unit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rfq.items && rfq.items.length > 0 ? (
                    rfq.items.map((item, index) => (
                      <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                        <td className="px-6 py-4 text-right text-slate-600">{item.quantity}</td>
                        <td className="px-6 py-4 text-right text-slate-600">{item.unit || 'pcs'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-8 text-center text-slate-500">No items specified.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Details</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                  <Tag size={18} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Category</p>
                  <p className="text-sm font-semibold text-slate-900">{rfq.category}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Deadline</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {rfq.deadline ? new Date(rfq.deadline).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                  <Building size={18} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Status</p>
                  <p className="text-sm font-semibold text-slate-900">{rfq.status}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
