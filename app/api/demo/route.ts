import { createHmac } from "crypto";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  const demoKey = process.env.DEMO_KEY;

  if (!demoKey || key !== demoKey) {
    return Response.json({ error: "Invalid key" }, { status: 401 });
  }

  const secret = process.env.TOKEN_SECRET ?? "change-me-in-production";
  // 1-year expiry demo token, validated by the same verifyToken() used everywhere
  const expiresAt = Date.now() + 365 * 24 * 60 * 60 * 1000;
  const payload = `demo:${expiresAt}:plus`;
  const sig = createHmac("sha256", secret).update(payload).digest("hex");
  const token = Buffer.from(`${payload}:${sig}`).toString("base64url");

  return Response.json({ token });
}
