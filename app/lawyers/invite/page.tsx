import Link from "next/link";
import {
  ChevronLeft, Plus, BadgeCheck, MapPin, Search, Wallet,
  Sparkles, Globe2, Languages, Clock, ArrowRight, Phone,
} from "lucide-react";
import { TORNY_SRC, TORNY_STYLE } from "@/app/lib/torny-src";

export const metadata = {
  title: "List Your Services on Torny AI — Invitation for Lawyers",
  description:
    "Filipino lawyers: get nationwide, per-region exposure to clients who need legal help. Free listing, no commissions, no subscription fees. IBP-verified directory by Torny AI.",
};

const BENEFITS = [
  {
    icon: Wallet,
    title: "Zero commissions, ever",
    desc: "We do NOT take a cut of your fees. Whatever you charge your client is 100% yours. We never touch your billing.",
  },
  {
    icon: Sparkles,
    title: "Free listing, no subscription",
    desc: "There's no monthly charge to appear in our directory. Your listing is permanent and managed by our team.",
  },
  {
    icon: Globe2,
    title: "Nationwide reach, per region",
    desc: "Torny AI is a nationwide website. Clients can browse and filter by region — so you get visibility right where your clients are looking.",
  },
  {
    icon: Search,
    title: "Found by motivated clients",
    desc: "People who reach Torny AI are already looking for legal help. They're not just browsing — they need an attorney now.",
  },
  {
    icon: BadgeCheck,
    title: "Manually reviewed listing",
    desc: "Our team reviews every application before it goes live. Clients see a 'Reviewed' badge, so they know your listing has been checked by a real person — not just auto-approved.",
  },
  {
    icon: MapPin,
    title: "You stay in control",
    desc: "Set your own consultation fees, specialties, and location. We list your information as-is — no pressure to discount.",
  },
  {
    icon: Languages,
    title: "Bilingual audience",
    desc: "Our users come in English and Filipino, including OFWs seeking help from abroad. Reach Filipinos in every region.",
  },
  {
    icon: Clock,
    title: "Grow your practice 24/7",
    desc: "Once listed, you get round-the-clock exposure without any effort. Focus on your cases, not your marketing.",
  },
];

const STEPS = [
  { n: 1, title: "Apply online", desc: "Submit your details at torny.online/lawyers/apply — it takes less than 5 minutes." },
  { n: 2, title: "We review your details", desc: "Our team manually reviews your application and IBP roll number, usually within 1–2 business days." },
  { n: 3, title: "Go live", desc: "Your profile appears in our directory — visible to thousands of Filipinos seeking legal help." },
];

export default function LawyerInvitePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-[#0e1f44] text-white px-4 py-3 flex items-center gap-3 shadow-lg sticky top-0 z-50">
        <Link href="/lawyers" className="p-1.5 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-1 text-blue-300 hover:text-white text-sm">
          <ChevronLeft className="w-4 h-4" /> Find a Lawyer
        </Link>
        <div className="flex-1 text-center">
          <span className="font-bold text-base">For <span className="text-[#fcd116]">Lawyers</span></span>
        </div>
        <Link href="/lawyers/apply" className="flex items-center gap-1.5 bg-[#fcd116] text-[#0e1f44] font-bold px-3 py-1.5 rounded-full text-xs hover:bg-yellow-300 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Apply
        </Link>
      </header>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0e1f44] via-[#1e3a7b] to-[#162d60] text-white overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0038a8] via-[#fcd116] to-[#ce1126]" />
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm text-blue-200 mb-6">
            <BadgeCheck className="w-4 h-4 text-[#fcd116]" /> An invitation to Filipino lawyers
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
            Reach More Clients.<br /><span className="text-[#fcd116]">Zero Commissions.</span>
          </h1>
          <p className="text-blue-100 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            Every day, thousands of Filipinos search for legal help online — confused and unsure where to turn. Torny AI helps them understand their rights, and when they need a real lawyer, we connect them to you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/lawyers/apply" className="flex items-center justify-center gap-2 bg-[#fcd116] text-[#0e1f44] px-6 py-3.5 rounded-full font-bold text-base hover:bg-yellow-300 transition shadow-lg">
              List Your Services Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/lawyers" className="flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-6 py-3.5 rounded-full font-semibold text-base hover:bg-white/20 transition">
              See the Directory
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0e1f44] text-center mb-2">Why list your services on Torny AI?</h2>
          <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">Good exposure, on your terms — built for solo practitioners, boutique firms, and IBP-accredited lawyers nationwide.</p>
          <div className="grid sm:grid-cols-2 gap-5">
            {BENEFITS.map((b) => (
              <div key={b.title} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow flex gap-4">
                <div className="w-11 h-11 rounded-full bg-[#0e1f44] flex items-center justify-center flex-shrink-0">
                  <b.icon className="w-5 h-5 text-[#fcd116]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0e1f44] mb-1">{b.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* No commission highlight */}
      <section className="py-12 bg-[#fcd116]/10 border-y border-[#fcd116]/30">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Wallet className="w-10 h-10 text-[#1e3a7b] mx-auto mb-3" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0e1f44] mb-2">We don&apos;t do commissions.</h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Torny AI is here for exposure, not to take a slice of your hard-earned fees. We connect clients to you — what happens after, including your fees and billing, is entirely between you and your client.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-extrabold text-[#0e1f44] text-center mb-2">How it works</h2>
          <p className="text-gray-500 text-center mb-10">It takes less than 5 minutes to apply.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((s) => (
              <div key={s.n} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="w-10 h-10 rounded-full bg-[#fcd116] text-[#0e1f44] font-extrabold flex items-center justify-center mx-auto mb-4">{s.n}</div>
                <h3 className="font-bold text-[#0e1f44] mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-[#0e1f44] text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-[#fcd116] mx-auto mb-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={TORNY_SRC} alt="Torny AI" className="w-full h-full object-cover" style={TORNY_STYLE} />
          </div>
          <h2 className="text-2xl font-extrabold mb-3">Ready to reach more clients?</h2>
          <p className="text-blue-200 mb-6">Join our nationwide directory of IBP-accredited lawyers. Free to list, no commissions, good exposure in your region.</p>
          <Link href="/lawyers/apply" className="inline-flex items-center gap-2 bg-[#fcd116] text-[#0e1f44] px-6 py-3.5 rounded-full font-bold hover:bg-yellow-300 transition shadow-lg">
            <Plus className="w-5 h-5" /> List Your Services Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#070f23] text-blue-300 py-8">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-white">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-[#fcd116]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={TORNY_SRC} alt="Torny" className="w-full h-full object-cover" style={TORNY_STYLE} />
            </div>
            Torny AI
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <Phone className="w-4 h-4 text-[#fcd116]" />
            PAO Hotline: <span className="text-[#fcd116] font-bold">8524-2100</span>
          </div>
          <p className="text-xs text-blue-400">&copy; {new Date().getFullYear()} TORNY INFORMATION TECHNOLOGY SOLUTIONS.</p>
        </div>
      </footer>
    </div>
  );
}
