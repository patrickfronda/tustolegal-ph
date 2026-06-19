import { createHmac } from "crypto";

const SECRET = process.env.TOKEN_SECRET ?? "change-me-in-production";

export type Plan = "basic" | "plus";

const TTL: Record<Plan, number> = {
  basic: 12 * 60 * 60 * 1000,
  plus:  24 * 60 * 60 * 1000,
};

export function signToken(checkoutId: string, plan: Plan): string {
  const expiresAt = Date.now() + TTL[plan];
  const payload = `${checkoutId}:${expiresAt}:${plan}`;
  const sig = createHmac("sha256", SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

export function verifyToken(token: string | null | undefined): false | Plan {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, "base64url").toString();
    const parts = decoded.split(":");
    if (parts.length !== 4) return false;
    const [checkoutId, expiresAt, plan, sig] = parts;
    if (Date.now() > parseInt(expiresAt)) return false;
    const expected = createHmac("sha256", SECRET)
      .update(`${checkoutId}:${expiresAt}:${plan}`)
      .digest("hex");
    if (sig !== expected) return false;
    return plan as Plan;
  } catch {
    return false;
  }
}
