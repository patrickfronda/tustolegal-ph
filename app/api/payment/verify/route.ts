import { signToken } from "@/app/lib/token";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const checkoutSessionId = searchParams.get("id");

  if (!checkoutSessionId) {
    return Response.json({ error: "Missing id" }, { status: 400 });
  }

  const secretKey = process.env.PAYMONGO_SECRET_KEY;
  if (!secretKey) {
    return Response.json({ error: "Payment not configured" }, { status: 503 });
  }

  const auth = Buffer.from(`${secretKey}:`).toString("base64");

  const res = await fetch(
    `https://api.paymongo.com/v1/checkout_sessions/${checkoutSessionId}`,
    { headers: { Authorization: `Basic ${auth}` } }
  );

  if (!res.ok) {
    return Response.json({ error: "Could not retrieve session" }, { status: 502 });
  }

  const data = await res.json();
  const status: string = data.data.attributes.payment_intent?.attributes?.status ?? "";

  if (status !== "succeeded") {
    return Response.json({ error: "Payment not completed" }, { status: 402 });
  }

  const token = signToken(checkoutSessionId);
  return Response.json({ token });
}
