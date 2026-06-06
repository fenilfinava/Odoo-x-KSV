"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, Mail, Phone, User, Star, Hash, Tag, ShieldCheck } from "lucide-react";
import api from "@/lib/axios";

const statusStyles = {
  Active: "bg-green-100 text-green-700",
  Pending: "bg-amber-100 text-amber-700",
  Blocked: "bg-red-100 text-red-700",
};

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-slate-100 last:border-b-0">
      <div className="p-2 bg-slate-50 rounded-lg">
        <Icon size={18} className="text-slate-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium text-slate-900 mt-0.5 break-words">
          {value || <span className="text-slate-300 italic">Not provided</span>}
        </p>
      </div>
    </div>
  );
}

function RatingStars({ rating }) {
  const stars = Math.round(rating || 0);
  return (
    <div className="flex items-center gap-1 mt-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={16}
          className={i <= stars ? "text-amber-400 fill-amber-400" : "text-slate-200"}
        />
      ))}
      <span className="text-sm text-slate-500 ml-1">{rating ?? "N/A"}</span>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-slate-200 rounded-lg" />
        <div className="space-y-2">
          <div className="h-6 w-48 bg-slate-200 rounded" />
          <div className="h-4 w-32 bg-slate-100 rounded" />
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <div className="space-y-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-100 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-20 bg-slate-100 rounded" />
                <div className="h-4 w-40 bg-slate-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function VendorDetailPage({ params }) {
  const { id } = use(params);
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const res = await api.get(`/vendors/${id}`);
        setVendor(res.data);
      } catch (error) {
        console.error("Failed to fetch vendor:", error);
        if (error.response?.status === 404) {
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchVendor();
  }, [id]);

  if (loading) return <LoadingSkeleton />;

  if (notFound || !vendor) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Link
            href="/vendors"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Vendor Not Found</h1>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <Building2 size={48} className="text-slate-200 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-slate-700">Vendor not found</h2>
          <p className="text-sm text-slate-500 mt-1 mb-6">
            The vendor you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/vendors"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Vendors
          </Link>
        </div>
      </div>
    );
  }

  const statusClass = statusStyles[vendor.status] || "bg-slate-100 text-slate-700";

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/vendors"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{vendor.name}</h1>
            <p className="text-sm text-slate-500 mt-1">Vendor details and contact information.</p>
          </div>
        </div>
        <span
          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${statusClass}`}
        >
          {vendor.status}
        </span>
      </div>

      {/* Details Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
            <DetailRow icon={Building2} label="Company Name" value={vendor.name} />
            <DetailRow icon={Tag} label="Category" value={vendor.category} />
            <DetailRow icon={Hash} label="GST Number" value={vendor.gstNo || vendor.gst} />
            <DetailRow icon={ShieldCheck} label="Status" value={vendor.status} />
          </div>
        </div>

        <div className="px-8 pb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
            <DetailRow icon={User} label="Contact Person" value={vendor.contactPerson} />
            <DetailRow icon={Mail} label="Email" value={vendor.email} />
            <DetailRow icon={Phone} label="Phone" value={vendor.phone || vendor.contact} />
          </div>
        </div>

        {/* Rating Section */}
        <div className="px-8 pb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">
            Performance
          </h3>
          <div className="flex items-start gap-4 py-4">
            <div className="p-2 bg-slate-50 rounded-lg">
              <Star size={18} className="text-slate-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Rating</p>
              <RatingStars rating={vendor.rating} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
