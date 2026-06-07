"use client";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { pollHistory, candidates } from "@/app/lib/data";

export default function PollChart() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-base font-semibold text-gray-800 mb-1">Poll Tracking</h2>
      <p className="text-xs text-gray-400 mb-4">Voter preference over time (%)</p>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={pollHistory} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} domain={[0, 60]} unit="%" />
          <Tooltip formatter={(v) => `${v}%`} />
          <Legend iconType="circle" iconSize={8} />
          {candidates.map((c) => (
            <Line
              key={c.id}
              type="monotone"
              dataKey={c.name}
              stroke={c.color}
              strokeWidth={2.5}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
          <Line type="monotone" dataKey="Undecided" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 3" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
