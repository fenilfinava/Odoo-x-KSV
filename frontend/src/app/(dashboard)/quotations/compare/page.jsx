"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";

export default function CompareQuotationsPage() {
  const vendors = [
    {
      id: "V1",
      name: "Infra Supplies (Lowest)",
      total: "₹ 1,85,400",
      gst: "18%",
      delivery: "10 days",
      rating: "4.5 / 5",
      paymentTerms: "30 days",
      isLowest: true,
    },
    {
      id: "V2",
      name: "TechCore LTD",
      total: "₹ 2,00,010",
      gst: "18%",
      delivery: "14 days",
      rating: "4.2 / 5",
      paymentTerms: "30 days",
      isLowest: false,
    },
    {
      id: "V3",
      name: "Office Need Co.",
      total: "₹ 2,14,800",
      gst: "18%",
      delivery: "7 days",
      rating: "3.8 / 5",
      paymentTerms: "15 days",
      isLowest: false,
    }
  ];

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
          <p className="text-sm text-slate-500 mt-1">RFQ: Office Furniture Procurement Q2 - 3 quotations received</p>
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
                      <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm w-full justify-center">
                        <ShieldCheck size={18} /> Select & Approve
                      </button>
                    ) : (
                      <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors w-full justify-center">
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
