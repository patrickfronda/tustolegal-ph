"use client";
import { BarChart2, Activity, Map, Users, Share2, CalendarDays, Settings, LogOut, TrendingUp } from "lucide-react";

const navItems = [
  { icon: BarChart2, label: "Overview", active: true },
  { icon: Activity, label: "Poll Tracker" },
  { icon: Map, label: "Regional Map" },
  { icon: Users, label: "Demographics" },
  { icon: Share2, label: "Social Media" },
  { icon: CalendarDays, label: "Events" },
  { icon: TrendingUp, label: "Issues" },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-56 bg-gray-900 text-white min-h-screen py-6 px-4">
      <div className="mb-8 px-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
            <BarChart2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm tracking-wide">CampaignIQ</span>
        </div>
        <p className="text-xs text-gray-500 mt-1 pl-9">Analytics Platform</p>
      </div>

      <div className="text-xs text-gray-500 font-semibold uppercase tracking-widest px-2 mb-3">Dashboard</div>
      <nav className="flex-1 space-y-1">
        {navItems.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              active
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-6 pt-4 border-t border-gray-800 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition">
          <Settings className="w-4 h-4" />Settings
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition">
          <LogOut className="w-4 h-4" />Sign out
        </button>
      </div>
    </aside>
  );
}
