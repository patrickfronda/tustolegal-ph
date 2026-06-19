export interface Lawyer {
  id: string;
  name: string;
  initials: string;
  color: string;
  location: string;
  specialty: string[];
  experience: number;
  fee: string;
  phone: string;
  bio: string;
}

export const LAWYERS: Lawyer[] = [
  {
    id: "1",
    name: "Atty. Maria Santos",
    initials: "MS",
    color: "bg-pink-500",
    location: "Makati City",
    specialty: ["Family Law", "Civil Law"],
    experience: 12,
    fee: "₱2,500/hr",
    phone: "09XX-XXX-XXXX",
    bio: "Specializes in annulment, custody, and civil disputes.",
  },
  {
    id: "2",
    name: "Atty. Jose Reyes",
    initials: "JR",
    color: "bg-blue-500",
    location: "Quezon City",
    specialty: ["Labor Law", "OFW Rights"],
    experience: 8,
    fee: "₱2,000/hr",
    phone: "09XX-XXX-XXXX",
    bio: "Handles illegal dismissal, NLRC cases, and OFW contract disputes.",
  },
  {
    id: "3",
    name: "Atty. Ana Cruz",
    initials: "AC",
    color: "bg-green-500",
    location: "Cebu City",
    specialty: ["Criminal Law", "Constitutional Law"],
    experience: 15,
    fee: "₱3,000/hr",
    phone: "09XX-XXX-XXXX",
    bio: "Criminal defense attorney with 15 years of courtroom experience.",
  },
  {
    id: "4",
    name: "Atty. Ramon dela Cruz",
    initials: "RC",
    color: "bg-orange-500",
    location: "Davao City",
    specialty: ["Property Law", "Civil Law"],
    experience: 10,
    fee: "₱1,800/hr",
    phone: "09XX-XXX-XXXX",
    bio: "Land titling, property disputes, and extrajudicial settlement specialist.",
  },
  {
    id: "5",
    name: "Atty. Liza Gomez",
    initials: "LG",
    color: "bg-purple-500",
    location: "Taguig City",
    specialty: ["Corporate Law", "Consumer Protection"],
    experience: 7,
    fee: "₱2,200/hr",
    phone: "09XX-XXX-XXXX",
    bio: "Business law, contracts, and consumer rights advocate.",
  },
  {
    id: "6",
    name: "Atty. Carlo Bautista",
    initials: "CB",
    color: "bg-teal-500",
    location: "Pasig City",
    specialty: ["Family Law", "Barangay Justice"],
    experience: 5,
    fee: "₱1,500/hr",
    phone: "09XX-XXX-XXXX",
    bio: "Family law practitioner and barangay mediation advocate.",
  },
];
