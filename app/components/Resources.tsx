import { ExternalLink, Phone, Globe } from "lucide-react";

const resources = [
  {
    name: "Public Attorney's Office (PAO)",
    description:
      "Nagbibigay ng libreng legal na tulong sa mga indigent na mamamayan. Tumawag o bumisita sa pinakamalapit na PAO office.",
    phone: "8524-2100",
    website: "pao.gov.ph",
    badge: "Libreng Abogado",
    badgeColor: "bg-green-100 text-green-700",
  },
  {
    name: "Integrated Bar of the Philippines (IBP)",
    description:
      "Ang pambansang organisasyon ng mga abogado sa Pilipinas. Nagbibigay ng referral sa mga abogado at legal aid.",
    phone: "8523-0481",
    website: "ibp.ph",
    badge: "Referral sa Abogado",
    badgeColor: "bg-blue-100 text-blue-700",
  },
  {
    name: "Department of Labor and Employment (DOLE)",
    description:
      "Para sa mga isyu sa paggawa, labor standards, at employment complaints. May SEnA (Single Entry Approach) para sa mediation.",
    phone: "1349",
    website: "dole.gov.ph",
    badge: "Labor Rights",
    badgeColor: "bg-purple-100 text-purple-700",
  },
  {
    name: "National Labor Relations Commission (NLRC)",
    description:
      "Nag-aayos ng mga reklamo sa pagitan ng employer at empleyado. Mag-file ng illegal dismissal at money claims dito.",
    phone: "8527-2521",
    website: "nlrc.dole.gov.ph",
    badge: "Illegal Dismissal",
    badgeColor: "bg-orange-100 text-orange-700",
  },
  {
    name: "Department of Justice (DOJ)",
    description:
      "Namamahala ng criminal justice system sa Pilipinas. Nagbibigay ng impormasyon ukol sa mga kriminal na kaso.",
    phone: "8523-8481",
    website: "doj.gov.ph",
    badge: "Criminal Justice",
    badgeColor: "bg-red-100 text-red-700",
  },
  {
    name: "Commission on Human Rights (CHR)",
    description:
      "Nagpoprotekta at nagtataguyod ng karapatang pantao. Mag-file ng reklamo laban sa paglabag ng mga karapatan.",
    phone: "8294-8704",
    website: "chr.gov.ph",
    badge: "Human Rights",
    badgeColor: "bg-yellow-100 text-yellow-700",
  },
  {
    name: "DSWD — Crisis Intervention Unit",
    description:
      "Para sa mga biktima ng VAWC, child abuse, at iba pang social welfare issues. May 24/7 na hotline.",
    phone: "8951-2803",
    website: "dswd.gov.ph",
    badge: "VAWC / Proteksyon",
    badgeColor: "bg-rose-100 text-rose-700",
  },
  {
    name: "Supreme Court E-Library",
    description:
      "Libreng access sa mga batas, jurisprudence, at desisyon ng Korte Suprema. Para sa self-research.",
    phone: "—",
    website: "elibrary.judiciary.gov.ph",
    badge: "Legal Research",
    badgeColor: "bg-indigo-100 text-indigo-700",
  },
];

export default function Resources() {
  return (
    <section id="resources" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block bg-[#1e3a7b]/10 text-[#1e3a7b] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Mga Mapagkukunan
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Opisyal na Ahensya at Legal na Mapagkukunan
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Direktang makipag-ugnayan sa mga opisyal na ahensya ng gobyerno para sa iyong legal na
            pangangailangan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {resources.map((r) => (
            <div
              key={r.name}
              className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${r.badgeColor}`}>
                  {r.badge}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-2">{r.name}</h3>
              <p className="text-gray-500 text-xs leading-relaxed mb-4 flex-1">{r.description}</p>
              <div className="space-y-1.5 pt-3 border-t border-gray-100">
                {r.phone !== "—" && (
                  <a
                    href={`tel:${r.phone}`}
                    className="flex items-center gap-2 text-xs text-[#1e3a7b] hover:underline font-medium"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {r.phone}
                  </a>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Globe className="w-3.5 h-3.5" />
                  <span>{r.website}</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Emergency numbers banner */}
        <div className="mt-10 bg-[#ce1126] rounded-2xl p-6 text-white text-center">
          <h3 className="font-bold text-lg mb-2">Mga Emergency Hotline</h3>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm">
            <span>
              <strong>911</strong> — Emergency (Pulis / Sunog / Ambulansya)
            </span>
            <span>
              <strong>163</strong> — Bantay Bata (Child Abuse Hotline)
            </span>
            <span>
              <strong>1343</strong> — NBI Hotline
            </span>
            <span>
              <strong>117</strong> — PNP Hotline
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
