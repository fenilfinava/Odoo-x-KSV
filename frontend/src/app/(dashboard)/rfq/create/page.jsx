"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, Trash2, Send, Paperclip } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "react-toastify";

export default function CreateRFQPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    deadline: "",
    description: "",
  });
  const [items, setItems] = useState([
    { id: 1, name: "", quantity: 1, unit: "pcs" }
  ]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await api.get("/vendors");
        setVendors(res.data);
      } catch (error) {
        console.error("Failed to fetch vendors:", error);
      }
    };
    fetchVendors();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addItem = () => {
    setItems([...items, { id: Date.now(), name: "", quantity: 1, unit: "pcs" }]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const toggleVendor = (vendorId) => {
    setSelectedVendors(prev => 
      prev.includes(vendorId) 
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.deadline) {
      toast.error("Please fill all required fields");
      return;
    }
    if (items.some(item => !item.name)) {
      toast.error("Please fill all item names");
      return;
    }
    setLoading(true);
    try {
      await api.post("/rfq", {
        ...formData,
        items: items.map(({ name, quantity, unit }) => ({ name, quantity: Number(quantity), unit })),
      });
      toast.success("RFQ created and sent successfully!");
      router.push("/rfq");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create RFQ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link 
          href="/rfq"
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create New RFQ</h1>
          <p className="text-sm text-slate-500 mt-1">Fill in the details below to request a quotation from vendors.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* Step 1: RFQ Details */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">Step 1: RFQ Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">RFQ Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. IT Hardware Supplies Q3" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category *</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none" required>
                  <option value="">Select category</option>
                  <option value="IT Hardware">IT Hardware</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Stationery">Stationery</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Services">Services</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Deadline Date *</label>
                <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Description / Notes</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Add any special instructions..."></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Attachments</label>
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Paperclip className="w-8 h-8 mb-3 text-slate-400" />
                      <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-slate-500">PDF, DOCX, XLSX (MAX. 10MB)</p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" multiple />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Line Items */}
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">Step 2: Line Items</h3>
              <button 
                type="button" 
                onClick={addItem}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Plus size={16} /> Add Item
              </button>
            </div>
            
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="w-full sm:flex-1">
                    <input type="text" value={item.name} onChange={(e) => handleItemChange(item.id, 'name', e.target.value)} placeholder="Item Name / Description" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                  </div>
                  <div className="w-full sm:w-32">
                    <input type="number" min="1" value={item.quantity} onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)} placeholder="Qty" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                  </div>
                  <div className="w-full sm:w-32">
                    <select value={item.unit} onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none">
                      <option value="pcs">Pcs</option>
                      <option value="kg">Kg</option>
                      <option value="meters">Meters</option>
                      <option value="liters">Liters</option>
                      <option value="boxes">Boxes</option>
                    </select>
                  </div>
                  <div className="w-full sm:w-auto flex justify-end">
                    <button 
                      type="button" 
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      disabled={items.length === 1}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 3: Vendor Selection */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">Step 3: Select Vendors</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <p className="text-sm text-slate-600 mb-4">Select the vendors you want to invite to this RFQ.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {vendors.length === 0 ? (
                  <p className="text-sm text-slate-500 col-span-2">No vendors available. Add a vendor first.</p>
                ) : (
                  vendors.filter(v => v.status === 'Active').map((vendor) => (
                    <label key={vendor.id} className={`flex items-center gap-3 p-3 bg-white border rounded-lg cursor-pointer hover:border-blue-300 transition-colors ${selectedVendors.includes(vendor.id) ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}>
                      <input 
                        type="checkbox" 
                        checked={selectedVendors.includes(vendor.id)}
                        onChange={() => toggleVendor(vendor.id)}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" 
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-900">{vendor.name}</p>
                        <p className="text-xs text-slate-500">{vendor.category}</p>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
            <div></div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Link 
                href="/rfq"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </Link>
              <button 
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Send size={18} />
                {loading ? "Sending..." : "Send RFQ"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
