import { NextResponse } from "next/server";
import { getSessionUser } from "@/app/lib/auth";
import { matchCompanies } from "@/app/lib/companies";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const skills = user.skills || [];
  const position = user.desiredPosition || "";
  const matches = matchCompanies(skills, position);

  return NextResponse.json({ matches });
}
