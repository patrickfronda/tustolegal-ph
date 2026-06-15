import {
  Heart,
  Briefcase,
  Shield,
  Home,
  ShoppingCart,
  FileText,
  Flag,
  Users,
} from "lucide-react";

const topics = [
  {
    icon: Heart,
    title: "Batas sa Pamilya",
    subtitle: "Family Law",
    color: "bg-rose-50 border-rose-200",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    items: [
      "Pagpapawalang-bisa ng kasal (Annulment)",
      "Legal na paghihiwalay (Legal Separation)",
      "Suporta sa anak (Child Support)",
      "VAWC — RA 9262",
      "Pag-ampon (Adoption)",
      "Guardianship",
    ],
  },
  {
    icon: Briefcase,
    title: "Batas sa Paggawa",
    subtitle: "Labor Law",
    color: "bg-blue-50 border-blue-200",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    items: [
      "Ilegal na pagpapaalis (Illegal Dismissal)",
      "13th Month Pay — PD 851",
      "Reklamo sa DOLE / NLRC",
      "Kontrata at regularisasyon",
      "Karapatan ng OFW",
      "Sexual Harassment — RA 7877",
    ],
  },
  {
    icon: Shield,
    title: "Batas Kriminal",
    subtitle: "Criminal Law",
    color: "bg-purple-50 border-purple-200",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    items: [
      "Revised Penal Code",
      "Karapatan ng akusado (Miranda Rights)",
      "Piyansa (Bail)",
      "Estafa at Cybercrime — RA 10175",
      "Reklamo sa Ombudsman",
      "Parole at Probation",
    ],
  },
  {
    icon: Home,
    title: "Batas sa Ari-arian",
    subtitle: "Property Law",
    color: "bg-green-50 border-green-200",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    items: [
      "Titulo ng lupa (Land Title / TCT)",
      "Mana at Pagmamana (Inheritance)",
      "Usapin sa DENR",
      "Extrajudicial Settlement",
      "Rent Control — RA 9653",
      "Pagpapaalis ng nangungupahan (Ejectment)",
    ],
  },
  {
    icon: ShoppingCart,
    title: "Proteksyon ng Mamimili",
    subtitle: "Consumer Protection",
    color: "bg-orange-50 border-orange-200",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    items: [
      "Consumer Act — RA 7394",
      "Reklamo sa DTI",
      "Online fraud at scam",
      "Warranty at refund",
      "Misleading advertising",
      "Data Privacy — RA 10173",
    ],
  },
  {
    icon: FileText,
    title: "Batas Sibil",
    subtitle: "Civil Law",
    color: "bg-teal-50 border-teal-200",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
    items: [
      "Kontrata (Contracts)",
      "Pagbabayad ng pinsala (Damages)",
      "Small Claims Court",
      "Utang at koleksyon (Debt)",
      "Pinagsamang ari-arian (Co-ownership)",
      "Prescription ng aksyon",
    ],
  },
  {
    icon: Flag,
    title: "Konstitusyonal na Karapatan",
    subtitle: "Constitutional Rights",
    color: "bg-yellow-50 border-yellow-200",
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    items: [
      "Bill of Rights (Art. III, 1987 Konstitusyon)",
      "Due Process",
      "Equal Protection",
      "Freedom of Expression",
      "Right to Privacy",
      "Habeas Corpus",
    ],
  },
  {
    icon: Users,
    title: "Katarungang Pambarangay",
    subtitle: "Barangay Justice",
    color: "bg-indigo-50 border-indigo-200",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    items: [
      "Lupong Tagapamayapa",
      "Pagpapamagitan (Mediation)",
      "Conciliation",
      "Pangkalahatang proseso (RA 7160)",
      "Mga kaso na kinakailangan",
      "Certificate to File Action",
    ],
  },
];

export default function LegalTopics() {
  return (
    <section id="topics" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block bg-[#1e3a7b]/10 text-[#1e3a7b] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Mga Larangan ng Batas
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Anong uri ng legal na tulong ang kailangan mo?
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Saklaw namin ang mahahalagang larangan ng batas sa Pilipinas. I-click ang larangan na
            angkop sa iyong sitwasyon para matuto pa.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {topics.map((topic) => {
            const Icon = topic.icon;
            return (
              <div
                key={topic.title}
                className={`rounded-2xl border p-5 ${topic.color} hover:shadow-md transition-shadow cursor-default`}
              >
                <div className={`w-11 h-11 rounded-xl ${topic.iconBg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${topic.iconColor}`} />
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-0.5">{topic.title}</h3>
                <p className="text-xs text-gray-400 italic mb-3">{topic.subtitle}</p>
                <ul className="space-y-1.5">
                  {topic.items.map((item) => (
                    <li key={item} className="flex items-start gap-1.5 text-sm text-gray-600">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
