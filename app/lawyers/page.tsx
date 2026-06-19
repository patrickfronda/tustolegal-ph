"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Clock, Phone, Search, Plus, ChevronLeft, BadgeCheck } from "lucide-react";
import { LAWYERS } from "@/app/data/lawyers";

const ALL_SPECIALTIES = [
  "All", "Family Law", "Labor Law", "Criminal Law", "Property Law",
  "Civil Law", "Constitutional Law", "OFW Rights", "Consumer Protection",
  "Corporate Law", "Barangay Justice",
] as const;

type FilterSpec = typeof ALL_SPECIALTIES[number];

interface DynamicLawyer {
  id: string;
  name: string;
  rollNumber: string;
  specialties: string[];
  location: string;
  experience: number;
  fee: string;
  phone: string;
  email: string;
  bio: string;
  status: string;
  submittedAt: string;
}

export default function LawyersPage() {
  const [dynamicLawyers, setDynamicLawyers] = useState<DynamicLawyer[]>([]);
  const [filter, setFilter] = useState<FilterSpec>("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/lawyers")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setDynamicLawyers(data); })
      .catch(() => {});
  }, []);

  const staticFiltered = LAWYERS.filter((l) => {
    const matchSpec = filter === "All" || l.specialty.includes(filter as never);
    const matchSearch = !search ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.location.toLowerCase().includes(search.toLowerCase());
    return matchSpec && matchSearch;
  });

  const dynamicFiltered = dynamicLawyers.filter((l) => {
    const matchSpec = filter === "All" || l.specialties.includes(filter);
    const matchSearch = !search ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.location.toLowerCase().includes(search.toLowerCase());
    return matchSpec && matchSearch;
  });

  const COLORS = ["bg-pink-500","bg-blue-500","bg-red-500","bg-green-500","bg-orange-500","bg-purple-500","bg-teal-500","bg-indigo-500"];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#0e1f44] text-white px-4 py-3 flex items-center gap-3 shadow-lg">
        <Link href="/home" className="p-1.5 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-1 text-blue-300 hover:text-white text-sm">
          <ChevronLeft className="w-4 h-4" /> Home
        </Link>
        <div className="flex-1 text-center">
          <span className="font-bold text-base">Find a <span className="text-[#fcd116]">Lawyer</span></span>
        </div>
        <Link
          href="/lawyers/apply"
          className="flex items-center gap-1.5 bg-[#fcd116] text-[#0e1f44] font-bold px-3 py-1.5 rounded-full text-xs hover:bg-yellow-300 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> List Services
        </Link>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a7b]/30 bg-white"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {ALL_SPECIALTIES.map((spec) => (
            <button
              key={spec}
              onClick={() => setFilter(spec)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                filter === spec
                  ? "bg-[#0e1f44] text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-[#0e1f44] hover:text-[#0e1f44]"
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        {dynamicFiltered.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#1e3a7b] mb-3 flex items-center gap-2">
              <BadgeCheck className="w-4 h-4" /> Reviewed Listings
            </h2>
            <div className="grid gap-4">
              {dynamicFiltered.map((l, i) => (
                <div key={l.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-4">
                  <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm ${COLORS[i % COLORS.length]}`}>
                    {l.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-[#0e1f44] text-sm">{l.name}</p>
                        <p className="text-xs text-gray-500">IBP Roll #{l.rollNumber}</p>
                      </div>
                      <span className="flex-shrink-0 text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-semibold">Reviewed</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {l.specialties.map((s) => (
                        <span key={s} className="text-xs bg-[#1e3a7b]/10 text-[#1e3a7b] px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{l.location}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{l.experience} yrs exp.</span>
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{l.phone}</span>
                      <span className="font-semibold text-[#0e1f44]">{l.fee}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed line-clamp-2">{l.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          {dynamicFiltered.length > 0 && (
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">General Lawyer Directory</h2>
          )}
          {staticFiltered.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No lawyers found for your search.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {staticFiltered.map((l) => (
                <div key={l.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-4">
                  <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm ${l.color}`}>
                    {l.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#0e1f44] text-sm">{l.name}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {l.specialty.map((s) => (
                        <span key={s} className="text-xs bg-[#1e3a7b]/10 text-[#1e3a7b] px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{l.location}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{l.experience} yrs exp.</span>
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{l.phone}</span>
                      <span className="font-semibold text-[#0e1f44]">{l.fee}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed line-clamp-2">{l.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#0e1f44] rounded-2xl p-6 text-center text-white">
          <p className="font-bold text-lg mb-1">Are you a lawyer?</p>
          <p className="text-blue-300 text-sm mb-4">Nationwide exposure, per region. Free listing, no commissions.</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              href="/lawyers/invite"
              className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-white/20 transition-colors"
            >
              Why list with us?
            </Link>
            <Link
              href="/lawyers/apply"
              className="inline-flex items-center justify-center gap-2 bg-[#fcd116] text-[#0e1f44] font-bold px-6 py-2.5 rounded-full text-sm hover:bg-yellow-300 transition-colors"
            >
              <Plus className="w-4 h-4" /> Apply to List Your Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
