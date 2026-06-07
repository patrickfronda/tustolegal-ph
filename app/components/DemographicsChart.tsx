"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { voterDemographics } from "@/app/lib/data";

export default function DemographicsChart() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-base font-semibold text-gray-800 mb-1">Voter Demographics</h2>
      <p className="text-xs text-gray-400 mb-4">Support & estimated turnout by age group (%)</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={voterDemographics} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="age" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} unit="%" domain={[0, 100]} />
          <Tooltip formatter={(v) => `${v}%`} />
          <Legend iconType="square" iconSize={8} />
          <Bar dataKey="support" name="Support" fill="#3b82f6" radius={[3, 3, 0, 0]} maxBarSize={22} />
          <Bar dataKey="turnout" name="Est. Turnout" fill="#a78bfa" radius={[3, 3, 0, 0]} maxBarSize={22} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
