"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, FileText, Check, AlertCircle, Search } from "lucide-react";
import MobileNav from "@/app/components/MobileNav";

interface Application {
  id: string; companyId: string; companyName: string; companyIndustry: string;
  jobTitle: string; sentAt: string; status: "sent" | "failed";
}

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => {
      if (!r.ok) { router.push("/login"); return null; }
      return fetch("/api/apply").then((r) => r.json());
    }).then((d) => {
      if (d) setApplications((d.applications ?? []).sort((a: Application, b: Application) =>
        new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
      ));
      setLoading(false);
    });
  }, [router]);

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-blue-700 px-6 pt-10 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => router.back()} className="text-white/80"><ChevronLeft className="w-5 h-5" /></button>
          <h1 className="text-white font-bold text-xl">Applications</h1>
        </div>
        <p className="text-blue-200 text-sm">{applications.length} application{applications.length !== 1 ? "s" : ""} sent</p>
      </div>

      <div className="px-4 py-4 max-w-md mx-auto">
        {applications.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No applications yet</p>
            <p className="text-slate-400 text-sm mt-1">Go to Matches and tap Apply to send your first application.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div key={app.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${app.status === "sent" ? "bg-green-100" : "bg-red-100"}`}>
                  {app.status === "sent" ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-slate-800 text-sm truncate">{app.companyName}</h3>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${app.status === "sent" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {app.status === "sent" ? "Sent" : "Failed"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{app.companyIndustry}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{app.jobTitle}</p>
                  <p className="text-xs text-slate-400 mt-1">{formatDate(app.sentAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {applications.length > 0 && (
          <div className="mt-4 bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-700">
              <strong>Next steps:</strong> Watch your email inbox for replies from companies. Follow up within 5–7 business days if you don&apos;t hear back.
            </p>
          </div>
        )}
      </div>

      <MobileNav />
    </div>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-PH", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-700 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
