import { MessageSquare, Search, CheckCircle } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: MessageSquare,
    title: "Ilarawan ang iyong sitwasyon",
    description:
      "Punan ang simpleng form. Ibahagi ang iyong legal na katanungan o usapin nang detalyado. Maaaring Pilipino o English ang iyong sagot.",
  },
  {
    step: "02",
    icon: Search,
    title: "Suriin ng aming koponan",
    description:
      "Susuriin namin ang iyong tanong batay sa mga batas ng Pilipinas — Revised Penal Code, Family Code, Labor Code, at iba pa.",
  },
  {
    step: "03",
    icon: CheckCircle,
    title: "Tumanggap ng gabay",
    description:
      "Bibigyan ka namin ng malinaw na paliwanag, mga hakbang na maaari mong gawin, at kung kailan mo dapat kumonsulta sa abogado.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block bg-[#1e3a7b]/10 text-[#1e3a7b] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Paano Ito Gumagana
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Tatlong simpleng hakbang
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Ginawa namin itong simple at madaling gamitin — kahit wala kang kaalaman sa batas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* connector line (desktop) */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-[#1e3a7b]/20 via-[#1e3a7b]/40 to-[#1e3a7b]/20" />

          {steps.map(({ step, icon: Icon, title, description }) => (
            <div key={step} className="relative flex flex-col items-center text-center px-4">
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full bg-[#1e3a7b]/5 border-2 border-[#1e3a7b]/20 flex items-center justify-center">
                  <Icon className="w-10 h-10 text-[#1e3a7b]" />
                </div>
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#fcd116] text-[#1e3a7b] text-xs font-extrabold flex items-center justify-center shadow">
                  {step}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 bg-gradient-to-r from-[#1e3a7b] to-[#162d60] rounded-3xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-3">Handa ka na bang magsimula?</h3>
          <p className="text-blue-200 mb-6 max-w-lg mx-auto">
            Ang iyong tanong ay laging mahalaga. Hindi mo kailangan ng pera para magtanong —
            libreng-libre.
          </p>
          <a
            href="#inquiry"
            className="inline-block bg-[#fcd116] text-[#1e3a7b] px-8 py-3.5 rounded-full font-bold hover:bg-yellow-300 transition shadow-lg shadow-yellow-500/20"
          >
            Magsimula Ngayon — Libre
          </a>
        </div>
      </div>
    </section>
  );
}
