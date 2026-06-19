"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Scale, CheckCircle, Loader2, AlertCircle } from "lucide-react";

const ACCESS_TOKEN_KEY = "tustolegal_access";

function SuccessContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");

  useEffect(() => {
    const paymentIntentId = params.get("pi");
    if (!paymentIntentId) { setStatus("error"); return; }

    fetch(`/api/payment/verify?id=${paymentIntentId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem(ACCESS_TOKEN_KEY, data.token);
          setStatus("success");
          setTimeout(() => router.push("/"), 2500);
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [params, router]);

  return (
    <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-[#fcd116]/20 flex items-center justify-center mx-auto mb-4">
        <Scale className="w-8 h-8 text-[#1e3a7b]" />
      </div>

      {status === "verifying" && (
        <>
          <Loader2 className="w-8 h-8 animate-spin text-[#1e3a7b] mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-900 mb-1">Bine-verify ang bayad...</h2>
          <p className="text-sm text-gray-500">Sandali lang.</p>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h2 className="text-xl font-extrabold text-gray-900 mb-1">Bayad na! Salamat!</h2>
          <p className="text-sm text-gray-500 mb-4">
            Aktibo na ang iyong Chat Session sa loob ng <strong>24 na oras</strong>.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-xs text-green-700">
            Dina-diretso ka pabalik sa chat...
          </div>
        </>
      )}

      {status === "error" && (
        <>
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-900 mb-1">Hindi ma-verify ang bayad</h2>
          <p className="text-sm text-gray-500 mb-4">
            Kung nabayaran mo na, makipag-ugnayan sa amin sa <strong>support@tustolegal.ph</strong>.
          </p>
          <button
            onClick={() => router.push("/")}
            className="w-full bg-[#1e3a7b] text-white font-bold py-3 rounded-2xl hover:bg-[#162d60] transition-colors text-sm"
          >
            Bumalik sa Home
          </button>
        </>
      )}
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-[#0e1f44] flex items-center justify-center p-6">
      <div className="h-1 fixed top-0 left-0 right-0 bg-gradient-to-r from-[#0038a8] via-[#fcd116] to-[#ce1126]" />
      <Suspense fallback={
        <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#1e3a7b] mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
