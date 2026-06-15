import { Scale, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0e1f44] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-4">
              <div className="w-9 h-9 rounded-full bg-[#fcd116] flex items-center justify-center">
                <Scale className="w-5 h-5 text-[#1e3a7b]" />
              </div>
              <span>
                Tusto<span className="text-[#fcd116]">Legal</span>{" "}
                <span className="text-blue-400 text-sm font-normal">PH</span>
              </span>
            </div>
            <p className="text-blue-300 text-sm leading-relaxed mb-4">
              Ang batas ay para sa lahat. Nagbibigay kami ng libreng legal na gabay na nakabatay sa
              mga batas ng Pilipinas para sa bawat Pilipino.
            </p>
            <div className="h-1 w-20 bg-gradient-to-r from-[#0038a8] via-[#fcd116] to-[#ce1126] rounded-full" />
          </div>

          {/* Legal areas */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-blue-300 mb-4">
              Mga Larangan ng Batas
            </h4>
            <ul className="space-y-2 text-sm text-blue-200">
              {[
                "Batas sa Pamilya",
                "Batas sa Paggawa",
                "Batas Kriminal",
                "Batas sa Ari-arian",
                "Proteksyon ng Mamimili",
                "Batas Sibil",
                "Konstitusyonal na Karapatan",
                "Katarungang Pambarangay",
              ].map((item) => (
                <li key={item}>
                  <a href="#topics" className="hover:text-[#fcd116] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-blue-300 mb-4">
              Mabilis na Link
            </h4>
            <ul className="space-y-2 text-sm text-blue-200">
              {[
                { label: "Magtanong ng Legal na Tulong", href: "#inquiry" },
                { label: "Mga Karaniwang Tanong (FAQ)", href: "#faq" },
                { label: "Opisyal na mga Ahensya", href: "#resources" },
                { label: "Paano Ito Gumagana", href: "#how-it-works" },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:text-[#fcd116] transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-blue-300 mb-4">
              Makipag-ugnayan
            </h4>
            <ul className="space-y-3 text-sm text-blue-200">
              <li className="flex gap-2.5">
                <Phone className="w-4 h-4 text-[#fcd116] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">PAO Hotline</p>
                  <p>8524-2100</p>
                </div>
              </li>
              <li className="flex gap-2.5">
                <Mail className="w-4 h-4 text-[#fcd116] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Email</p>
                  <p>tulong@tustolegal.ph</p>
                </div>
              </li>
              <li className="flex gap-2.5">
                <MapPin className="w-4 h-4 text-[#fcd116] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Serbisyo</p>
                  <p>Buong Pilipinas</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-blue-400">
          <p>© 2026 TustoLegal PH. Lahat ng karapatang nakalaan.</p>
          <p className="text-center">
            <strong className="text-yellow-400">Disclaimer:</strong> Ang impormasyong narito ay para
            sa pangkalahatang kaalaman lamang at hindi kapalit ng propesyonal na legal na payo.
          </p>
        </div>
      </div>
    </footer>
  );
}
