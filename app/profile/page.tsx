"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Camera, Upload, X, Plus, Check, ChevronLeft } from "lucide-react";
import MobileNav from "@/app/components/MobileNav";

const SKILL_SUGGESTIONS = [
  "Customer Service", "Microsoft Office", "Communication", "Sales", "Accounting",
  "JavaScript", "Python", "Java", "React", "Node.js", "SQL", "Excel", "Finance",
  "Marketing", "Project Management", "English Proficiency", "Data Analysis",
  "Nursing", "Engineering", "Legal Research", "HR", "Operations", "Banking",
];

interface UserProfile {
  id: string; name: string; email: string; phone?: string; city?: string;
  desiredPosition?: string; experienceYears?: number; skills: string[];
  photoPath?: string; cvPath?: string;
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-700 border-t-transparent rounded-full animate-spin" /></div>}>
      <ProfileContent />
    </Suspense>
  );
}

function ProfileContent() {
  const router = useRouter();
  const params = useSearchParams();
  const isWelcome = params.get("welcome") === "1";

  const [user, setUser] = useState<UserProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [cvUploading, setCvUploading] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [error, setError] = useState("");

  const photoRef = useRef<HTMLInputElement>(null);
  const cvRef = useRef<HTMLInputElement>(null);

  const cities = ["Metro Manila", "Cebu City", "Davao City", "Quezon City", "Makati", "Pasig", "Taguig", "Mandaluyong", "Pasay", "Caloocan", "Other"];

  useEffect(() => {
    fetch("/api/auth/me").then((r) => {
      if (!r.ok) { router.push("/login"); return; }
      return r.json();
    }).then((d) => d && setUser(d.user));
  }, [router]);

  async function saveProfile() {
    if (!user) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.name, phone: user.phone, city: user.city,
          desiredPosition: user.desiredPosition, experienceYears: user.experienceYears,
          skills: user.skills,
        }),
      });
      if (!res.ok) { setError("Failed to save."); return; }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch { setError("Network error."); }
    finally { setSaving(false); }
  }

  async function uploadPhoto(file: File) {
    setPhotoUploading(true);
    const fd = new FormData();
    fd.append("photo", file);
    try {
      const res = await fetch("/api/profile/upload-photo", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setUser((u) => u ? { ...u, photoPath: data.photoPath } : u);
    } catch { setError("Upload failed."); }
    finally { setPhotoUploading(false); }
  }

  async function uploadCv(file: File) {
    setCvUploading(true);
    const fd = new FormData();
    fd.append("cv", file);
    try {
      const res = await fetch("/api/profile/upload-cv", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setUser((u) => u ? { ...u, cvPath: data.cvPath } : u);
    } catch { setError("Upload failed."); }
    finally { setCvUploading(false); }
  }

  function addSkill(skill: string) {
    const s = skill.trim();
    if (s && user && !user.skills.includes(s)) {
      setUser((u) => u ? { ...u, skills: [...u.skills, s] } : u);
    }
    setSkillInput("");
  }

  function removeSkill(skill: string) {
    setUser((u) => u ? { ...u, skills: u.skills.filter((s) => s !== skill) } : u);
  }

  if (!user) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-700 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-blue-700 px-6 pt-10 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => router.back()} className="text-white/80"><ChevronLeft className="w-5 h-5" /></button>
          <h1 className="text-white font-bold text-xl">{isWelcome ? "Complete Your Profile" : "Edit Profile"}</h1>
        </div>
        {isWelcome && <p className="text-blue-200 text-sm">Add your photo and CV to start receiving job matches.</p>}
      </div>

      <div className="px-6 py-5 max-w-md mx-auto space-y-4">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

        {/* Photo Upload */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Profile Photo</h2>
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
              {user.photoPath ? (
                <Image src={user.photoPath} alt="Profile" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-slate-400">{user.name[0]}</span>
                </div>
              )}
              {photoUploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-2">JPG, PNG or WebP. Max 5MB.</p>
              <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadPhoto(e.target.files[0])} />
              <button
                onClick={() => photoRef.current?.click()}
                disabled={photoUploading}
                className="flex items-center gap-2 bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl active:scale-95 transition-transform disabled:opacity-60"
              >
                <Camera className="w-4 h-4" />
                {user.photoPath ? "Change Photo" : "Upload Photo"}
              </button>
            </div>
          </div>
        </div>

        {/* CV Upload */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">CV / Resume</h2>
          <div className={`border-2 border-dashed rounded-xl p-5 text-center transition-colors ${user.cvPath ? "border-green-300 bg-green-50" : "border-slate-200"}`}>
            {user.cvPath ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-sm font-semibold text-green-700">CV Uploaded</p>
                <p className="text-xs text-green-600">Your CV is ready to send</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-slate-400" />
                <p className="text-sm text-slate-500">PDF format only. Max 10MB.</p>
              </div>
            )}
            <input ref={cvRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => e.target.files?.[0] && uploadCv(e.target.files[0])} />
            <button
              onClick={() => cvRef.current?.click()}
              disabled={cvUploading}
              className="mt-3 flex items-center gap-2 mx-auto bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl active:scale-95 transition-transform disabled:opacity-60"
            >
              <Upload className="w-4 h-4" />
              {cvUploading ? "Uploading…" : user.cvPath ? "Replace CV" : "Upload CV (PDF)"}
            </button>
          </div>
        </div>

        {/* Personal Info */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Personal Information</h2>
          <div className="space-y-3">
            <Field label="Full Name" value={user.name} onChange={(v) => setUser((u) => u ? { ...u, name: v } : u)} />
            <Field label="Phone" value={user.phone || ""} onChange={(v) => setUser((u) => u ? { ...u, phone: v } : u)} type="tel" placeholder="+63 9XX XXX XXXX" />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
              <select
                value={user.city || ""}
                onChange={(e) => setUser((u) => u ? { ...u, city: e.target.value } : u)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select city</option>
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <Field label="Desired Position" value={user.desiredPosition || ""} onChange={(v) => setUser((u) => u ? { ...u, desiredPosition: v } : u)} placeholder="e.g. Software Engineer" />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Years of Experience</label>
              <select
                value={String(user.experienceYears ?? "")}
                onChange={(e) => setUser((u) => u ? { ...u, experienceYears: e.target.value ? parseInt(e.target.value) : undefined } : u)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                <option value="0">Fresh Graduate</option>
                <option value="1">1 year</option>
                <option value="2">2 years</option>
                <option value="3">3 years</option>
                <option value="5">5 years</option>
                <option value="7">7+ years</option>
                <option value="10">10+ years</option>
              </select>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Skills</h2>
          <div className="flex gap-2 mb-3">
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(skillInput); } }}
              placeholder="Type a skill…"
              className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={() => addSkill(skillInput)} className="bg-blue-700 text-white px-3 py-2.5 rounded-xl"><Plus className="w-4 h-4" /></button>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {SKILL_SUGGESTIONS.filter((s) => !user.skills.includes(s)).slice(0, 8).map((s) => (
              <button key={s} onClick={() => addSkill(s)} className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full border border-slate-200 active:bg-blue-100 active:text-blue-700">
                + {s}
              </button>
            ))}
          </div>

          {user.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {user.skills.map((s) => (
                <span key={s} className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  {s}
                  <button onClick={() => removeSkill(s)}><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={saveProfile}
          disabled={saving}
          className="w-full bg-blue-700 text-white font-bold py-4 rounded-2xl text-base flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-60"
        >
          {saved ? <><Check className="w-5 h-5" /> Saved!</> : saving ? "Saving…" : "Save Profile"}
        </button>
      </div>

      <MobileNav />
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
      />
    </div>
  );
}
