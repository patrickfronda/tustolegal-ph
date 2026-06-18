import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSessionUser } from "@/app/lib/auth";
import { saveApplication, getApplicationsByUser } from "@/app/lib/storage";
import { companies } from "@/app/lib/companies";
import { sendApplicationEmail } from "@/app/lib/email";
import type { Application } from "@/app/lib/types";

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { companyId } = body;

  const company = companies.find((c) => c.id === companyId);
  if (!company) return NextResponse.json({ error: "Company not found." }, { status: 404 });

  const existingApps = getApplicationsByUser(user.id);
  const alreadyApplied = existingApps.some((a) => a.companyId === companyId);
  if (alreadyApplied) {
    return NextResponse.json({ error: "You have already applied to this company." }, { status: 409 });
  }

  const result = await sendApplicationEmail(user, company);

  const application: Application = {
    id: crypto.randomUUID(),
    userId: user.id,
    companyId: company.id,
    companyName: company.name,
    companyIndustry: company.industry,
    jobTitle: user.desiredPosition || "Open Position",
    sentAt: new Date().toISOString(),
    status: result.success ? "sent" : "failed",
  };

  saveApplication(application);

  if (!result.success) {
    return NextResponse.json(
      { error: "Application saved but email could not be sent. Please configure SMTP settings.", application },
      { status: 207 }
    );
  }

  return NextResponse.json({ success: true, application });
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const applications = getApplicationsByUser(user.id);
  return NextResponse.json({ applications });
}
