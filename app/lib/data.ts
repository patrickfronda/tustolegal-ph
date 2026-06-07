export const candidates = [
  { id: "candidate_a", name: "Maria Santos", party: "Progressive Alliance", color: "#3b82f6" },
  { id: "candidate_b", name: "Jose Reyes", party: "National Unity", color: "#ef4444" },
  { id: "candidate_c", name: "Ana Cruz", party: "People's Voice", color: "#f59e0b" },
];

export const pollHistory = [
  { date: "Jan", "Maria Santos": 28, "Jose Reyes": 35, "Ana Cruz": 18, Undecided: 19 },
  { date: "Feb", "Maria Santos": 31, "Jose Reyes": 33, "Ana Cruz": 20, Undecided: 16 },
  { date: "Mar", "Maria Santos": 34, "Jose Reyes": 31, "Ana Cruz": 21, Undecided: 14 },
  { date: "Apr", "Maria Santos": 37, "Jose Reyes": 30, "Ana Cruz": 19, Undecided: 14 },
  { date: "May", "Maria Santos": 40, "Jose Reyes": 29, "Ana Cruz": 18, Undecided: 13 },
  { date: "Jun", "Maria Santos": 43, "Jose Reyes": 28, "Ana Cruz": 17, Undecided: 12 },
];

export const regionalSupport = [
  { region: "National Capital", "Maria Santos": 48, "Jose Reyes": 29, "Ana Cruz": 16 },
  { region: "Luzon North", "Maria Santos": 38, "Jose Reyes": 35, "Ana Cruz": 18 },
  { region: "Luzon South", "Maria Santos": 41, "Jose Reyes": 30, "Ana Cruz": 20 },
  { region: "Visayas", "Maria Santos": 35, "Jose Reyes": 38, "Ana Cruz": 14 },
  { region: "Mindanao", "Maria Santos": 30, "Jose Reyes": 42, "Ana Cruz": 19 },
];

export const sentimentData = [
  { name: "Positive", value: 54, color: "#22c55e" },
  { name: "Neutral", value: 28, color: "#94a3b8" },
  { name: "Negative", value: 18, color: "#ef4444" },
];

export const keyIssues = [
  { issue: "Economy & Jobs", importance: 87, candidateScore: 72 },
  { issue: "Healthcare", importance: 82, candidateScore: 80 },
  { issue: "Education", importance: 78, candidateScore: 85 },
  { issue: "Public Safety", importance: 74, candidateScore: 65 },
  { issue: "Infrastructure", importance: 68, candidateScore: 70 },
  { issue: "Environment", importance: 55, candidateScore: 78 },
];

export const socialMetrics = [
  { platform: "Facebook", mentions: 142000, sentiment: 58, trend: "+12%" },
  { platform: "Twitter/X", mentions: 98000, sentiment: 52, trend: "+8%" },
  { platform: "TikTok", mentions: 215000, sentiment: 65, trend: "+34%" },
  { platform: "YouTube", mentions: 47000, sentiment: 70, trend: "+5%" },
];

export const voterDemographics = [
  { age: "18–24", support: 52, turnout: 42 },
  { age: "25–34", support: 58, turnout: 55 },
  { age: "35–44", support: 45, turnout: 68 },
  { age: "45–54", support: 40, turnout: 74 },
  { age: "55–64", support: 38, turnout: 78 },
  { age: "65+", support: 33, turnout: 82 },
];

export const recentEvents = [
  { date: "Jun 5", event: "Town Hall — Metro Manila", attendance: 4200, approval: "+2.1%" },
  { date: "Jun 3", event: "Debate #3 — National TV", viewers: "8.4M", approval: "+3.5%" },
  { date: "May 28", event: "Rally — Cebu City", attendance: 12500, approval: "+1.8%" },
  { date: "May 22", event: "Policy Launch — Healthcare", coverage: "National", approval: "+4.2%" },
];
