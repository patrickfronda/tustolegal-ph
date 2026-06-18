import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/app/lib/auth";
import { saveUser } from "@/app/lib/storage";

export async function PUT(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, phone, city, desiredPosition, experienceYears, skills } = body;

  if (name) user.name = name.trim();
  if (phone !== undefined) user.phone = phone.trim() || undefined;
  if (city !== undefined) user.city = city.trim() || undefined;
  if (desiredPosition !== undefined) user.desiredPosition = desiredPosition.trim() || undefined;
  if (experienceYears !== undefined) user.experienceYears = experienceYears ? parseInt(experienceYears) : undefined;
  if (Array.isArray(skills)) user.skills = skills;

  saveUser(user);

  const { passwordHash: _, ...safeUser } = user;
  return NextResponse.json({ user: safeUser });
}
