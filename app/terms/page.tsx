import Link from "next/link";
import { ChevronLeft, Phone } from "lucide-react";
import { TORNY_SRC, TORNY_STYLE } from "@/app/lib/torny-src";

export const metadata = {
  title: "Terms of Service — Torny AI",
  description:
    "The Terms of Service governing your use of Torny AI, a Philippine legal information assistant operated by TORNY INFORMATION TECHNOLOGY SOLUTIONS.",
};

const SECTIONS = [
  {
    h: "1. Acceptance of These Terms",
    p: [
      "Welcome to Torny AI (“Torny,” “we,” “us,” or “our”), a service operated by TORNY INFORMATION TECHNOLOGY SOLUTIONS, a Filipino AI company. By accessing or using torny.online (the “Service”), you agree to be bound by these Terms of Service (“Terms”). If you do not agree, please do not use the Service.",
      "These Terms form a binding agreement between you and TORNY INFORMATION TECHNOLOGY SOLUTIONS.",
    ],
  },
  {
    h: "2. What Torny AI Is",
    p: [
      "Torny AI is an artificial intelligence assistant created and operated by TORNY INFORMATION TECHNOLOGY SOLUTIONS. Torny is designed to act as a knowledgeable friend who can share general information about Philippine law in a warm, conversational way.",
      "Torny’s knowledge comes from AI training conducted by TORNY INFORMATION TECHNOLOGY SOLUTIONS. Torny is not affiliated with, sourced from, or endorsed by any external legal database, law publisher, or government institution, including but not limited to LawPhil, Chan Robles Virtual Law Library, or the Supreme Court E-Library.",
      "Torny is NOT a law firm and is NOT a licensed attorney. Nothing on the Service constitutes legal advice.",
    ],
  },
  {
    h: "3. No Legal Advice; Friendly Opinion Only",
    p: [
      "Using the Service does NOT create an attorney-client relationship between you and Torny AI or TORNY INFORMATION TECHNOLOGY SOLUTIONS. All information provided is for general educational purposes only.",
      "Torny may sometimes share what it would personally do in a situation, or offer a friendly perspective on a legal matter. Any such opinion is the view of an AI designed to be a helpful friend — it is not professional legal advice, and you should treat it accordingly.",
      "For advice specific to your circumstances, always consult a licensed Filipino attorney. For free legal assistance, you may contact the Public Attorney’s Office (PAO) at 8524-2100 or the Integrated Bar of the Philippines (IBP) at 02-8-851-3433.",
    ],
  },
  {
    h: "4. No Reliance; Accuracy",
    p: [
      "While we strive for accuracy, laws change and AI-generated responses may contain errors, omissions, or outdated information. You should not act or refrain from acting based solely on information from the Service.",
      "We make no warranty that the information is complete, accurate, current, or suitable for any particular purpose.",
    ],
  },
  {
    h: "5. Eligibility",
    p: [
      "You must be at least 18 years old, or have the consent of a parent or guardian, to use the Service. By using Torny AI you represent that you meet this requirement.",
    ],
  },
  {
    h: "6. Free Questions and Paid Chat Sessions",
    p: [
      "The Service offers a limited number of free questions (currently the first 5). After the free questions are used, continued use requires a one-time payment. Two plans are available: a Basic plan (₱199) which unlocks a 12-hour Chat Session, and a Plus plan (₱299) which unlocks a 24-hour Chat Session with conversation history saved in your browser. Pricing is subject to change; the price shown at the time of purchase applies.",
      "Payments are processed by our third-party payment provider, PayMongo, via QR Ph (GCash, Maya, and participating banks). We do not store your full payment details.",
      "For the Basic plan, if you close or refresh your browser tab your conversation history will be lost, though your 12-hour access remains active. For the Plus plan, your conversation history is saved in your browser’s local storage and can be restored when you return within the 24-hour access window.",
    ],
  },
  {
    h: "7. Refunds",
    p: [
      "Because the Chat Session grants immediate digital access, payments are generally non-refundable once the session has been activated. If you experience a technical problem that prevented you from accessing a paid session, contact us and we will review your request in good faith.",
    ],
  },
  {
    h: "8. Acceptable Use",
    p: [
      "You agree not to misuse the Service. In particular, you will not: (a) use the Service for any unlawful purpose; (b) attempt to gain unauthorized access to our systems; (c) submit content that is abusive, fraudulent, or infringing; (d) use the Service to provide legal advice to third parties as if you were a licensed professional; or (e) scrape, copy, or resell the Service without our written permission.",
    ],
  },
  {
    h: "9. Lawyer Directory",
    p: [
      "The Service may list licensed attorneys for informational purposes. We do not endorse, guarantee, or take responsibility for the services of any listed lawyer. Any engagement you enter into with a lawyer is solely between you and that lawyer.",
    ],
  },
  {
    h: "10. Intellectual Property",
    p: [
      "The Service, including its design, text, logos, and the Torny AI persona, is owned by TORNY INFORMATION TECHNOLOGY SOLUTIONS and protected by applicable intellectual property laws. You may use the Service for your personal, non-commercial use only.",
    ],
  },
  {
    h: "11. Disclaimer of Warranties",
    p: [
      "The Service is provided “as is” and “as available” without warranties of any kind, whether express or implied, including merchantability, fitness for a particular purpose, and non-infringement.",
    ],
  },
  {
    h: "12. Limitation of Liability",
    p: [
      "To the maximum extent permitted by law, TORNY INFORMATION TECHNOLOGY SOLUTIONS shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss arising from your reliance on information obtained through the Service. Our total liability for any claim shall not exceed the amount you paid us in the 30 days preceding the claim.",
    ],
  },
  {
    h: "13. Privacy",
    p: [
      "Your use of the Service is also governed by our Privacy Policy, which explains how we handle your information.",
    ],
  },
  {
    h: "14. Changes to These Terms",
    p: [
      "We may update these Terms from time to time. Changes take effect when posted on this page. Your continued use of the Service after changes are posted constitutes acceptance of the revised Terms.",
    ],
  },
  {
    h: "15. Governing Law",
    p: [
      "These Terms are governed by the laws of the Republic of the Philippines. Any disputes shall be subject to the exclusive jurisdiction of the proper courts of the Philippines.",
    ],
  },
  {
    h: "16. Contact Us",
    p: [
      "Questions about these Terms? Reach us through the Torny AI website at torny.online.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <nav className="bg-[#0e1f44] text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/home" className="flex items-center gap-2 font-bold text-lg">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-[#fcd116] flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={TORNY_SRC} alt="Torny" className="w-full h-full object-cover" style={TORNY_STYLE} />
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
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">Terms of Service</h1>
          <p className="text-blue-200 text-sm">Last updated: June 20, 2026</p>
        </div>
      </section>

      {/* Intro disclaimer */}
      <section className="bg-amber-50 border-y border-amber-200 py-4">
        <div className="max-w-3xl mx-auto px-4 flex items-start gap-3">
          <span className="text-amber-500 text-lg flex-shrink-0 mt-0.5">⚠️</span>
          <p className="text-sm text-amber-800 leading-relaxed">
            <strong>Important:</strong> Torny AI provides <strong>general legal information only</strong> — not legal advice — and does not create an attorney-client relationship. For advice specific to your situation, consult a licensed Filipino attorney or call <strong>PAO at 8524-2100</strong>.
          </p>
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
          <Link href="/privacy" className="text-[#1e3a7b] font-semibold hover:underline">Privacy Policy →</Link>
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
