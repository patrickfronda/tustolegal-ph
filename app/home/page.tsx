"use client";
import Link from "next/link";
import { ArrowRight, MessageSquare, Search, CheckCircle, Scale, Phone, MapPin, Clock } from "lucide-react";
import { LAWYERS } from "@/app/data/lawyers";
import TornyAvatar from "@/app/components/TornyAvatar";

const STEPS = [
  { icon: MessageSquare, title: "Ask Your Question", desc: "Type your legal concern in English or Filipino — Torny AI understands both." },
  { icon: Search, title: "AI Analyzes PH Law", desc: "Torny checks the relevant Philippine laws, codes, and jurisprudence in seconds." },
  { icon: CheckCircle, title: "Get Clear Guidance", desc: "Receive step-by-step guidance with specific law citations and next steps." },
];

export default function HomePage() {
  const previewLawyers = LAWYERS.slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="bg-[#0e1f44] text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/home" className="flex items-center gap-2 font-bold text-lg">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-[#fcd116] flex-shrink-0">
              <TornyAvatar />
            </div>
            Torny <span className="text-[#fcd116]">AI</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/home" className="text-[#fcd116]">Home</Link>
            <Link href="/" className="text-blue-200 hover:text-white transition-colors">Chat</Link>
            <Link href="/lawyers" className="text-blue-200 hover:text-white transition-colors">Find a Lawyer</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="bg-[#fcd116] text-[#0e1f44] px-4 py-2 rounded-full text-sm font-bold hover:bg-yellow-300 transition-colors">
              Chat with Torny
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0e1f44] via-[#1e3a7b] to-[#162d60] text-white overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0038a8] via-[#fcd116] to-[#ce1126]" />
        <div className="max-w-6xl mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm text-blue-200 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#fcd116] animate-pulse" />
              Free AI Legal Guidance · Philippine Law
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
              Your Rights,<br /><span className="text-[#fcd116]">Explained Simply</span>
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed mb-8 max-w-lg">
              Torny AI gives you instant, accurate legal guidance based on Philippine law — covering family, labor, criminal, property, and more. Free, confidential, 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/" className="flex items-center justify-center gap-2 bg-[#fcd116] text-[#0e1f44] px-6 py-3.5 rounded-full font-bold text-base hover:bg-yellow-300 transition shadow-lg">
                Ask Torny AI Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/lawyers" className="flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-6 py-3.5 rounded-full font-semibold text-base hover:bg-white/20 transition">
                Find a Lawyer
              </Link>
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-48 h-48 rounded-full overflow-hidden bg-[#fcd116] shadow-2xl border-4 border-[#fcd116]/30">
                <TornyAvatar />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                Online 24/7
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-extrabold text-[#0e1f44] text-center mb-2">How Torny AI Works</h2>
          <p className="text-gray-500 text-center mb-10">Get legal guidance in 3 simple steps</p>
          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="w-12 h-12 rounded-full bg-[#0e1f44] flex items-center justify-center mx-auto mb-4">
                  <s.icon className="w-6 h-6 text-[#fcd116]" />
                </div>
                <div className="w-6 h-6 rounded-full bg-[#fcd116] text-[#0e1f44] text-xs font-bold flex items-center justify-center mx-auto mb-3">
                  {i + 1}
                </div>
                <h3 className="font-bold text-[#0e1f44] mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lawyers preview */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-[#0e1f44] mb-1">Find a Verified Lawyer</h2>
              <p className="text-gray-500 text-sm">Connect with IBP-accredited lawyers across the Philippines</p>
            </div>
            <Link href="/lawyers" className="text-[#1e3a7b] font-semibold text-sm hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {previewLawyers.map((l) => (
              <div key={l.id} className="border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-11 h-11 rounded-full ${l.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                    {l.initials}
                  </div>
                  <div>
                    <p className="font-bold text-[#0e1f44] text-sm">{l.name}</p>
                    <p className="text-gray-400 text-xs flex items-center gap-1"><MapPin className="w-3 h-3" />{l.location}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {l.specialty.slice(0, 2).map((s) => (
                    <span key={s} className="bg-[#0e1f44]/5 text-[#0e1f44] text-xs px-2 py-0.5 rounded-full font-medium">{s}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{l.experience} yrs exp</span>
                  <span className="font-semibold text-[#1e3a7b]">{l.fee}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA for lawyers */}
      <section className="py-16 bg-[#0e1f44] text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <Scale className="w-12 h-12 text-[#fcd116] mx-auto mb-4" />
          <h2 className="text-2xl font-extrabold mb-3">Are You a Lawyer?</h2>
          <p className="text-blue-200 mb-6">List your legal services and reach thousands of Filipinos who need legal help. Join our growing directory of IBP-accredited lawyers.</p>
          <Link href="/lawyers/apply" className="inline-flex items-center gap-2 bg-[#fcd116] text-[#0e1f44] px-6 py-3.5 rounded-full font-bold hover:bg-yellow-300 transition">
            List Your Services <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#070f23] text-blue-300 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-white">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-[#fcd116]">
              <TornyAvatar />
            </div>
            Torny AI
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <Phone className="w-4 h-4 text-[#fcd116]" />
            PAO Hotline: <span className="text-[#fcd116] font-bold">8524-2100</span>
          </div>
          <p className="text-xs text-blue-400">&copy; {new Date().getFullYear()} TustoLegal PH. For informational purposes only.</p>
        </div>
      </footer>
    </div>
  );
}
