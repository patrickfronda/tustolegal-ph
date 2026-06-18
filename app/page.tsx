import Link from "next/link";
import { Briefcase, Upload, Mail, Search } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 flex flex-col">
      {/* Header */}
      <header className="px-6 pt-12 pb-4 text-center">
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full mb-6">
          <Briefcase className="w-4 h-4 text-white" />
          <span className="text-white text-sm font-medium">TustoJobs PH</span>
        </div>
        <h1 className="text-4xl font-bold text-white leading-tight">
          Your Dream Job.<br />
          <span className="text-yellow-300">Automatically Applied.</span>
        </h1>
        <p className="mt-4 text-blue-100 text-base max-w-xs mx-auto">
          Upload your CV and photo — we match you with top Philippine companies and send your applications for you.
        </p>
      </header>

      {/* Feature Cards */}
      <div className="px-6 mt-8 flex flex-col gap-3 max-w-md mx-auto w-full">
        {[
          { icon: Upload, label: "Upload your CV & photo", color: "bg-yellow-400/20" },
          { icon: Search, label: "We find matching companies", color: "bg-green-400/20" },
          { icon: Mail, label: "Applications sent automatically", color: "bg-purple-400/20" },
        ].map(({ icon: Icon, label, color }) => (
          <div key={label} className={`flex items-center gap-4 ${color} backdrop-blur rounded-2xl px-5 py-4`}>
            <div className="bg-white/20 p-2 rounded-xl">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-medium">{label}</span>
          </div>
        ))}
      </div>

      {/* CTA Buttons */}
      <div className="px-6 mt-10 flex flex-col gap-3 max-w-md mx-auto w-full">
        <Link
          href="/register"
          className="block w-full text-center bg-white text-blue-700 font-bold py-4 rounded-2xl text-lg shadow-lg active:scale-95 transition-transform"
        >
          Get Started — It&apos;s Free
        </Link>
        <Link
          href="/login"
          className="block w-full text-center border-2 border-white/50 text-white font-semibold py-4 rounded-2xl text-base active:scale-95 transition-transform"
        >
          Sign In
        </Link>
      </div>

      {/* Stats */}
      <div className="px-6 mt-10 pb-12 max-w-md mx-auto w-full">
        <div className="bg-white/10 backdrop-blur rounded-2xl p-5 grid grid-cols-3 divide-x divide-white/20">
          {[
            { value: "20+", label: "Companies" },
            { value: "Free", label: "Always" },
            { value: "Auto", label: "Applications" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center px-2">
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="text-xs text-blue-200 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
