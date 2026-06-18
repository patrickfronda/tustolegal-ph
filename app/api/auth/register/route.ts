import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { getUserByEmail, saveUser } from "@/app/lib/storage";
import { createSessionCookie } from "@/app/lib/auth";
import type { User } from "@/app/lib/types";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, password, phone, city, desiredPosition, experienceYears, skills } = body;

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }

  const existing = getUserByEmail(email);
  if (existing) {
    return NextResponse.json({ error: "Email already registered." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user: User = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash,
    phone: phone?.trim() || undefined,
    city: city?.trim() || undefined,
    desiredPosition: desiredPosition?.trim() || undefined,
    experienceYears: experienceYears ? parseInt(experienceYears) : undefined,
    skills: Array.isArray(skills) ? skills : [],
    createdAt: new Date().toISOString(),
  };

  saveUser(user);

  const response = NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email },
  });
  response.headers.set("Set-Cookie", createSessionCookie(user.id));
  return response;
}
