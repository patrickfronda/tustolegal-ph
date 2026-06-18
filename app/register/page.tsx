"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Briefcase, Eye, EyeOff, Plus, X, ArrowLeft } from "lucide-react";

const SKILL_SUGGESTIONS = [
  "Customer Service", "Microsoft Office", "Communication", "Sales", "Accounting",
  "JavaScript", "Python", "Java", "React", "Node.js", "SQL", "Excel", "Finance",
  "Marketing", "Project Management", "English Proficiency", "Data Analysis",
  "Nursing", "Engineering", "Legal Research", "HR", "Operations", "Banking",
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  const [form, setForm] = useState({
    name: "", email: "", password: "", phone: "", city: "",
    desiredPosition: "", experienceYears: "", skills: [] as string[],
  });

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function addSkill(skill: string) {
    const s = skill.trim();
    if (s && !form.skills.includes(s)) {
      setForm((f) => ({ ...f, skills: [...f.skills, s] }));
    }
    setSkillInput("");
  }

  function removeSkill(skill: string) {
    setForm((f) => ({ ...f, skills: f.skills.filter((s) => s !== skill) }));
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Registration failed."); return; }
      router.push("/profile?welcome=1");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const cities = ["Metro Manila", "Cebu City", "Davao City", "Quezon City", "Makati", "Pasig", "Taguig", "Mandaluyong", "Pasay", "Caloocan", "Other"];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-blue-700 px-6 pt-10 pb-8">
        <div className="flex items-center gap-3 mb-4">
          {step > 1 && (
            <button onClick={() => setStep(s => s - 1)} className="text-white/80">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-white" />
            <span className="text-white font-semibold">TustoJobs PH</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white">Create Account</h1>
        <p className="text-blue-200 text-sm mt-1">Step {step} of 2</p>
        <div className="mt-3 flex gap-1">
          {[1, 2].map((s) => (
            <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? "bg-white" : "bg-white/30"}`} />
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 py-6 max-w-md mx-auto w-full">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <Field label="Full Name *" value={form.name} onChange={(v) => set("name", v)} placeholder="Juan dela Cruz" />
            <Field label="Email Address *" value={form.email} onChange={(v) => set("email", v)} placeholder="juan@email.com" type="email" />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password *</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-12 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="button" onClick={() => setShowPass((s) => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Field label="Phone Number" value={form.phone} onChange={(v) => set("phone", v)} placeholder="+63 9XX XXX XXXX" type="tel" />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">City / Location</label>
              <select
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select your city</option>
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <button
              onClick={() => {
                if (!form.name || !form.email || !form.password) { setError("Please fill all required fields."); return; }
                setError(""); setStep(2);
              }}
              className="mt-2 w-full bg-blue-700 text-white font-bold py-4 rounded-2xl text-base active:scale-95 transition-transform"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <Field label="Desired Job Position" value={form.desiredPosition} onChange={(v) => set("desiredPosition", v)} placeholder="e.g. Software Engineer, Accountant" />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Years of Experience</label>
              <select
                value={form.experienceYears}
                onChange={(e) => set("experienceYears", e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select experience level</option>
                <option value="0">Fresh Graduate / No Experience</option>
                <option value="1">1 year</option>
                <option value="2">2 years</option>
                <option value="3">3 years</option>
                <option value="5">5 years</option>
                <option value="7">7+ years</option>
                <option value="10">10+ years</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Skills</label>
              <div className="flex gap-2 mb-2">
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(skillInput); } }}
                  placeholder="Type a skill and press Enter"
                  className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button onClick={() => addSkill(skillInput)} className="bg-blue-700 text-white px-3 py-3 rounded-xl">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Suggestions */}
              <div className="flex flex-wrap gap-2 mb-3">
                {SKILL_SUGGESTIONS.filter((s) => !form.skills.includes(s)).slice(0, 8).map((s) => (
                  <button
                    key={s}
                    onClick={() => addSkill(s)}
                    className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full border border-slate-200 active:bg-blue-100 active:text-blue-700 transition-colors"
                  >
                    + {s}
                  </button>
                ))}
              </div>

              {/* Selected Skills */}
              {form.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.skills.map((s) => (
                    <span key={s} className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      {s}
                      <button onClick={() => removeSkill(s)} className="ml-1"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-2 w-full bg-blue-700 text-white font-bold py-4 rounded-2xl text-base active:scale-95 transition-transform disabled:opacity-60"
            >
              {loading ? "Creating Account…" : "Create Account"}
            </button>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-700 font-semibold">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
      />
    </div>
  );
}
