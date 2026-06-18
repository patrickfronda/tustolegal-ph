import { NextResponse } from "next/server";
import { getSessionUser } from "@/app/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { passwordHash: _, ...safeUser } = user;
  return NextResponse.json({ user: safeUser });
}
