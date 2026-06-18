import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import type { User, Company } from "./types";

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
  });
}

export async function sendApplicationEmail(
  applicant: User,
  company: Company
): Promise<{ success: boolean; error?: string }> {
  const fromName = "TustoJobs ME";
  const fromEmail = process.env.SMTP_USER || "noreply@tustojobs.me";

  const subject = `Job Application – ${applicant.name} | ${applicant.desiredPosition || "Open Position"}`;

  const skillsList = applicant.skills.length > 0
    ? applicant.skills.map((s) => `• ${s}`).join("\n")
    : "• Available upon request";

  const body = `Dear ${company.name} Recruitment Team,

I am writing to express my interest in joining ${company.name} as a ${applicant.desiredPosition || "professional"}.

APPLICANT DETAILS
─────────────────
Name: ${applicant.name}
Email: ${applicant.email}
Phone: ${applicant.phone || "Not provided"}
Location: ${applicant.city || "Philippines"}
Experience: ${applicant.experienceYears ? `${applicant.experienceYears} year(s)` : "Not specified"}

SKILLS & EXPERTISE
──────────────────
${skillsList}

Please find attached my updated CV and profile photo for your review. I am eager to contribute to ${company.name}'s continued success and would welcome the opportunity to discuss how my background aligns with your team's needs.

Thank you for your time and consideration.

Warm regards,
${applicant.name}
${applicant.email}
${applicant.phone || ""}

──────────────────────────────────
This application was submitted via TustoJobs ME — the smart job matching platform for UAE & Middle East professionals.
`;

  const attachments: Array<{ filename: string; path: string }> = [];

  function resolveFilePath(storedPath: string): string {
    if (storedPath.startsWith("/_vercel_upload/")) {
      return storedPath.replace("/_vercel_upload/", "/tmp/tustojobs-uploads/");
    }
    return path.join(process.cwd(), "public", storedPath);
  }

  if (applicant.cvPath) {
    const fullPath = resolveFilePath(applicant.cvPath);
    if (fs.existsSync(fullPath)) {
      attachments.push({ filename: `CV_${applicant.name.replace(/\s+/g, "_")}.pdf`, path: fullPath });
    }
  }

  if (applicant.photoPath) {
    const fullPath = resolveFilePath(applicant.photoPath);
    if (fs.existsSync(fullPath)) {
      const ext = path.extname(applicant.photoPath);
      attachments.push({ filename: `Photo_${applicant.name.replace(/\s+/g, "_")}${ext}`, path: fullPath });
    }
  }

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: company.recruitmentEmail,
      replyTo: applicant.email,
      subject,
      text: body,
      attachments,
    });
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}
