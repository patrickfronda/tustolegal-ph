"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, CheckCircle, Loader2, AlertCircle } from "lucide-react";

const SPECIALTIES = [
  "Family Law", "Labor Law", "Criminal Law", "Property Law",
  "Civil Law", "Constitutional Law", "OFW Rights", "Consumer Protection",
  "Corporate Law", "Barangay Justice",
];

export default function LawyerApplyPage() {
  const [form, setForm] = useState({
    name: "", rollNumber: "", location: "", experience: "",
    fee: "", phone: "", email: "", bio: "",
  });
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function toggle(spec: string) {
    setSpecialties((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
  }

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (specialties.length === 0) { setError("Please select at least one specialty."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/lawyers/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, specialties }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Submission failed. Please try again."); return; }
      setSuccess(true);
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-xl font-extrabold text-[#0e1f44] mb-2">Application Submitted!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Your listing has been submitted for review. Our admin team will approve it within 1–2 business days.
          </p>
          <Link
            href="/lawyers"
            className="inline-block bg-[#0e1f44] text-white font-bold px-6 py-2.5 rounded-full text-sm hover:bg-[#1e3a7b] transition-colors"
          >
            Back to Lawyer Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#0e1f44] text-white px-4 py-3 flex items-center gap-3 shadow-lg">
        <Link href="/lawyers" className="p-1.5 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-1 text-blue-300 hover:text-white text-sm">
          <ChevronLeft className="w-4 h-4" /> Find a Lawyer
        </Link>
        <div className="flex-1 text-center">
          <span className="font-bold text-base">List Your <span className="text-[#fcd116]">Services</span></span>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h1 className="text-lg font-extrabold text-[#0e1f44] mb-1">Lawyer Application</h1>
          <p className="text-xs text-gray-500 mb-5">Fill in your details to be listed in our verified lawyer directory.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Full Name (with Atty. title) *</label>
              <input required type="text" placeholder="Atty. Juan Dela Cruz" value={form.name} onChange={(e) => set("name", e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a7b]/30" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">IBP Roll Number *</label>
              <input required type="text" placeholder="e.g. 123456" value={form.rollNumber} onChange={(e) => set("rollNumber", e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a7b]/30" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Areas of Practice *</label>
              <div className="flex flex-wrap gap-2">
                {SPECIALTIES.map((spec) => (
                  <button key={spec} type="button" onClick={() => toggle(spec)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border ${specialties.includes(spec) ? "bg-[#0e1f44] text-white border-[#0e1f44]" : "bg-white text-gray-600 border-gray-200 hover:border-[#0e1f44]"}`}>{spec}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">City / Location *</label>
              <input required type="text" placeholder="e.g. Makati City" value={form.location} onChange={(e) => set("location", e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a7b]/30" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Years of Experience *</label>
                <input required type="number" min="0" placeholder="e.g. 8" value={form.experience} onChange={(e) => set("experience", e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a7b]/30" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Consultation Fee *</label>
                <input required type="text" placeholder="e.g. ₱3,000 / hr" value={form.fee} onChange={(e) => set("fee", e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a7b]/30" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number *</label>
                <input required type="tel" placeholder="+63 9XX XXX XXXX" value={form.phone} onChange={(e) => set("phone", e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a7b]/30" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                <input required type="email" placeholder="atty@example.ph" value={form.email} onChange={(e) => set("email", e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a7b]/30" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Short Bio / Description *</label>
              <textarea required rows={4} placeholder="Describe your background, expertise, and what kind of clients you serve..." value={form.bio} onChange={(e) => set("bio", e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a7b]/30 resize-none" />
            </div>
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-3 py-2 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
              </div>
            )}
            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-[#0e1f44] text-white font-bold py-3 rounded-xl text-sm hover:bg-[#1e3a7b] transition-colors disabled:opacity-60">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? "Submitting..." : "Submit Application"}
            </button>
            <p className="text-center text-xs text-gray-400">Your application will be reviewed by our admin team before going live.</p>
          </form>
        </div>
      </div>
    </div>
  );
}
