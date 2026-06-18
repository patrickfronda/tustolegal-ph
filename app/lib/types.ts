export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  city?: string;
  desiredPosition?: string;
  experienceYears?: number;
  skills: string[];
  photoPath?: string;
  cvPath?: string;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  description: string;
  recruitmentEmail: string;
  website: string;
  requiredSkills: string[];
  jobCategories: string[];
  logoColor: string;
}

export interface Application {
  id: string;
  userId: string;
  companyId: string;
  companyName: string;
  companyIndustry: string;
  jobTitle: string;
  sentAt: string;
  status: "sent" | "failed";
}

export interface MatchResult {
  company: Company;
  score: number;
  matchedSkills: string[];
}
