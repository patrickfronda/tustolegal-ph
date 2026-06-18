"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, Shield } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/check")
      .then((r) => { if (r.ok) router.replace("/admin/dashboard"); })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.replace("/admin/dashboard");
      } else {
        const data = await res.json();
        setError(data.error ?? "Incorrect password.");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0e1f44] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e1f44] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-[#0e1f44] flex items-center justify-center mb-3">
            <Shield className="w-7 h-7 text-[#fcd116]" />
          </div>
          <h1 className="text-xl font-extrabold text-[#0e1f44]">Admin Login</h1>
          <p className="text-xs text-gray-400 mt-1">Torny AI Back Office</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Admin Password</label>
            <input type="password" required autoFocus value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter admin password" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a7b]/30" />
          </div>
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-3 py-2 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}
          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-[#0e1f44] text-white font-bold py-3 rounded-xl text-sm hover:bg-[#1e3a7b] transition-colors disabled:opacity-60">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
