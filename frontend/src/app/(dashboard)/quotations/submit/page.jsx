"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, Save } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "react-toastify";

export default function SubmitQuotationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [rfqs, setRfqs] = useState([]);
  const [selectedRfq, setSelectedRfq] = useState("");
  const [items, setItems] = useState([
    { id: 1, name: "", quantity: 1, unitPrice: 0 }
  ]);
  const [gstPercent, setGstPercent] = useState(18);
  const [deliveryDays, setDeliveryDays] = useState(7);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetchRfqs = async () => {
      try {
        const res = await api.get("/rfq");
        setRfqs(res.data);
      } catch (error) {
        console.error("Failed to fetch RFQs:", error);
      }
    };
    fetchRfqs();
  }, []);

  const handleRfqSelect = (rfqId) => {
    setSelectedRfq(rfqId);
    const rfq = rfqs.find(r => r.id === Number(rfqId));
    if (rfq && rfq.items && rfq.items.length > 0) {
      setItems(rfq.items.map((item, i) => ({
        id: i + 1,
        name: item.name,
        quantity: item.quantity,
        unitPrice: 0
      })));
    }
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: field === 'name' ? value : Number(value) } : i));
  };

  const addItem = () => {
    setItems([...items, { id: Date.now(), name: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const gstAmount = Math.round((subtotal * gstPercent) / 100);
  const grandTotal = subtotal + gstAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRfq) {
      toast.error("Please select an RFQ");
      return;
    }
    if (items.some(item => !item.name || item.unitPrice <= 0)) {
      toast.error("Please fill all item names and prices");
      return;
    }
    setLoading(true);
    try {
      await api.post("/quotations", {
        rfqId: Number(selectedRfq),
        items: items.map(({ name, quantity, unitPrice }) => ({
          name,
          quantity,
          unitPrice,
          totalPrice: quantity * unitPrice,
        })),
        subtotal,
        gstPercent,
        gstAmount,
        grandTotal,
        deliveryDays,
        notes,
      });
      toast.success("Quotation submitted successfully!");
      router.push("/quotations");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to submit quotation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link 
          href="/quotations"
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Submit Quotation</h1>
          <p className="text-sm text-slate-500 mt-1">Fill in pricing details to submit your quotation for an RFQ.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">

          {/* Select RFQ */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">Select RFQ</h3>
            <select 
              value={selectedRfq} 
              onChange={(e) => handleRfqSelect(e.target.value)} 
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none" 
              required
            >
              <option value="">Select an RFQ to quote</option>
              {rfqs.map(rfq => (
                <option key={rfq.id} value={rfq.id}>{rfq.rfqNumber} — {rfq.title}</option>
              ))}
            </select>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">Line Items</h3>
              <button type="button" onClick={addItem} className="text-sm text-blue-600 hover:text-blue-800 font-medium">+ Add Item</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-y border-slate-200">
                    <th className="px-4 py-3 font-semibold text-slate-700">Item Name</th>
                    <th className="px-4 py-3 font-semibold text-slate-700 w-24 text-center">Qty</th>
                    <th className="px-4 py-3 font-semibold text-slate-700 w-32">Unit Price (₹)</th>
                    <th className="px-4 py-3 font-semibold text-slate-700 w-32">Total</th>
                    <th className="px-4 py-3 font-semibold text-slate-700 w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100">
                      <td className="px-4 py-3">
                        <input 
                          type="text" 
                          value={item.name} 
                          onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          placeholder="Item name"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input 
                          type="number" 
                          value={item.quantity} 
                          onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm text-center"
                          min="1"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input 
                          type="number" 
                          value={item.unitPrice} 
                          onChange={(e) => updateItem(item.id, 'unitPrice', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          min="0"
                          placeholder="0"
                        />
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        ₹{(item.quantity * item.unitPrice).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        {items.length > 1 && (
                          <button type="button" onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* GST, Delivery, Notes + Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">GST %</label>
                  <input 
                    type="number" 
                    value={gstPercent}
                    onChange={(e) => setGstPercent(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Delivery (days)</label>
                  <input 
                    type="number" 
                    value={deliveryDays}
                    onChange={(e) => setDeliveryDays(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Notes / Terms</label>
                <textarea 
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Payment terms, conditions, delivery notes..."
                ></textarea>
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 space-y-4">
              <div className="flex justify-between items-center text-slate-700">
                <span>Subtotal</span>
                <span className="font-medium">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-slate-700">
                <span>GST ({gstPercent}%)</span>
                <span className="font-medium">₹{gstAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-slate-900 pt-4 border-t border-slate-200 border-dashed">
                <span className="font-bold text-lg">Grand Total</span>
                <span className="font-bold text-xl text-blue-600">₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-100">
            <Link 
              href="/quotations"
              className="px-6 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </Link>
            <button 
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Send size={18} />
              {loading ? "Submitting..." : "Submit Quotation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
