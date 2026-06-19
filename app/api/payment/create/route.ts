export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tustolegal.ph";
const AMOUNT_CENTAVOS = 9900; // ₱99

// Direct GCash flow (Payment Intent + Payment Method) — sends the user straight
// to GCash with no hosted checkout page, so we never ask for name/email.
export async function POST() {
  const secretKey = process.env.PAYMONGO_SECRET_KEY;
  if (!secretKey) {
    return Response.json({ error: "Payment not configured" }, { status: 503 });
  }

  const auth = Buffer.from(`${secretKey}:`).toString("base64");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${auth}`,
  };

  // 1. Create a Payment Intent for ₱99 payable via GCash
  const intentRes = await fetch("https://api.paymongo.com/v1/payment_intents", {
    method: "POST",
    headers,
    body: JSON.stringify({
      data: {
        attributes: {
          amount: AMOUNT_CENTAVOS,
          currency: "PHP",
          payment_method_allowed: ["gcash"],
          capture_type: "automatic",
          description: "Torny AI — Chat Session (24 hrs)",
          statement_descriptor: "TORNY AI",
        },
      },
    }),
  });

  if (!intentRes.ok) {
    console.error("PayMongo intent error:", await intentRes.text());
    return Response.json({ error: "Failed to create payment" }, { status: 502 });
  }

  const intent = await intentRes.json();
  const intentId: string = intent.data.id;

  // 2. Create a GCash payment method — no billing/personal details collected
  const methodRes = await fetch("https://api.paymongo.com/v1/payment_methods", {
    method: "POST",
    headers,
    body: JSON.stringify({
      data: { attributes: { type: "gcash" } },
    }),
  });

  if (!methodRes.ok) {
    console.error("PayMongo method error:", await methodRes.text());
    return Response.json({ error: "Failed to create payment method" }, { status: 502 });
  }

  const method = await methodRes.json();
  const methodId: string = method.data.id;

  // 3. Attach the method to the intent to get the GCash redirect URL
  const attachRes = await fetch(
    `https://api.paymongo.com/v1/payment_intents/${intentId}/attach`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        data: {
          attributes: {
            payment_method: methodId,
            return_url: `${SITE_URL}/payment/success?pi=${intentId}`,
          },
        },
      }),
    }
  );

  if (!attachRes.ok) {
    console.error("PayMongo attach error:", await attachRes.text());
    return Response.json({ error: "Failed to start payment" }, { status: 502 });
  }

  const attached = await attachRes.json();
  const redirectUrl: string | undefined =
    attached.data?.attributes?.next_action?.redirect?.url;

  if (!redirectUrl) {
    console.error("PayMongo: no redirect URL", JSON.stringify(attached));
    return Response.json({ error: "Could not start GCash payment" }, { status: 502 });
  }

  return Response.json({ url: redirectUrl });
}
