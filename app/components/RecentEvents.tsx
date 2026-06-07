"use client";
import { recentEvents } from "@/app/lib/data";
import { CalendarDays } from "lucide-react";

export default function RecentEvents() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-base font-semibold text-gray-800 mb-1">Campaign Events</h2>
      <p className="text-xs text-gray-400 mb-4">Recent events & approval impact</p>
      <div className="space-y-3">
        {recentEvents.map((e, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
            <div className="flex-shrink-0 bg-blue-100 rounded-lg p-2">
              <CalendarDays className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{e.event}</p>
              <p className="text-xs text-gray-400">{e.date}</p>
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
              {e.approval}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
