"use client";
import { keyIssues } from "@/app/lib/data";

export default function IssuesTracker() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-base font-semibold text-gray-800 mb-1">Key Issues</h2>
      <p className="text-xs text-gray-400 mb-4">Voter importance vs. candidate score</p>
      <div className="space-y-4">
        {keyIssues.map((item) => (
          <div key={item.issue}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">{item.issue}</span>
              <div className="flex gap-3 text-xs">
                <span className="text-gray-400">Importance <b className="text-gray-700">{item.importance}%</b></span>
                <span className="text-blue-500">Score <b>{item.candidateScore}%</b></span>
              </div>
            </div>
            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="absolute h-2 rounded-full bg-gray-300"
                style={{ width: `${item.importance}%` }}
              />
              <div
                className="absolute h-2 rounded-full bg-blue-500 opacity-80"
                style={{ width: `${item.candidateScore}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-4 text-xs text-gray-400">
        <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm bg-gray-300 inline-block" /> Voter importance</span>
        <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm bg-blue-500 inline-block" /> Candidate score</span>
      </div>
    </div>
  );
}
