import { ArrowRight, ShieldCheck, Users, BookOpen } from "lucide-react";

const stats = [
  { icon: ShieldCheck, value: "1987", label: "Konstitusyon ng Pilipinas" },
  { icon: Users, value: "114M+", label: "Mga Pilipinong Poprotektahan" },
  { icon: BookOpen, value: "50+", label: "Mga Larangan ng Batas" },
];

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-[#1e3a7b] via-[#1a3370] to-[#0e2456] text-white overflow-hidden">
      {/* Decorative sun rays */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "repeating-conic-gradient(from 0deg at 50% 100%, transparent 0deg, rgba(252,209,22,0.3) 10deg, transparent 20deg)",
        }}
      />

      {/* Philippine flag stripe accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0038a8] via-[#fcd116] to-[#ce1126]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm text-blue-200 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#fcd116] animate-pulse" />
              Nakatuon sa batas ng Pilipinas
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Ang Batas ay
              <br />
              <span className="text-[#fcd116]">Para sa Lahat</span>
            </h1>

            <p className="text-blue-100 text-lg leading-relaxed mb-4 max-w-lg">
              Huwag nang malito sa iyong legal na kalagayan.{" "}
              <strong className="text-white">Torny.ai</strong> ay nagbibigay ng libreng gabay
              batay sa mga batas ng Pilipinas — mula sa usapin ng pamilya, trabaho, krimen,
              ari-arian, at higit pa.
            </p>

            <p className="text-blue-300 text-sm mb-8 max-w-lg">
              <em>
                We provide free legal guidance based on Philippine law — covering family, labor,
                criminal, property, and more.
              </em>
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#inquiry"
                className="flex items-center justify-center gap-2 bg-[#fcd116] text-[#1e3a7b] px-6 py-3.5 rounded-full font-bold text-base hover:bg-yellow-300 transition shadow-lg shadow-yellow-500/20"
              >
                Magtanong ng Libreng Gabay
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#topics"
                className="flex items-center justify-center gap-2 border border-white/30 text-white px-6 py-3.5 rounded-full font-semibold text-base hover:bg-white/10 transition"
              >
                Tingnan ang mga Larangan ng Batas
              </a>
            </div>
          </div>

          {/* Right: stat cards */}
          <div className="grid grid-cols-1 gap-4">
            {stats.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex items-center gap-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5"
              >
                <div className="w-12 h-12 rounded-xl bg-[#fcd116]/20 border border-[#fcd116]/30 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-[#fcd116]" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-white">{value}</div>
                  <div className="text-blue-200 text-sm">{label}</div>
                </div>
              </div>
            ))}

            <div className="bg-[#ce1126]/20 border border-[#ce1126]/30 rounded-2xl p-5">
              <p className="text-sm text-blue-100 leading-relaxed">
                <strong className="text-[#fcd116]">Paalala:</strong> Ang impormasyong ibinibigay
                dito ay para sa pangkalahatang kaalaman lamang at hindi kapalit ng propesyonal na
                legal na payo. Para sa mga kumplikadong kaso, kumonsulta sa isang abogado o sa{" "}
                <strong>Public Attorney's Office (PAO)</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
