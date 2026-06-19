"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TORNY_SRC, TORNY_STYLE } from "@/app/lib/torny-src";

const ACCESS_TOKEN_KEY = "tustolegal_access";

function DemoInner() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const key = searchParams.get("key");
    if (!key) { setStatus("error"); return; }

    fetch(`/api/demo?key=${encodeURIComponent(key)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem(ACCESS_TOKEN_KEY, data.token);
          setStatus("success");
          setTimeout(() => router.replace("/"), 800);
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [searchParams, router]);

  if (status === "loading") return <p className="text-blue-200 text-sm animate-pulse">Setting up demo access...</p>;
  if (status === "success") return <p className="text-green-300 text-sm font-semibold">✓ Access granted! Taking you to chat...</p>;
  return <p className="text-red-300 text-sm">Invalid demo key. Check the URL and try again.</p>;
}

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[#0e1f44] flex items-center justify-center p-4">
      <div className="text-center text-white">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-[#fcd116] mx-auto mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={TORNY_SRC} alt="Torny" className="w-full h-full object-cover" style={TORNY_STYLE} />
        </div>
        <h1 className="text-xl font-extrabold mb-1">Torny <span className="text-[#fcd116]">AI</span></h1>
        <p className="text-blue-300 text-xs mb-6">Demo Access</p>
        <Suspense fallback={<p className="text-blue-200 text-sm">Loading...</p>}>
          <DemoInner />
        </Suspense>
      </div>
    </div>
  );
}
