import crypto from "crypto";
import { cookies } from "next/headers";
import { getUserById } from "./storage";
import type { User } from "./types";

const SECRET = process.env.JWT_SECRET || "tustojobs-ph-secret-key-change-in-prod";
const COOKIE_NAME = "tustojobs_session";

export function signToken(userId: string): string {
  const payload = `${userId}:${Date.now()}`;
  const sig = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

export function verifyToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const parts = decoded.split(":");
    if (parts.length !== 3) return null;
    const [userId, ts, sig] = parts;
    const payload = `${userId}:${ts}`;
    const expected = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    return userId;
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const userId = verifyToken(token);
  if (!userId) return null;
  return getUserById(userId) ?? null;
}

export function createSessionCookie(userId: string): string {
  const token = signToken(userId);
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`;
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export { COOKIE_NAME };
