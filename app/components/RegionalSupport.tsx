"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { regionalSupport, candidates } from "@/app/lib/data";

export default function RegionalSupport() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-base font-semibold text-gray-800 mb-1">Regional Support</h2>
      <p className="text-xs text-gray-400 mb-4">Candidate support by region (%)</p>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={regionalSupport} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="region" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 12 }} unit="%" />
          <Tooltip formatter={(v) => `${v}%`} />
          <Legend iconType="square" iconSize={8} />
          {candidates.map((c) => (
            <Bar key={c.id} dataKey={c.name} fill={c.color} radius={[3, 3, 0, 0]} maxBarSize={18} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
