"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { sentimentData } from "@/app/lib/data";

export default function SentimentChart() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-base font-semibold text-gray-800 mb-1">Public Sentiment</h2>
      <p className="text-xs text-gray-400 mb-2">Based on 502K social media posts</p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={sentimentData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {sentimentData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => `${v}%`} />
          <Legend iconType="circle" iconSize={8} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-4 mt-1">
        {sentimentData.map((s) => (
          <div key={s.name} className="text-center">
            <div className="text-lg font-bold" style={{ color: s.color }}>{s.value}%</div>
            <div className="text-xs text-gray-400">{s.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
