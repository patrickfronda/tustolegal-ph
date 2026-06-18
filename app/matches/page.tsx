"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Send, Check, Building2, MapPin, AlertCircle, Search } from "lucide-react";
import MobileNav from "@/app/components/MobileNav";

interface Company {
  id: string; name: string; industry: string; location: string;
  description: string; recruitmentEmail: string; requiredSkills: string[];
  jobCategories: string[]; logoColor: string;
}

interface MatchResult {
  company: Company; score: number; matchedSkills: string[];
}

export default function MatchesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState<Record<string, boolean>>({});
  const [applying, setApplying] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [hasCv, setHasCv] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then((r) => r.ok ? r.json() : null),
      fetch("/api/matches").then((r) => r.ok ? r.json() : null),
      fetch("/api/apply").then((r) => r.ok ? r.json() : null),
    ]).then(([me, matchData, appData]) => {
      if (!me) { router.push("/login"); return; }
      setHasCv(!!me.user.cvPath);
      setMatches(matchData?.matches ?? []);
      const appliedMap: Record<string, boolean> = {};
      (appData?.applications ?? []).forEach((a: { companyId: string }) => { appliedMap[a.companyId] = true; });
      setApplied(appliedMap);
      setLoading(false);
    });
  }, [router]);

  async function applyToCompany(companyId: string) {
    setApplying(companyId);
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId }),
      });
      const data = await res.json();
      if (res.ok || res.status === 207) {
        setApplied((a) => ({ ...a, [companyId]: true }));
        setToast({ msg: res.status === 207 ? "Application saved (email delivery pending — configure SMTP)" : "Application sent!", ok: true });
      } else {
        setToast({ msg: data.error || "Failed to apply.", ok: false });
      }
    } catch {
      setToast({ msg: "Network error.", ok: false });
    } finally {
      setApplying(null);
      setTimeout(() => setToast(null), 4000);
    }
  }

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 left-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-lg text-sm font-medium flex items-center gap-2 max-w-md mx-auto ${toast.ok ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
          {toast.ok ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="bg-blue-700 px-6 pt-10 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => router.back()} className="text-white/80"><ChevronLeft className="w-5 h-5" /></button>
          <h1 className="text-white font-bold text-xl">Job Matches</h1>
        </div>
        <p className="text-blue-200 text-sm">{matches.length} companies matched your profile</p>
      </div>

      <div className="px-4 py-4 max-w-md mx-auto">
        {/* No CV warning */}
        {!hasCv && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-yellow-800">Upload your CV first</p>
              <p className="text-xs text-yellow-600 mt-0.5">Your CV will be attached to each application email.</p>
            </div>
          </div>
        )}

        {matches.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No matches yet</p>
            <p className="text-slate-400 text-sm mt-1">Add your skills and desired position in your profile.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {matches.map(({ company, score, matchedSkills }) => (
              <div key={company.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-start gap-3 mb-3">
                  {/* Company Logo */}
                  <div
                    className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: company.logoColor }}
                  >
                    {company.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-slate-800 text-sm leading-tight">{company.name}</h3>
                      <MatchBadge score={score} />
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{company.industry}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <p className="text-xs text-slate-400">{company.location}</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mb-3 leading-relaxed">{company.description}</p>

                {matchedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {matchedSkills.slice(0, 5).map((s) => (
                      <span key={s} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">{s}</span>
                    ))}
                    {matchedSkills.length > 5 && (
                      <span className="text-xs bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">+{matchedSkills.length - 5} more</span>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 flex-1">
                    <Building2 className="w-3.5 h-3.5" />
                    <span className="truncate">{company.recruitmentEmail}</span>
                  </div>
                  <button
                    onClick={() => !applied[company.id] && applyToCompany(company.id)}
                    disabled={!!applied[company.id] || applying === company.id}
                    className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl flex-shrink-0 transition-all active:scale-95 ${
                      applied[company.id]
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-700 text-white"
                    } disabled:opacity-60`}
                  >
                    {applying === company.id ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : applied[company.id] ? (
                      <><Check className="w-4 h-4" /> Sent</>
                    ) : (
                      <><Send className="w-4 h-4" /> Apply</>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <MobileNav />
    </div>
  );
}

function MatchBadge({ score }: { score: number }) {
  const color = score >= 70 ? "bg-green-100 text-green-700" : score >= 40 ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-slate-500";
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${color}`}>{score}% match</span>;
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-700 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
