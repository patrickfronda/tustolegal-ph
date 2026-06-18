import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/app/lib/auth";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.headers.set("Set-Cookie", clearSessionCookie());
  return response;
}
