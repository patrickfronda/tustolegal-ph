import type { Company, MatchResult } from "./types";

export const companies: Company[] = [
  // Aviation & Aerospace
  {
    id: "emirates-group",
    name: "Emirates Group",
    industry: "Aviation & Aerospace",
    location: "Dubai, UAE",
    description: "One of the world's largest airlines and aviation services provider, operating across 150+ destinations globally.",
    recruitmentEmail: "careers@ekgroup.com",
    website: "ekgroup.com",
    requiredSkills: ["Customer Service", "Aviation", "English Proficiency", "Hospitality", "Safety Management", "Operations", "Communication"],
    jobCategories: ["Cabin Crew", "Ground Operations", "IT Specialist", "Finance Analyst", "Customer Service Agent", "Engineer"],
    logoColor: "#d4181e",
  },
  {
    id: "etihad-airways",
    name: "Etihad Airways",
    industry: "Aviation & Aerospace",
    location: "Abu Dhabi, UAE",
    description: "The national airline of the UAE, connecting Abu Dhabi to over 70 destinations worldwide.",
    recruitmentEmail: "careers@etihad.ae",
    website: "etihad.com",
    requiredSkills: ["Customer Service", "Aviation", "Hospitality", "English Proficiency", "Arabic", "Operations Management"],
    jobCategories: ["Cabin Crew", "Pilot", "Airport Operations", "Finance Manager", "IT Analyst", "HR Specialist"],
    logoColor: "#c8a96e",
  },
  {
    id: "flydubai",
    name: "flydubai",
    industry: "Aviation & Low-Cost Carrier",
    location: "Dubai, UAE",
    description: "Dubai's home-grown airline offering affordable travel across 95+ destinations.",
    recruitmentEmail: "recruitment@flydubai.com",
    website: "flydubai.com",
    requiredSkills: ["Customer Service", "Aviation", "Communication", "English Proficiency", "Teamwork", "Problem Solving"],
    jobCategories: ["Cabin Crew", "Airport Agent", "Operations Supervisor", "Revenue Management Analyst"],
    logoColor: "#e84c0e",
  },

  // Banking & Finance
  {
    id: "emirates-nbd",
    name: "Emirates NBD",
    industry: "Banking & Finance",
    location: "Dubai, UAE",
    description: "One of the largest banking groups in the MENAT region with over 900 branches and ATMs.",
    recruitmentEmail: "careers@emiratesnbd.com",
    website: "emiratesnbd.com",
    requiredSkills: ["Banking", "Finance", "Customer Service", "Sales", "Risk Management", "Excel", "Arabic", "Communication"],
    jobCategories: ["Relationship Manager", "Financial Analyst", "Credit Officer", "IT Specialist", "Branch Manager", "Compliance Officer"],
    logoColor: "#ffd100",
  },
  {
    id: "fab",
    name: "First Abu Dhabi Bank (FAB)",
    industry: "Banking & Finance",
    location: "Abu Dhabi, UAE",
    description: "The UAE's largest bank and one of the world's largest financial institutions by assets.",
    recruitmentEmail: "careers@bankfab.com",
    website: "bankfab.com",
    requiredSkills: ["Finance", "Banking", "Risk Management", "Accounting", "CFA", "Excel", "Corporate Banking"],
    jobCategories: ["Corporate Banker", "Treasury Analyst", "Risk Manager", "Digital Banking Specialist", "Wealth Manager"],
    logoColor: "#00529b",
  },
  {
    id: "mashreq-bank",
    name: "Mashreq Bank",
    industry: "Banking & Fintech",
    location: "Dubai, UAE",
    description: "Leading financial institution in the UAE, a pioneer in digital banking innovation.",
    recruitmentEmail: "careers@mashreq.com",
    website: "mashreq.com",
    requiredSkills: ["Banking", "Finance", "Digital Banking", "JavaScript", "Data Analytics", "Customer Service", "Sales"],
    jobCategories: ["Software Developer", "Financial Analyst", "Data Scientist", "Relationship Manager", "Product Manager"],
    logoColor: "#e30613",
  },
  {
    id: "adcb",
    name: "Abu Dhabi Commercial Bank (ADCB)",
    industry: "Banking & Finance",
    location: "Abu Dhabi, UAE",
    description: "One of the largest banks in the UAE serving retail, corporate, and government clients.",
    recruitmentEmail: "recruitment@adcb.com",
    website: "adcb.com",
    requiredSkills: ["Banking", "Finance", "Credit Analysis", "Customer Relations", "Compliance", "MS Office"],
    jobCategories: ["Credit Analyst", "Relationship Manager", "Operations Specialist", "Compliance Officer", "HR Officer"],
    logoColor: "#004990",
  },

  // Oil & Gas & Energy
  {
    id: "adnoc",
    name: "ADNOC Group",
    industry: "Oil & Gas & Energy",
    location: "Abu Dhabi, UAE",
    description: "Abu Dhabi National Oil Company — one of the world's leading energy producers and distributors.",
    recruitmentEmail: "careers@adnoc.ae",
    website: "adnoc.ae",
    requiredSkills: ["Oil & Gas", "Chemical Engineering", "Petroleum Engineering", "HSE", "Project Management", "Operations", "Data Analysis"],
    jobCategories: ["Petroleum Engineer", "Chemical Engineer", "HSE Officer", "Project Manager", "Process Engineer", "IT Specialist"],
    logoColor: "#009d49",
  },
  {
    id: "dewa",
    name: "Dubai Electricity & Water Authority (DEWA)",
    industry: "Utilities & Energy",
    location: "Dubai, UAE",
    description: "Dubai's government utility providing electricity and water to over 3 million customers.",
    recruitmentEmail: "careers@dewa.gov.ae",
    website: "dewa.gov.ae",
    requiredSkills: ["Electrical Engineering", "Civil Engineering", "Project Management", "Operations", "Sustainability", "Arabic"],
    jobCategories: ["Electrical Engineer", "Civil Engineer", "Project Manager", "Renewable Energy Specialist", "IT Analyst"],
    logoColor: "#00853f",
  },

  // Real Estate & Construction
  {
    id: "emaar",
    name: "Emaar Properties",
    industry: "Real Estate & Development",
    location: "Dubai, UAE",
    description: "One of the world's largest real estate developers, creator of the Burj Khalifa and Dubai Mall.",
    recruitmentEmail: "careers@emaar.ae",
    website: "emaar.com",
    requiredSkills: ["Real Estate", "Project Management", "Architecture", "Civil Engineering", "Sales", "Marketing", "Finance"],
    jobCategories: ["Project Manager", "Real Estate Agent", "Architect", "Sales Manager", "Marketing Specialist", "Finance Analyst"],
    logoColor: "#e8b000",
  },
  {
    id: "aldar",
    name: "Aldar Properties",
    industry: "Real Estate & Development",
    location: "Abu Dhabi, UAE",
    description: "Abu Dhabi's leading real estate developer with iconic projects across the UAE.",
    recruitmentEmail: "recruitment@aldar.com",
    website: "aldar.com",
    requiredSkills: ["Real Estate", "Architecture", "Project Management", "Sales", "Property Management", "Finance"],
    jobCategories: ["Development Manager", "Sales Executive", "Architect", "Property Manager", "Finance Manager"],
    logoColor: "#004e97",
  },

  // Hospitality & Tourism
  {
    id: "jumeirah-group",
    name: "Jumeirah Group",
    industry: "Hospitality & Tourism",
    location: "Dubai, UAE",
    description: "World-class luxury hospitality company managing iconic hotels including Burj Al Arab.",
    recruitmentEmail: "careers@jumeirah.com",
    website: "jumeirah.com",
    requiredSkills: ["Hospitality", "Customer Service", "F&B", "Housekeeping", "Hotel Management", "English Proficiency", "Arabic"],
    jobCategories: ["Chef", "Front Office Manager", "Guest Relations", "F&B Manager", "Concierge", "Revenue Manager"],
    logoColor: "#c4922a",
  },
  {
    id: "rotana-hotels",
    name: "Rotana Hotels & Resorts",
    industry: "Hospitality & Tourism",
    location: "Abu Dhabi, UAE",
    description: "Leading hotel management company with properties across the Middle East, Africa, and Europe.",
    recruitmentEmail: "careers@rotana.com",
    website: "rotana.com",
    requiredSkills: ["Hospitality", "Customer Service", "Hotel Management", "F&B", "English Proficiency", "Communication"],
    jobCategories: ["Hotel Manager", "F&B Supervisor", "Sales Executive", "Marketing Manager", "Chef", "Finance Officer"],
    logoColor: "#8b1a2b",
  },

  // Retail & Consumer
  {
    id: "majid-al-futtaim",
    name: "Majid Al Futtaim",
    industry: "Retail & Real Estate",
    location: "Dubai, UAE",
    description: "Leading shopping mall, community, and real estate developer across 17 countries.",
    recruitmentEmail: "careers@maf.ae",
    website: "majidalfuttaim.com",
    requiredSkills: ["Retail Management", "Customer Service", "Sales", "Operations", "Marketing", "Finance", "Project Management"],
    jobCategories: ["Retail Manager", "Operations Supervisor", "Marketing Specialist", "Finance Analyst", "HR Manager"],
    logoColor: "#d4273c",
  },
  {
    id: "alshaya-group",
    name: "Alshaya Group",
    industry: "Retail & Franchising",
    location: "Dubai, UAE",
    description: "One of the world's leading franchise operators managing 90+ brands across 60+ countries.",
    recruitmentEmail: "careers@alshaya.com",
    website: "alshaya.com",
    requiredSkills: ["Retail", "Customer Service", "Sales", "Visual Merchandising", "Supply Chain", "HR", "Finance"],
    jobCategories: ["Store Manager", "Visual Merchandiser", "Sales Associate", "Supply Chain Officer", "HR Specialist"],
    logoColor: "#1a1a1a",
  },
  {
    id: "noon",
    name: "Noon.com",
    industry: "E-Commerce & Technology",
    location: "Dubai, UAE",
    description: "The Middle East's homegrown e-commerce platform connecting millions of customers to products.",
    recruitmentEmail: "careers@noon.com",
    website: "noon.com",
    requiredSkills: ["E-Commerce", "JavaScript", "Python", "Data Analysis", "Marketing", "Operations", "Logistics", "SQL"],
    jobCategories: ["Software Engineer", "Data Analyst", "Marketing Manager", "Operations Specialist", "Product Manager"],
    logoColor: "#feee00",
  },

  // Technology & Telecom
  {
    id: "etisalat-e",
    name: "e& (Etisalat)",
    industry: "Telecommunications & Technology",
    location: "Abu Dhabi, UAE",
    description: "One of the largest telecom groups globally, operating in 16 countries across the Middle East, Asia, and Africa.",
    recruitmentEmail: "recruitment@etisalat.ae",
    website: "etisalat.ae",
    requiredSkills: ["Telecommunications", "Network Engineering", "5G", "Cloud", "Software Development", "Data Analytics", "Cybersecurity"],
    jobCategories: ["Network Engineer", "Software Developer", "Data Scientist", "Cybersecurity Analyst", "Product Manager"],
    logoColor: "#008000",
  },
  {
    id: "du-telecom",
    name: "du (EITC)",
    industry: "Telecommunications",
    location: "Dubai, UAE",
    description: "UAE's second telecom operator providing mobile, broadband, and TV services to millions.",
    recruitmentEmail: "careers@du.ae",
    website: "du.ae",
    requiredSkills: ["Telecommunications", "Customer Service", "Network Administration", "IT", "Sales", "Marketing"],
    jobCategories: ["Network Engineer", "IT Analyst", "Customer Service Manager", "Sales Executive", "Marketing Specialist"],
    logoColor: "#ee3124",
  },

  // Consulting & Professional Services
  {
    id: "pwc-me",
    name: "PwC Middle East",
    industry: "Consulting & Accounting",
    location: "Dubai, UAE",
    description: "Global professional services firm offering assurance, tax, and advisory services across the Middle East.",
    recruitmentEmail: "me_careers@pwc.com",
    website: "pwc.com/m1/en",
    requiredSkills: ["Accounting", "Auditing", "Tax", "Finance", "CPA", "ACCA", "Excel", "Analytical Thinking"],
    jobCategories: ["Auditor", "Tax Consultant", "Management Consultant", "Risk Specialist", "Financial Advisor"],
    logoColor: "#e0301e",
  },
  {
    id: "deloitte-me",
    name: "Deloitte Middle East",
    industry: "Consulting & Accounting",
    location: "Dubai, UAE",
    description: "One of the Big Four firms with extensive operations across 20+ Middle East countries.",
    recruitmentEmail: "mecareers@deloitte.com",
    website: "deloitte.com/xe",
    requiredSkills: ["Consulting", "Finance", "Accounting", "ACCA", "CPA", "Risk Management", "Data Analytics", "Strategy"],
    jobCategories: ["Strategy Consultant", "Financial Advisor", "Risk Analyst", "Tax Specialist", "Technology Consultant"],
    logoColor: "#86bc25",
  },
  {
    id: "kpmg-me",
    name: "KPMG Lower Gulf",
    industry: "Consulting & Accounting",
    location: "Dubai, UAE",
    description: "Leading audit, tax, and advisory firm serving businesses across the UAE and Oman.",
    recruitmentEmail: "uaecareers@kpmg.com",
    website: "kpmg.com/ae",
    requiredSkills: ["Auditing", "Finance", "Accounting", "ACCA", "Tax", "Risk Advisory", "Due Diligence"],
    jobCategories: ["Audit Associate", "Tax Consultant", "Risk Advisor", "Deal Advisory Analyst", "IT Auditor"],
    logoColor: "#00338d",
  },

  // Legal Services
  {
    id: "al-tamimi",
    name: "Al Tamimi & Company",
    industry: "Legal Services",
    location: "Dubai, UAE",
    description: "The largest law firm in the Middle East with offices in 10+ countries.",
    recruitmentEmail: "careers@tamimi.com",
    website: "tamimi.com",
    requiredSkills: ["Legal Research", "Contract Drafting", "Corporate Law", "Litigation", "Banking Law", "English Proficiency", "Arabic"],
    jobCategories: ["Associate Lawyer", "Legal Counsel", "Paralegal", "Corporate Attorney", "Arbitration Specialist"],
    logoColor: "#1c3664",
  },
  {
    id: "clyde-co",
    name: "Clyde & Co",
    industry: "Legal Services",
    location: "Dubai, UAE",
    description: "Global law firm with a strong Middle East presence, known for insurance, trade, and infrastructure law.",
    recruitmentEmail: "merecruit@clydeco.com",
    website: "clydeco.com",
    requiredSkills: ["Insurance Law", "Commercial Law", "Construction Law", "Legal Research", "Litigation", "Communication"],
    jobCategories: ["Solicitor", "Legal Advisor", "Paralegal", "Construction Lawyer", "Insurance Counsel"],
    logoColor: "#005b99",
  },

  // Logistics & Supply Chain
  {
    id: "dp-world",
    name: "DP World",
    industry: "Logistics & Ports",
    location: "Dubai, UAE",
    description: "One of the world's largest port operators managing over 82 marine and inland terminals globally.",
    recruitmentEmail: "careers@dpworld.com",
    website: "dpworld.com",
    requiredSkills: ["Logistics", "Supply Chain", "Port Operations", "Engineering", "Project Management", "Finance", "IT"],
    jobCategories: ["Port Operations Manager", "Logistics Analyst", "Supply Chain Specialist", "Engineer", "IT Manager"],
    logoColor: "#e31937",
  },
  {
    id: "aramex",
    name: "Aramex",
    industry: "Logistics & Courier",
    location: "Dubai, UAE",
    description: "Leading global provider of comprehensive logistics and transportation solutions.",
    recruitmentEmail: "careers@aramex.com",
    website: "aramex.com",
    requiredSkills: ["Logistics", "Supply Chain", "Customer Service", "Operations", "IT", "Sales", "Warehouse Management"],
    jobCategories: ["Logistics Coordinator", "Courier Driver", "Operations Supervisor", "Sales Executive", "IT Analyst"],
    logoColor: "#e4002b",
  },

  // Healthcare
  {
    id: "mediclinic-me",
    name: "Mediclinic Middle East",
    industry: "Healthcare",
    location: "Dubai, UAE",
    description: "Leading private healthcare provider operating hospitals and clinics across the UAE.",
    recruitmentEmail: "recruitment@mediclinic.ae",
    website: "mediclinic.ae",
    requiredSkills: ["Nursing", "Medicine", "Healthcare", "Patient Care", "Clinical Research", "Medical Administration", "English Proficiency"],
    jobCategories: ["Nurse", "Doctor", "Medical Officer", "Pharmacist", "Healthcare Administrator", "Lab Technician"],
    logoColor: "#004f9f",
  },
  {
    id: "aster-dm",
    name: "Aster DM Healthcare",
    industry: "Healthcare",
    location: "Dubai, UAE",
    description: "One of the largest healthcare providers in the GCC with hospitals, clinics, and pharmacies.",
    recruitmentEmail: "careers@asterdmhealthcare.com",
    website: "asterdmhealthcare.com",
    requiredSkills: ["Healthcare", "Nursing", "Medicine", "Pharmacy", "Patient Management", "Communication", "Clinical Skills"],
    jobCategories: ["Registered Nurse", "General Practitioner", "Pharmacist", "Clinical Coordinator", "Medical Officer"],
    logoColor: "#007a4d",
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
