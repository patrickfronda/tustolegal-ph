"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Briefcase, Search, FileText, Upload, ChevronRight, LogOut } from "lucide-react";
import MobileNav from "@/app/components/MobileNav";

interface UserProfile {
  id: string; name: string; email: string; phone?: string; city?: string;
  desiredPosition?: string; experienceYears?: number; skills: string[];
  photoPath?: string; cvPath?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [matchCount, setMatchCount] = useState(0);
  const [appCount, setAppCount] = useState(0);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => {
      if (!r.ok) { router.push("/login"); return; }
      return r.json();
    }).then((d) => d && setUser(d.user));

    fetch("/api/matches").then((r) => r.json()).then((d) => setMatchCount(d.matches?.length ?? 0));
    fetch("/api/apply").then((r) => r.json()).then((d) => setAppCount(d.applications?.length ?? 0));
  }, [router]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  if (!user) return <LoadingScreen />;

  const completeness = calcCompleteness(user);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-blue-700 px-6 pt-10 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-white" />
            <span className="text-white font-semibold text-sm">TustoJobs ME</span>
          </div>
          <button onClick={logout} className="text-white/70 hover:text-white">
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/20 flex items-center justify-center flex-shrink-0">
            {user.photoPath ? (
              <Image src={user.photoPath} alt={user.name} width={64} height={64} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-2xl font-bold">{user.name[0]}</span>
            )}
          </div>
          <div>
            <p className="text-blue-200 text-xs">Welcome back,</p>
            <h2 className="text-white text-xl font-bold">{user.name}</h2>
            <p className="text-blue-200 text-sm mt-0.5">{user.desiredPosition || "No position set"}</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-5 max-w-md mx-auto">
        {/* Profile Completeness */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-700">Profile Completeness</span>
            <span className="text-sm font-bold text-blue-700">{completeness}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-700 rounded-full transition-all duration-500"
              style={{ width: `${completeness}%` }}
            />
          </div>
          {completeness < 100 && (
            <p className="text-xs text-slate-500 mt-2">
              {!user.photoPath && "Add a profile photo. "}
              {!user.cvPath && "Upload your CV. "}
              {!user.desiredPosition && "Set your desired position. "}
              {user.skills.length === 0 && "Add your skills."}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <StatCard icon={Search} label="Matched Companies" value={matchCount} color="blue" href="/matches" />
          <StatCard icon={FileText} label="Applications Sent" value={appCount} color="green" href="/applications" />
        </div>

        {/* Quick Actions */}
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Quick Actions</h3>
        <div className="flex flex-col gap-2">
          <ActionLink href="/matches" icon={Search} title="Find Job Matches" desc={`${matchCount} companies matched`} />
          <ActionLink href="/profile" icon={Upload} title="Update Profile & CV" desc="Photo, CV, skills" />
          <ActionLink href="/applications" icon={FileText} title="View Applications" desc={`${appCount} sent`} />
        </div>

        {/* CV Alert */}
        {!user.cvPath && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-start gap-3">
            <Upload className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-yellow-800">Upload your CV</p>
              <p className="text-xs text-yellow-600 mt-0.5">Upload your PDF CV to start sending applications.</p>
              <Link href="/profile" className="text-xs font-bold text-yellow-700 mt-2 block">Go to Profile →</Link>
            </div>
          </div>
        )}
      </div>

      <MobileNav />
    </div>
  );
}

function calcCompleteness(user: UserProfile): number {
  let score = 0;
  if (user.name) score += 20;
  if (user.email) score += 10;
  if (user.phone) score += 10;
  if (user.desiredPosition) score += 15;
  if (user.skills.length > 0) score += 15;
  if (user.photoPath) score += 15;
  if (user.cvPath) score += 15;
  return score;
}

function StatCard({ icon: Icon, label, value, color, href }: {
  icon: React.ElementType; label: string; value: number; color: "blue" | "green"; href: string;
}) {
  return (
    <Link href={href} className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-2 active:scale-95 transition-transform">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color === "blue" ? "bg-blue-100" : "bg-green-100"}`}>
        <Icon className={`w-5 h-5 ${color === "blue" ? "text-blue-700" : "text-green-700"}`} />
      </div>
      <div className={`text-2xl font-bold ${color === "blue" ? "text-blue-700" : "text-green-700"}`}>{value}</div>
      <div className="text-xs text-slate-500 leading-tight">{label}</div>
    </Link>
  );
}

function ActionLink({ href, icon: Icon, title, desc }: { href: string; icon: React.ElementType; title: string; desc: string }) {
  return (
    <Link href={href} className="bg-white rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4 active:scale-95 transition-transform">
      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-blue-700" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold text-slate-800">{title}</div>
        <div className="text-xs text-slate-500">{desc}</div>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300" />
    </Link>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-500 text-sm">Loading…</p>
      </div>
    </div>
  );
}
