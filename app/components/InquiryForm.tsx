"use client";
import { useState, FormEvent } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";

const legalCategories = [
  "Batas sa Pamilya (Family Law)",
  "Batas sa Paggawa (Labor Law)",
  "Batas Kriminal (Criminal Law)",
  "Batas sa Ari-arian (Property Law)",
  "Proteksyon ng Mamimili (Consumer Protection)",
  "Batas Sibil (Civil Law)",
  "Konstitusyonal na Karapatan (Constitutional Rights)",
  "Katarungang Pambarangay (Barangay Justice)",
  "Karapatan ng OFW",
  "Iba pa (Other)",
];

type Status = "idle" | "loading" | "success";

export default function InquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    language: "Filipino",
    situation: "",
    consent: false,
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const target = e.target;
    const value = target.type === "checkbox" ? (target as HTMLInputElement).checked : target.value;
    setForm((prev) => ({ ...prev, [target.name]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    // Simulate async submission
    setTimeout(() => setStatus("success"), 1800);
  }

  if (status === "success") {
    return (
      <section id="inquiry" className="py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-3xl shadow-xl p-12 border border-green-100">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Natanggap ang iyong tanong!</h3>
            <p className="text-gray-500 leading-relaxed mb-2">
              Salamat, <strong>{form.name}</strong>. Susuriin namin ang iyong katanungan at
              magpapadala ng tugon sa{" "}
              <strong>{form.email || form.phone}</strong> sa loob ng 24-48 na oras.
            </p>
            <p className="text-sm text-gray-400 mb-8">
              Para sa mga emergency na legal na sitwasyon, makipag-ugnayan agad sa PAO (8524-2100)
              o sa pinakamalapit na IBP chapter.
            </p>
            <button
              onClick={() => {
                setStatus("idle");
                setForm({
                  name: "",
                  email: "",
                  phone: "",
                  category: "",
                  language: "Filipino",
                  situation: "",
                  consent: false,
                });
              }}
              className="bg-[#1e3a7b] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#162d60] transition"
            >
              Magtanong Ulit
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="inquiry" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-10 items-start">
          {/* Left: info */}
          <div className="lg:col-span-2">
            <span className="inline-block bg-[#1e3a7b]/10 text-[#1e3a7b] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              Magtanong
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              May katanungan ka ba?
            </h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              Ibahagi ang iyong sitwasyon at tutulungan ka naming maunawaan ang iyong mga karapatan
              at opsyon ayon sa batas ng Pilipinas.
            </p>

            <div className="space-y-4">
              {[
                { title: "Confidential", body: "Ang lahat ng impormasyon ay lihim at ligtas." },
                { title: "Libreng Serbisyo", body: "Walang bayad na legal na gabay." },
                {
                  title: "Batay sa Batas ng Pilipinas",
                  body: "Lahat ng sagot ay nakabatay sa mga batas ng Pilipinas.",
                },
                {
                  title: "24-48 na Oras",
                  body: "Matatanggap mo ang aming tugon sa loob ng dalawang araw.",
                },
              ].map(({ title, body }) => (
                <div key={title} className="flex gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-[#fcd116] flex-shrink-0 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1e3a7b]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{title}</p>
                    <p className="text-gray-500 text-sm">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Pangalan <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Juan dela Cruz"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a7b]/20 focus:border-[#1e3a7b]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="juan@email.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a7b]/20 focus:border-[#1e3a7b]"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Numero ng Telepono
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+63 9XX XXX XXXX"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a7b]/20 focus:border-[#1e3a7b]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Wika ng Tugon
                  </label>
                  <select
                    name="language"
                    value={form.language}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a7b]/20 focus:border-[#1e3a7b] bg-white"
                  >
                    <option value="Filipino">Filipino</option>
                    <option value="English">English</option>
                    <option value="Bisaya">Bisaya / Cebuano</option>
                    <option value="Ilocano">Ilocano</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Uri ng Legal na Usapin <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  required
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a7b]/20 focus:border-[#1e3a7b] bg-white"
                >
                  <option value="">— Pumili ng kategorya —</option>
                  {legalCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Ilarawan ang iyong sitwasyon <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="situation"
                  required
                  value={form.situation}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Ilarawan nang detalyado ang iyong legal na sitwasyon o katanungan. Kasama rin ang mga petsa, pangalan ng partido, at anumang dokumentong mayroon ka..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a7b]/20 focus:border-[#1e3a7b] resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Minimum 50 karakter. Mas detalyado = mas magandang tugon.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="consent"
                  id="consent"
                  required
                  checked={form.consent}
                  onChange={handleChange}
                  className="mt-1 accent-[#1e3a7b]"
                />
                <label htmlFor="consent" className="text-sm text-gray-500">
                  Sumasang-ayon ako na ang impormasyong ibinibigay ko ay gagamitin lamang para sa
                  layunin ng legal na gabay at mananatiling kumpidensyal. Naiintindihan ko na ang
                  tugon ay hindi kapalit ng opisyal na legal na representasyon.
                </label>
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-[#1e3a7b] text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#162d60] transition disabled:opacity-70"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Isinasumite...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Isumite ang Tanong — Libre
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
