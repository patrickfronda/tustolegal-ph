"use client";
import { socialMetrics } from "@/app/lib/data";
import { TrendingUp } from "lucide-react";

const platformColors: Record<string, string> = {
  Facebook: "bg-blue-100 text-blue-700",
  "Twitter/X": "bg-gray-100 text-gray-700",
  TikTok: "bg-pink-100 text-pink-700",
  YouTube: "bg-red-100 text-red-700",
};

export default function SocialMetrics() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-base font-semibold text-gray-800 mb-1">Social Media Metrics</h2>
      <p className="text-xs text-gray-400 mb-4">Mentions & sentiment (last 30 days)</p>
      <div className="space-y-3">
        {socialMetrics.map((s) => (
          <div key={s.platform} className="flex items-center gap-3">
            <span className={`text-xs font-semibold px-2 py-1 rounded-lg w-24 text-center ${platformColors[s.platform]}`}>
              {s.platform}
            </span>
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-0.5">
                <span className="text-gray-500">{(s.mentions / 1000).toFixed(0)}K mentions</span>
                <span className="text-gray-500">{s.sentiment}% positive</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
                  style={{ width: `${s.sentiment}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600 font-semibold w-12 justify-end">
              <TrendingUp className="w-3 h-3" />
              {s.trend}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
