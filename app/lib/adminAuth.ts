import { createHmac } from "crypto";

const SECRET = process.env.ADMIN_SECRET ?? "torny-admin-secret-2024";
const TTL = 24 * 60 * 60 * 1000;

export function signAdminToken(): string {
  const exp = Date.now() + TTL;
  const sig = createHmac("sha256", SECRET).update(String(exp)).digest("hex");
  return `${exp}.${sig}`;
}

export function verifyAdminToken(token: string | null | undefined): boolean {
  if (!token) return false;
  const dot = token.lastIndexOf(".");
  if (dot < 0) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac("sha256", SECRET).update(payload).digest("hex");
  if (expected !== sig) return false;
  return parseInt(payload) > Date.now();
}
