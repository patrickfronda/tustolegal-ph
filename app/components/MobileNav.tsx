"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, Search, FileText } from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/matches", icon: Search, label: "Matches" },
  { href: "/applications", icon: FileText, label: "Applied" },
  { href: "/profile", icon: User, label: "Profile" },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-2 flex items-center justify-around z-50 safe-area-inset-bottom">
      {navItems.map(({ href, icon: Icon, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-0.5 px-5 py-2 rounded-xl transition-colors ${
              active ? "text-blue-700" : "text-slate-400"
            }`}
          >
            <Icon className={`w-5 h-5 ${active ? "text-blue-700" : "text-slate-400"}`} />
            <span className={`text-[10px] font-medium ${active ? "text-blue-700" : "text-slate-400"}`}>
              {label}
            </span>
            {active && <div className="w-1 h-1 bg-blue-700 rounded-full mt-0.5" />}
          </Link>
        );
      })}
    </nav>
  );
}
