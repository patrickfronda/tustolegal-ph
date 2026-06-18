import { createHmac } from "crypto";

const SECRET = process.env.TOKEN_SECRET ?? "change-me-in-production";
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export function signToken(checkoutId: string): string {
  const payload = `${checkoutId}:${Date.now()}`;
  const sig = createHmac("sha256", SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

export function verifyToken(token: string | null | undefined): boolean {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, "base64url").toString();
    const parts = decoded.split(":");
    if (parts.length !== 3) return false;
    const [checkoutId, ts, sig] = parts;
    if (Date.now() - parseInt(ts) > TOKEN_TTL_MS) return false;
    const expected = createHmac("sha256", SECRET)
      .update(`${checkoutId}:${ts}`)
      .digest("hex");
    return sig === expected;
  } catch {
    return false;
  }
}
