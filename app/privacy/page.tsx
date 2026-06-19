import Link from "next/link";
import { ChevronLeft, Phone } from "lucide-react";
import { TORNY_SRC } from "@/app/lib/torny-src";

export const metadata = {
  title: "Privacy Policy — Torny AI",
  description:
    "How Torny AI, operated by TORNY INFORMATION TECHNOLOGY SOLUTIONS, collects, uses, and protects your information.",
};

const SECTIONS = [
  {
    h: "1. Introduction",
    p: [
      "This Privacy Policy explains how Torny AI (“Torny,” “we,” “us,” or “our”), operated by TORNY INFORMATION TECHNOLOGY SOLUTIONS, handles information when you use torny.online (the “Service”). We are committed to protecting your privacy in accordance with the Philippine Data Privacy Act of 2012 (RA 10173).",
    ],
  },
  {
    h: "2. Information We Collect",
    p: [
      "We aim to collect as little personal information as possible. We do NOT require you to create an account, and we do NOT ask for your name or email to use the chat.",
      "We may process: (a) the messages and questions you send to Torny so we can generate responses; (b) a randomly generated anonymous identifier stored on your device to count free questions and manage your session; (c) basic technical data such as approximate usage and analytics; and (d) payment confirmation data from our payment provider (we do not store full card or wallet details).",
    ],
  },
  {
    h: "3. How We Use Information",
    p: [
      "We use information to: provide and improve the Service; generate AI responses to your questions; enforce free-question limits and unlock paid Chat Sessions; process payments; maintain security; and comply with legal obligations.",
    ],
  },
  {
    h: "4. AI Processing",
    p: [
      "To answer your questions, the content of your messages is sent to our AI provider for processing. Please avoid sharing sensitive personal information (such as full names, government ID numbers, or case details that could identify you) that you do not want processed.",
    ],
  },
  {
    h: "5. Payments",
    p: [
      "Payments are handled by PayMongo via QR Ph (GCash, Maya, and participating banks). Your payment is processed on PayMongo’s systems under their privacy practices. We receive only confirmation of whether a payment succeeded — not your full financial details.",
    ],
  },
  {
    h: "6. Cookies and Local Storage",
    p: [
      "We use your browser’s local storage and similar technologies to remember your session, your anonymous identifier, your free-question count, and whether you have accepted our disclaimer. These are essential to how the Service works.",
    ],
  },
  {
    h: "7. Sharing of Information",
    p: [
      "We do not sell your personal information. We share information only with service providers who help us operate the Service (such as our AI provider, payment processor, and hosting/analytics providers), and where required by law or to protect our rights.",
    ],
  },
  {
    h: "8. Data Retention",
    p: [
      "We retain information only for as long as necessary to provide the Service and for legitimate business or legal purposes. Anonymous session data is short-lived and generally tied to your 24-hour session window.",
    ],
  },
  {
    h: "9. Your Rights",
    p: [
      "Under the Data Privacy Act, you have the right to be informed, to access, to object, to rectify, to erase or block, and to data portability regarding your personal data, as well as the right to lodge a complaint with the National Privacy Commission (NPC). To exercise these rights, contact us through the Service.",
    ],
  },
  {
    h: "10. Security",
    p: [
      "We take reasonable technical and organizational measures to protect your information. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.",
    ],
  },
  {
    h: "11. Children",
    p: [
      "The Service is not directed to children under 18. We do not knowingly collect personal information from children.",
    ],
  },
  {
    h: "12. Changes to This Policy",
    p: [
      "We may update this Privacy Policy from time to time. Changes take effect when posted on this page. Please review it periodically.",
    ],
  },
  {
    h: "13. Contact Us",
    p: [
      "Questions about this Privacy Policy or your data? Reach us through the Torny AI website at torny.online.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <nav className="bg-[#0e1f44] text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/home" className="flex items-center gap-2 font-bold text-lg">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-[#fcd116] flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={TORNY_SRC} alt="Torny" className="w-full h-full object-cover" />
            </div>
            Torny <span className="text-[#fcd116]">AI</span>
          </Link>
          <Link href="/home" className="flex items-center gap-1 text-sm text-blue-200 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </nav>

      {/* Header */}
      <section className="relative bg-gradient-to-br from-[#0e1f44] via-[#1e3a7b] to-[#162d60] text-white">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0038a8] via-[#fcd116] to-[#ce1126]" />
        <div className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">Privacy Policy</h1>
          <p className="text-blue-200 text-sm">Last updated: June 19, 2026</p>
        </div>
      </section>

      {/* Body */}
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12 w-full">
        <div className="space-y-8">
          {SECTIONS.map((s) => (
            <div key={s.h}>
              <h2 className="text-lg font-bold text-[#0e1f44] mb-2">{s.h}</h2>
              <div className="space-y-3">
                {s.p.map((para, i) => (
                  <p key={i} className="text-gray-600 text-sm leading-relaxed">{para}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 text-sm">
          <Link href="/terms" className="text-[#1e3a7b] font-semibold hover:underline">Terms of Service →</Link>
          <Link href="/" className="inline-flex items-center gap-2 bg-[#fcd116] text-[#0e1f44] px-5 py-2.5 rounded-full font-bold hover:bg-yellow-300 transition">
            Chat with Torny AI
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#070f23] text-blue-300 py-8">
        <div className="max-w-3xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-white">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-[#fcd116]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={TORNY_SRC} alt="Torny" className="w-full h-full object-cover" />
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
