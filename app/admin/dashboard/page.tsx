"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  Users, MessageSquare, Globe, MapPin, Clock, CheckCircle, XCircle,
  Loader2, LogOut, RefreshCw, BadgeCheck, AlertCircle,
} from "lucide-react";

interface Analytics {
  totalVisits: number;
  todayVisits: number;
  totalQuestions: number;
  todayQuestions: number;
  countries: Record<string, number>;
  cities: Record<string, number>;
  recentSessions: Array<{ id: string; questions: number; country: string; city: string; startTime: string }>;
}

interface LawyerApp {
  id: string;
  name: string;
  rollNumber: string;
  specialties: string[];
  location: string;
  experience: number;
  fee: string;
  phone: string;
  email: string;
  bio: string;
  status: string;
  submittedAt: string;
}

interface Listings {
  pending: LawyerApp[];
  approved: LawyerApp[];
  rejected: LawyerApp[];
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: number; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-xl bg-[#0e1f44]/10 flex items-center justify-center text-[#0e1f44]">
          {icon}
        </div>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-3xl font-extrabold text-[#0e1f44]">{value.toLocaleString()}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [listings, setListings] = useState<Listings | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [tab, setTab] = useState<"analytics" | "listings">("analytics");

  const checkAuth = useCallback(async () => {
    const r = await fetch("/api/admin/check");
    if (!r.ok) { router.replace("/admin"); return false; }
    return true;
  }, [router]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [aRes, lRes] = await Promise.all([
        fetch("/api/admin/analytics"),
        fetch("/api/admin/listings"),
      ]);
      if (aRes.status === 401 || lRes.status === 401) { router.replace("/admin"); return; }
      const [aData, lData] = await Promise.all([aRes.json(), lRes.json()]);
      setAnalytics(aData);
      setListings(lData);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkAuth().then((ok) => { if (ok) loadData(); });
  }, [checkAuth, loadData]);

  async function handleAction(id: string, action: "approve" | "reject") {
    setActionLoading(id + action);
    try {
      const res = await fetch(`/api/admin/listings/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) await loadData();
    } finally {
      setActionLoading(null);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    document.cookie = "admin_token=; Max-Age=0; path=/";
    router.replace("/admin");
  }

  const countriesData = analytics
    ? Object.entries(analytics.countries).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, count]) => ({ name, count }))
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#0e1f44] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#0e1f44] text-white px-4 py-3 flex items-center gap-3 shadow-lg">
        <div className="flex-1">
          <h1 className="font-extrabold text-base">Torny <span className="text-[#fcd116]">Admin</span></h1>
          <p className="text-blue-300 text-xs">Back Office Dashboard</p>
        </div>
        <button onClick={loadData} className="p-2 rounded-lg hover:bg-white/10 transition-colors text-blue-300 hover:text-white" title="Refresh">
          <RefreshCw className="w-4 h-4" />
        </button>
        <button onClick={handleLogout} className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors">
          <LogOut className="w-3.5 h-3.5" /> Logout
        </button>
      </header>

      <div className="bg-white border-b border-gray-100 px-4">
        <div className="max-w-5xl mx-auto flex">
          {(["analytics", "listings"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-3 text-sm font-semibold capitalize border-b-2 transition-colors ${
                tab === t ? "border-[#0e1f44] text-[#0e1f44]" : "border-transparent text-gray-400 hover:text-gray-700"
              }`}
            >
              {t === "listings" ? `Listings ${listings?.pending.length ? `(${listings.pending.length} pending)` : ""}` : "Analytics"}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {tab === "analytics" && analytics && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={<Users className="w-4 h-4" />} label="Total Visits" value={analytics.totalVisits} sub="All time" />
              <StatCard icon={<Globe className="w-4 h-4" />} label="Today Visits" value={analytics.todayVisits} sub="Since midnight" />
              <StatCard icon={<MessageSquare className="w-4 h-4" />} label="Total Questions" value={analytics.totalQuestions} sub="All time" />
              <StatCard icon={<MessageSquare className="w-4 h-4" />} label="Today Questions" value={analytics.todayQuestions} sub="Since midnight" />
            </div>

            {countriesData.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h2 className="text-sm font-bold text-[#0e1f44] mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Visitors by Country
                </h2>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={countriesData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0e1f44" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {Object.keys(analytics.cities).length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h2 className="text-sm font-bold text-[#0e1f44] mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Top Cities
                </h2>
                <div className="space-y-2">
                  {Object.entries(analytics.cities)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 10)
                    .map(([city, count]) => (
                      <div key={city} className="flex items-center gap-3">
                        <span className="text-sm text-gray-700 flex-1">{city}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2 max-w-40">
                          <div className="bg-[#0e1f44] h-2 rounded-full" style={{ width: `${Math.min(100, (count / (Object.values(analytics.cities)[0] ?? 1)) * 100)}%` }} />
                        </div>
                        <span className="text-xs font-bold text-gray-500 w-8 text-right">{count}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {analytics.recentSessions.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h2 className="text-sm font-bold text-[#0e1f44] mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Recent Sessions
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-left text-gray-400 border-b border-gray-100">
                        <th className="pb-2 pr-4 font-semibold">Session ID</th>
                        <th className="pb-2 pr-4 font-semibold">Questions</th>
                        <th className="pb-2 pr-4 font-semibold">Country</th>
                        <th className="pb-2 pr-4 font-semibold">City</th>
                        <th className="pb-2 font-semibold">Started</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {analytics.recentSessions.map((s) => (
                        <tr key={s.id} className="hover:bg-gray-50">
                          <td className="py-2 pr-4 font-mono text-gray-500">{s.id.slice(0, 12)}…</td>
                          <td className="py-2 pr-4 font-bold text-[#0e1f44]">{s.questions}</td>
                          <td className="py-2 pr-4">{s.country || "—"}</td>
                          <td className="py-2 pr-4">{s.city || "—"}</td>
                          <td className="py-2 text-gray-400">{new Date(s.startTime).toLocaleString("en-PH", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {analytics.recentSessions.length === 0 && analytics.totalVisits === 0 && (
              <div className="text-center py-12 text-gray-400">
                <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No analytics data yet. Set up Vercel KV to start tracking.</p>
              </div>
            )}
          </div>
        )}

        {tab === "listings" && listings && (
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-bold text-[#0e1f44] mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" /> Pending Review ({listings.pending.length})
              </h2>
              {listings.pending.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center text-gray-400 text-sm">No pending applications.</div>
              ) : (
                <div className="space-y-3">
                  {listings.pending.map((app) => (
                    <div key={app.id} className="bg-white rounded-2xl border border-amber-100 p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <p className="font-bold text-[#0e1f44] text-sm">{app.name}</p>
                          <p className="text-xs text-gray-400">IBP #{app.rollNumber} · {app.location} · {app.experience} yrs · {app.fee}</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button onClick={() => handleAction(app.id, "approve")} disabled={actionLoading === app.id + "approve"} className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors disabled:opacity-60">
                            {actionLoading === app.id + "approve" ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                            Approve
                          </button>
                          <button onClick={() => handleAction(app.id, "reject")} disabled={actionLoading === app.id + "reject"} className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors disabled:opacity-60">
                            {actionLoading === app.id + "reject" ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                            Reject
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {app.specialties.map((s) => (
                          <span key={s} className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">{s}</span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{app.bio}</p>
                      <p className="text-xs text-gray-400 mt-1.5">{app.phone} · {app.email}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-sm font-bold text-[#0e1f44] mb-3 flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-green-500" /> Approved ({listings.approved.length})
              </h2>
              {listings.approved.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center text-gray-400 text-sm">No approved listings yet.</div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {listings.approved.map((app) => (
                    <div key={app.id} className="bg-white rounded-2xl border border-green-100 p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-bold text-[#0e1f44] text-sm">{app.name}</p>
                          <p className="text-xs text-gray-400">{app.location} · {app.fee}</p>
                        </div>
                        <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-semibold flex-shrink-0">Live</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {app.specialties.slice(0, 3).map((s) => (
                          <span key={s} className="text-xs bg-[#0e1f44]/10 text-[#0e1f44] px-2 py-0.5 rounded-full">{s}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {listings.rejected.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-gray-400 mb-3 flex items-center gap-2">
                  <XCircle className="w-4 h-4" /> Rejected ({listings.rejected.length})
                </h2>
                <div className="space-y-2">
                  {listings.rejected.map((app) => (
                    <div key={app.id} className="bg-white rounded-2xl border border-gray-100 p-4 opacity-60">
                      <p className="font-semibold text-gray-600 text-sm">{app.name}</p>
                      <p className="text-xs text-gray-400">{app.location} · submitted {new Date(app.submittedAt).toLocaleDateString("en-PH")}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
