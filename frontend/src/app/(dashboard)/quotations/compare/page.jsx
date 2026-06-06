"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function CompareQuotationsPage() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const res = await api.get("/quotations");
        const quotes = res.data;
        if (quotes.length === 0) {
          setVendors([]);
          return;
        }

        const minTotal = Math.min(...quotes.map(q => q.grandTotal));

        const formattedVendors = quotes.map(q => ({
          id: q.id,
          name: q.vendorName || `Vendor ${q.vendorId}`,
          total: `₹ ${q.grandTotal.toLocaleString()}`,
          gst: `${q.gstPercent}%`,
          delivery: `${q.deliveryDays} days`,
          rating: "N/A",
          paymentTerms: "30 days",
          isLowest: q.grandTotal === minTotal,
          rfqTitle: q.rfqTitle
        }));

        setVendors(formattedVendors);
      } catch (error) {
        console.error("Failed to fetch quotations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuotations();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading comparison...</div>;
  }

  if (vendors.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl shadow-sm border border-slate-100 mt-6">
        <AlertCircle size={48} className="mx-auto text-amber-500 mb-4" />
        <h2 className="text-xl font-semibold text-slate-800">No Quotations Found</h2>
        <p className="text-slate-500 mt-2">There are no submitted quotations to compare yet.</p>
        <Link href="/quotations" className="inline-block mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Go Back</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/quotations"
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quotation Comparison</h1>
          <p className="text-sm text-slate-500 mt-1">{vendors.length} quotations received</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto p-6">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr>
                <th className="p-4 border border-slate-200 bg-slate-50 font-semibold text-slate-700 w-1/4 rounded-tl-xl">Criteria</th>
                {vendors.map((v, i) => (
                  <th key={v.id} className={`p-4 border border-slate-200 font-bold text-center ${v.isLowest ? 'bg-green-50 text-green-700 border-green-200 border-x-2 border-t-2' : 'bg-slate-50 text-slate-700'} ${i === vendors.length - 1 ? 'rounded-tr-xl' : ''}`}>
                    {v.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 border border-slate-200 font-medium text-slate-700">Grand Total</td>
                {vendors.map(v => (
                  <td key={v.id} className={`p-4 border border-slate-200 text-center font-bold text-lg ${v.isLowest ? 'text-green-700 bg-green-50/30 border-x-2 border-green-200' : 'text-slate-900'}`}>{v.total}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border border-slate-200 font-medium text-slate-700">GST %</td>
                {vendors.map(v => (
                  <td key={v.id} className={`p-4 border border-slate-200 text-center text-slate-600 ${v.isLowest ? 'bg-green-50/30 border-x-2 border-green-200' : ''}`}>{v.gst}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border border-slate-200 font-medium text-slate-700">Delivery (days)</td>
                {vendors.map(v => (
                  <td key={v.id} className={`p-4 border border-slate-200 text-center text-slate-600 ${v.isLowest ? 'bg-green-50/30 border-x-2 border-green-200' : ''}`}>{v.delivery}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border border-slate-200 font-medium text-slate-700">Vendor rating</td>
                {vendors.map(v => (
                  <td key={v.id} className={`p-4 border border-slate-200 text-center text-slate-600 ${v.isLowest ? 'bg-green-50/30 border-x-2 border-green-200' : ''}`}>{v.rating}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border border-slate-200 font-medium text-slate-700">Payment terms</td>
                {vendors.map(v => (
                  <td key={v.id} className={`p-4 border border-slate-200 text-center text-slate-600 ${v.isLowest ? 'bg-green-50/30 border-x-2 border-green-200' : ''}`}>{v.paymentTerms}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border border-slate-200 font-medium text-slate-700 rounded-bl-xl bg-slate-50">Action</td>
                {vendors.map((v, i) => (
                  <td key={v.id} className={`p-4 border border-slate-200 text-center ${v.isLowest ? 'bg-green-50/30 border-x-2 border-b-2 border-green-200 rounded-b-lg' : ''} ${i === vendors.length - 1 ? 'rounded-br-xl' : ''}`}>
                    {v.isLowest ? (
                      <button 
                        onClick={() => {
                          toast.success("Vendor selected! Initiating approval workflow...");
                          setTimeout(() => router.push("/approvals"), 1500);
                        }}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm w-full justify-center"
                      >
                        <ShieldCheck size={18} /> Select & Approve
                      </button>
                    ) : (
                      <button 
                        onClick={() => {
                          toast.success("Vendor selected! Initiating approval workflow...");
                          setTimeout(() => router.push("/approvals"), 1500);
                        }}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors w-full justify-center"
                      >
                        Select
                      </button>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          <p className="mt-4 text-sm text-green-700 font-medium flex items-center gap-2">
            <CheckCircle2 size={16} /> Green is lowest price, selecting vendor initiates the approval workflow.
          </p>
        </div>
      </div>
    </div>
  );
}
