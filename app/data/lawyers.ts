export type Specialty =
  | "Family Law"
  | "Labor Law"
  | "Criminal Law"
  | "Property Law"
  | "Civil Law"
  | "Constitutional Law"
  | "OFW Rights"
  | "Consumer Protection"
  | "Corporate Law"
  | "Barangay Justice";

export interface Lawyer {
  id: string;
  name: string;
  specialty: Specialty[];
  location: string;
  experience: number;
  fee: string;
  phone: string;
  email: string;
  bio: string;
  initials: string;
  color: string;
}

export const LAWYERS: Lawyer[] = [
  {
    id: "1",
    name: "Atty. Maria Santos",
    specialty: ["Family Law", "Civil Law"],
    location: "Makati City",
    experience: 12,
    fee: "₱3,000 / hour",
    phone: "+63 917 123 4567",
    email: "m.santos@lawoffice.ph",
    bio: "Specializes in annulment, legal separation, child custody, and VAWC cases. IBP member since 2012.",
    initials: "MS",
    color: "bg-pink-500",
  },
  {
    id: "2",
    name: "Atty. Jose Reyes",
    specialty: ["Labor Law", "OFW Rights"],
    location: "Quezon City",
    experience: 8,
    fee: "₱2,500 / hour",
    phone: "+63 918 234 5678",
    email: "j.reyes@laborlaw.ph",
    bio: "Expert in illegal dismissal, NLRC cases, and OFW contract disputes. Free initial consultation.",
    initials: "JR",
    color: "bg-blue-500",
  },
  {
    id: "3",
    name: "Atty. Ana Cruz",
    specialty: ["Criminal Law", "Constitutional Law"],
    location: "Manila",
    experience: 15,
    fee: "₱4,000 / hour",
    phone: "+63 919 345 6789",
    email: "a.cruz@criminaldefense.ph",
    bio: "Former public prosecutor turned defense lawyer. Handles criminal cases, bail applications, and human rights cases.",
    initials: "AC",
    color: "bg-red-500",
  },
  {
    id: "4",
    name: "Atty. Pedro Dela Cruz",
    specialty: ["Property Law", "Civil Law"],
    location: "Cebu City",
    experience: 10,
    fee: "₱2,000 / hour",
    phone: "+63 920 456 7890",
    email: "p.delacruz@propertylaw.ph",
    bio: "Land title disputes, extrajudicial settlements, and real estate transactions in Visayas and Mindanao.",
    initials: "PD",
    color: "bg-green-500",
  },
  {
    id: "5",
    name: "Atty. Liza Ramos",
    specialty: ["OFW Rights", "Labor Law", "Family Law"],
    location: "Pasig City",
    experience: 7,
    fee: "₱2,000 / hour",
    phone: "+63 921 567 8901",
    email: "l.ramos@ofw-legal.ph",
    bio: "Dedicated to protecting OFW rights abroad and their families in the Philippines. POEA-accredited.",
    initials: "LR",
    color: "bg-orange-500",
  },
  {
    id: "6",
    name: "Atty. Ramon Bautista",
    specialty: ["Corporate Law", "Civil Law", "Consumer Protection"],
    location: "BGC, Taguig",
    experience: 18,
    fee: "₱5,000 / hour",
    phone: "+63 922 678 9012",
    email: "r.bautista@corporate.ph",
    bio: "Senior partner with expertise in corporate law, contracts, and consumer protection cases.",
    initials: "RB",
    color: "bg-purple-500",
  },
  {
    id: "7",
    name: "Atty. Grace Villanueva",
    specialty: ["Family Law", "Barangay Justice"],
    location: "Davao City",
    experience: 6,
    fee: "₱1,500 / hour",
    phone: "+63 923 789 0123",
    email: "g.villanueva@mindanaolegal.ph",
    bio: "Accessible legal services in Mindanao. Handles family disputes, barangay conciliation, and VAWC.",
    initials: "GV",
    color: "bg-teal-500",
  },
  {
    id: "8",
    name: "Atty. Carlos Mendoza",
    specialty: ["Criminal Law", "Labor Law"],
    location: "Pasay City",
    experience: 9,
    fee: "₱3,000 / hour",
    phone: "+63 924 890 1234",
    email: "c.mendoza@defense.ph",
    bio: "Handles criminal defense and labor disputes. Former NLRC arbiter with deep knowledge of labor standards.",
    initials: "CM",
    color: "bg-indigo-500",
  },
];

const KEYWORD_MAP: { patterns: RegExp; specialties: Specialty[] }[] = [
  {
    patterns: /annulment|custody|child support|family|marriage|spouse|vawc|violence against women|separation|adoption|support/i,
    specialties: ["Family Law"],
  },
  {
    patterns: /dismissal|employer|employee|labor|wage|overtime|dole|nlrc|work|fired|resign|kasambahay|13th month/i,
    specialties: ["Labor Law"],
  },
  {
    patterns: /arrested|crime|criminal|police|bail|murder|theft|estafa|accused|detention|warrant|drug|cybercrime/i,
    specialties: ["Criminal Law"],
  },
  {
    patterns: /land|property|title|deed|lot|real estate|register of deeds|lupa|titulo/i,
    specialties: ["Property Law"],
  },
  {
    patterns: /ofw|overseas|abroad|poea|owwa|foreign|contract worker|migrant/i,
    specialties: ["OFW Rights"],
  },
  {
    patterns: /consumer|product|refund|scam|fraud|online shopping|defective/i,
    specialties: ["Consumer Protection"],
  },
  {
    patterns: /constitution|rights|human rights|due process|equal protection|habeas corpus/i,
    specialties: ["Constitutional Law"],
  },
  {
    patterns: /barangay|mediasyon|katarungan|pambarangay|conciliation/i,
    specialties: ["Barangay Justice"],
  },
  {
    patterns: /contract|obligation|debt|small claims|civil|damages/i,
    specialties: ["Civil Law"],
  },
];

export function detectSpecialties(text: string): Specialty[] {
  const found = new Set<Specialty>();
  for (const { patterns, specialties } of KEYWORD_MAP) {
    if (patterns.test(text)) specialties.forEach((s) => found.add(s));
  }
  return found.size > 0 ? Array.from(found) : ["Civil Law"];
}

export function suggestLawyers(text: string, limit = 3): Lawyer[] {
  const specialties = detectSpecialties(text);
  const scored = LAWYERS.map((l) => ({
    lawyer: l,
    score: l.specialty.filter((s) => specialties.includes(s)).length,
  }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.length > 0
    ? scored.slice(0, limit).map((x) => x.lawyer)
    : LAWYERS.slice(0, limit);
}
