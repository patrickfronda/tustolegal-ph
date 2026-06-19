import { signToken } from "@/app/lib/token";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const paymentIntentId = searchParams.get("id");

  if (!paymentIntentId) {
    return Response.json({ error: "Missing id" }, { status: 400 });
  }

  const secretKey = process.env.PAYMONGO_SECRET_KEY;
  if (!secretKey) {
    return Response.json({ error: "Payment not configured" }, { status: 503 });
  }

  const auth = Buffer.from(`${secretKey}:`).toString("base64");

  // GCash can briefly report "processing" right after redirect, so poll a few times.
  let status = "";
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(
      `https://api.paymongo.com/v1/payment_intents/${paymentIntentId}`,
      { headers: { Authorization: `Basic ${auth}` }, cache: "no-store" }
    );

    if (!res.ok) {
      return Response.json({ error: "Could not retrieve payment" }, { status: 502 });
    }

    const data = await res.json();
    status = data.data?.attributes?.status ?? "";

    if (status === "succeeded") {
      const token = signToken(paymentIntentId);
      return Response.json({ token });
    }

    if (status === "awaiting_payment_method" || status === "awaiting_next_action") {
      // Payment failed or was cancelled — no point retrying.
      break;
    }

    await new Promise((r) => setTimeout(r, 1500));
  }

  return Response.json({ error: "Payment not completed", status }, { status: 402 });
}
