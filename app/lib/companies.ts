import type { Company, MatchResult } from "./types";

export const companies: Company[] = [
  {
    id: "accenture-ph",
    name: "Accenture Philippines",
    industry: "IT & Consulting",
    location: "Taguig, Metro Manila",
    description: "Global professional services company offering strategy, consulting, technology, and operations services.",
    recruitmentEmail: "careers.ph@accenture.com",
    website: "accenture.com",
    requiredSkills: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "SQL", "Cloud", "Agile", "Scrum"],
    jobCategories: ["Software Engineer", "IT Consultant", "Data Analyst", "Business Analyst", "Project Manager"],
    logoColor: "#a100ff",
  },
  {
    id: "ibm-ph",
    name: "IBM Philippines",
    industry: "IT & Technology",
    location: "Eastwood, Quezon City",
    description: "Technology and consulting company specializing in cloud, AI, and enterprise solutions.",
    recruitmentEmail: "phrecruits@ph.ibm.com",
    website: "ibm.com/ph-en",
    requiredSkills: ["Java", "Python", "Cloud", "AI", "Machine Learning", "Data Science", "Linux", "DevOps", "SQL"],
    jobCategories: ["Software Developer", "Cloud Engineer", "Data Scientist", "IT Specialist", "Business Analyst"],
    logoColor: "#0530ad",
  },
  {
    id: "concentrix-ph",
    name: "Concentrix Philippines",
    industry: "BPO & Customer Service",
    location: "Multiple locations, Metro Manila",
    description: "Global technology and services company specializing in customer experience solutions.",
    recruitmentEmail: "phcareers@concentrix.com",
    website: "concentrix.com",
    requiredSkills: ["Customer Service", "Communication", "English Proficiency", "MS Office", "CRM", "Problem Solving"],
    jobCategories: ["Customer Service Representative", "Technical Support", "Team Leader", "Quality Analyst", "Operations Manager"],
    logoColor: "#f37021",
  },
  {
    id: "teleperformance-ph",
    name: "Teleperformance Philippines",
    industry: "BPO & Customer Service",
    location: "Pasig City, Metro Manila",
    description: "World leader in outsourced customer experience management.",
    recruitmentEmail: "recruitment.ph@teleperformance.com",
    website: "teleperformance.com/ph-en",
    requiredSkills: ["Customer Service", "Sales", "English Proficiency", "Communication", "Computer Literacy", "Teamwork"],
    jobCategories: ["Customer Service Agent", "Sales Representative", "Technical Support Specialist", "Supervisor"],
    logoColor: "#004b87",
  },
  {
    id: "bdo-unibank",
    name: "BDO Unibank",
    industry: "Banking & Finance",
    location: "Mandaluyong, Metro Manila",
    description: "Philippines' largest bank by assets, offering comprehensive banking and financial services.",
    recruitmentEmail: "careers@bdo.com.ph",
    website: "bdo.com.ph",
    requiredSkills: ["Finance", "Accounting", "Banking", "Credit Analysis", "Risk Management", "MS Office", "Communication"],
    jobCategories: ["Bank Teller", "Loans Officer", "Financial Analyst", "Branch Manager", "Accountant", "Relationship Manager"],
    logoColor: "#003087",
  },
  {
    id: "bpi",
    name: "Bank of the Philippine Islands",
    industry: "Banking & Finance",
    location: "Makati, Metro Manila",
    description: "One of the oldest and largest banks in Southeast Asia.",
    recruitmentEmail: "recruitment@bpi.com.ph",
    website: "bpi.com.ph",
    requiredSkills: ["Finance", "Accounting", "Customer Service", "Risk Management", "Banking Operations", "Excel"],
    jobCategories: ["Financial Advisor", "Branch Operations", "Credit Analyst", "IT Specialist", "Marketing Officer"],
    logoColor: "#ce2027",
  },
  {
    id: "metrobank",
    name: "Metrobank",
    industry: "Banking & Finance",
    location: "BGC, Taguig",
    description: "Metropolitan Bank and Trust Company — trusted partner of enterprises and individuals.",
    recruitmentEmail: "careers@metrobank.com.ph",
    website: "metrobank.com.ph",
    requiredSkills: ["Finance", "Banking", "Accounting", "Sales", "Customer Relations", "Compliance"],
    jobCategories: ["Teller", "Relationship Manager", "Compliance Officer", "IT Analyst", "Human Resources"],
    logoColor: "#002b5c",
  },
  {
    id: "sm-group",
    name: "SM Group of Companies",
    industry: "Retail & Real Estate",
    location: "Pasay, Metro Manila",
    description: "Philippines' largest mall operator and one of the biggest conglomerates in Southeast Asia.",
    recruitmentEmail: "careers@smgroup.com.ph",
    website: "smgroup.com",
    requiredSkills: ["Retail Management", "Sales", "Customer Service", "Inventory Management", "Marketing", "Operations"],
    jobCategories: ["Retail Associate", "Store Manager", "Marketing Specialist", "Operations Supervisor", "HR Officer"],
    logoColor: "#0071ce",
  },
  {
    id: "ayala-corporation",
    name: "Ayala Corporation",
    industry: "Conglomerate & Real Estate",
    location: "Makati, Metro Manila",
    description: "One of the Philippines' oldest and most diversified conglomerates.",
    recruitmentEmail: "careers@ayala.com.ph",
    website: "ayala.com.ph",
    requiredSkills: ["Business Development", "Finance", "Project Management", "Strategy", "Operations", "Legal"],
    jobCategories: ["Business Analyst", "Finance Manager", "Project Manager", "Legal Counsel", "Corporate Planning"],
    logoColor: "#002855",
  },
  {
    id: "jollibee",
    name: "Jollibee Foods Corporation",
    industry: "Food & Beverage",
    location: "Pasig City, Metro Manila",
    description: "Philippines' largest fast-food chain and one of the largest in Asia.",
    recruitmentEmail: "careers@jollibee.com.ph",
    website: "jollibee.com.ph",
    requiredSkills: ["Food Service", "Customer Service", "Operations", "Supply Chain", "Marketing", "Management"],
    jobCategories: ["Restaurant Manager", "Quality Assurance", "Marketing Specialist", "Supply Chain Analyst", "HR Specialist"],
    logoColor: "#e21d2e",
  },
  {
    id: "san-miguel",
    name: "San Miguel Corporation",
    industry: "Manufacturing & FMCG",
    location: "Mandaluyong, Metro Manila",
    description: "The Philippines' largest conglomerate, with businesses in food, beverages, energy, and infrastructure.",
    recruitmentEmail: "careers@sanmiguel.com.ph",
    website: "sanmiguel.com.ph",
    requiredSkills: ["Manufacturing", "Engineering", "Supply Chain", "Finance", "Marketing", "Operations Management"],
    jobCategories: ["Engineer", "Finance Analyst", "Operations Manager", "Supply Chain Officer", "Marketing Manager"],
    logoColor: "#007a4d",
  },
  {
    id: "telus-international",
    name: "TELUS International Philippines",
    industry: "IT & BPO",
    location: "BGC, Taguig",
    description: "Provider of customer experience and IT services for global clients.",
    recruitmentEmail: "phrecruitment@telusinternational.com",
    website: "telusinternational.com",
    requiredSkills: ["IT Support", "Customer Service", "Technical Writing", "Software Testing", "Networking", "Communication"],
    jobCategories: ["IT Support Specialist", "Customer Experience Agent", "QA Tester", "Technical Writer", "Team Lead"],
    logoColor: "#4b286d",
  },
  {
    id: "sycip-salazar",
    name: "SyCip Salazar Hernandez & Gatmaitan",
    industry: "Legal Services",
    location: "Makati, Metro Manila",
    description: "One of the largest and most prominent law firms in the Philippines.",
    recruitmentEmail: "careers@syciplaw.com",
    website: "syciplaw.com",
    requiredSkills: ["Legal Research", "Philippine Law", "Contract Drafting", "Litigation", "Corporate Law", "Communication"],
    jobCategories: ["Associate Lawyer", "Legal Researcher", "Paralegal", "Corporate Attorney", "Tax Lawyer"],
    logoColor: "#1a3a5c",
  },
  {
    id: "pwc-ph",
    name: "PricewaterhouseCoopers Philippines",
    industry: "Accounting & Consulting",
    location: "BGC, Taguig",
    description: "Global professional services network offering audit, tax, and advisory services.",
    recruitmentEmail: "ph_careers@pwc.com",
    website: "pwc.com/ph",
    requiredSkills: ["Accounting", "Auditing", "Tax", "Finance", "Excel", "Analytical Thinking", "CPA"],
    jobCategories: ["Auditor", "Tax Consultant", "Financial Advisor", "Management Consultant", "Risk Specialist"],
    logoColor: "#e0301e",
  },
  {
    id: "deloitte-ph",
    name: "Deloitte Philippines",
    industry: "Accounting & Consulting",
    location: "Makati, Metro Manila",
    description: "One of the Big Four accounting organizations providing audit, consulting, and tax services.",
    recruitmentEmail: "phcareers@deloitte.com",
    website: "deloitte.com/ph",
    requiredSkills: ["Accounting", "Auditing", "Finance", "CPA", "Risk Management", "Tax", "MS Office"],
    jobCategories: ["Audit Associate", "Financial Consultant", "Risk Analyst", "Tax Specialist", "IT Auditor"],
    logoColor: "#86bc25",
  },
  {
    id: "globe-telecom",
    name: "Globe Telecom",
    industry: "Telecommunications",
    location: "BGC, Taguig",
    description: "Leading Philippine telecommunications provider offering mobile, broadband, and enterprise solutions.",
    recruitmentEmail: "recruitment@globe.com.ph",
    website: "globe.com.ph",
    requiredSkills: ["Telecommunications", "Network Engineering", "Customer Service", "IT", "Sales", "Marketing"],
    jobCategories: ["Network Engineer", "IT Specialist", "Sales Manager", "Marketing Analyst", "Customer Success Manager"],
    logoColor: "#0073cf",
  },
  {
    id: "pldt",
    name: "PLDT Inc.",
    industry: "Telecommunications",
    location: "Mandaluyong, Metro Manila",
    description: "Philippines' largest fixed-line telecommunications company.",
    recruitmentEmail: "careers@pldt.com",
    website: "pldt.com",
    requiredSkills: ["Telecommunications", "Network Administration", "IT Support", "Engineering", "Project Management"],
    jobCategories: ["Network Engineer", "IT Analyst", "Sales Executive", "Project Manager", "Operations Specialist"],
    logoColor: "#e60026",
  },
  {
    id: "maxicare",
    name: "Maxicare Healthcare Corporation",
    industry: "Healthcare",
    location: "Pasig City, Metro Manila",
    description: "Leading HMO provider in the Philippines offering healthcare solutions.",
    recruitmentEmail: "careers@maxicare.com.ph",
    website: "maxicare.com.ph",
    requiredSkills: ["Healthcare", "Nursing", "Medical", "Customer Service", "Claims Processing", "Medical Coding"],
    jobCategories: ["Nurse", "Medical Officer", "Claims Analyst", "Customer Relations", "Healthcare Administrator"],
    logoColor: "#009fe3",
  },
  {
    id: "unionbank",
    name: "UnionBank of the Philippines",
    industry: "Banking & Fintech",
    location: "Pasig City, Metro Manila",
    description: "One of the Philippines' fastest-growing digital banks.",
    recruitmentEmail: "careers@unionbankph.com",
    website: "unionbankph.com",
    requiredSkills: ["Banking", "Finance", "Software Development", "Data Analytics", "Cybersecurity", "Digital Banking"],
    jobCategories: ["Software Developer", "Data Analyst", "Digital Banking Specialist", "Cybersecurity Analyst", "Product Manager"],
    logoColor: "#f26522",
  },
  {
    id: "ayala-land",
    name: "Ayala Land Inc.",
    industry: "Real Estate",
    location: "Makati, Metro Manila",
    description: "Philippines' leading property developer with residential, commercial, and hospitality projects.",
    recruitmentEmail: "careers@ayalaland.com.ph",
    website: "ayalaland.com.ph",
    requiredSkills: ["Real Estate", "Property Management", "Sales", "Architecture", "Civil Engineering", "Project Management"],
    jobCategories: ["Real Estate Agent", "Project Manager", "Architect", "Property Specialist", "Leasing Manager"],
    logoColor: "#009a44",
  },
];

export function matchCompanies(skills: string[], desiredPosition: string): MatchResult[] {
  const userSkillsLower = skills.map((s) => s.toLowerCase());
  const positionLower = desiredPosition.toLowerCase();

  const results: MatchResult[] = companies.map((company) => {
    const requiredLower = company.requiredSkills.map((s) => s.toLowerCase());
    const categoriesLower = company.jobCategories.map((c) => c.toLowerCase());

    const matchedSkills = company.requiredSkills.filter((skill) =>
      userSkillsLower.some(
        (us) => us.includes(skill.toLowerCase()) || skill.toLowerCase().includes(us)
      )
    );

    const skillScore = requiredLower.length > 0
      ? (matchedSkills.length / requiredLower.length) * 70
      : 0;

    const positionScore = categoriesLower.some(
      (cat) => cat.includes(positionLower) || positionLower.includes(cat.split(" ")[0])
    )
      ? 30
      : 0;

    const score = Math.min(100, Math.round(skillScore + positionScore));

    return { company, score, matchedSkills };
  });

  return results
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);
}
