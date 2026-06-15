"use client";
import { useState } from "react";
import { Scale, Menu, X, Phone } from "lucide-react";

const navLinks = [
  { label: "Mga Serbisyo", href: "#topics" },
  { label: "Paano Ito Gumagana", href: "#how-it-works" },
  { label: "Magtanong", href: "#inquiry" },
  { label: "FAQ", href: "#faq" },
  { label: "Mga Mapagkukunan", href: "#resources" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#1e3a7b] text-white shadow-lg">
      {/* Top bar */}
      <div className="bg-[#162d60] text-xs text-blue-200 py-1 px-4 text-center hidden sm:block">
        Libreng legal na gabay para sa bawat Pilipino · Free legal guidance for every Filipino
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <div className="w-9 h-9 rounded-full bg-[#fcd116] flex items-center justify-center">
              <Scale className="w-5 h-5 text-[#1e3a7b]" />
            </div>
            <span>
              Tusto<span className="text-[#fcd116]">Legal</span>
              <span className="text-blue-300 text-sm font-normal"> PH</span>
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-blue-100 hover:text-[#fcd116] transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:8524-2100"
              className="flex items-center gap-1.5 text-sm text-blue-200 hover:text-white transition-colors"
            >
              <Phone className="w-4 h-4" />
              PAO Hotline: 8524-2100
            </a>
            <a
              href="#inquiry"
              className="bg-[#fcd116] text-[#1e3a7b] px-4 py-2 rounded-full text-sm font-bold hover:bg-yellow-300 transition-colors"
            >
              Magtanong Ngayon
            </a>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-blue-700 bg-[#1e3a7b] px-4 pb-4">
          <div className="flex flex-col gap-2 pt-3">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2 px-3 rounded-lg text-blue-100 hover:bg-white/10 hover:text-white transition"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#inquiry"
              onClick={() => setOpen(false)}
              className="mt-2 bg-[#fcd116] text-[#1e3a7b] px-4 py-2.5 rounded-full text-sm font-bold text-center hover:bg-yellow-300 transition"
            >
              Magtanong Ngayon
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
