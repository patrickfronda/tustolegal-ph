export const dynamic = "force-dynamic";

const PLANS = {
  basic: { amount: 19900, label: "12-hour Basic Chat Session" },
  plus:  { amount: 29900, label: "24-hour Plus Chat Session" },
};

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const plan: "basic" | "plus" = body.plan === "plus" ? "plus" : "basic";
  const { amount, label } = PLANS[plan];

  const secretKey = process.env.PAYMONGO_SECRET_KEY;
  if (!secretKey) {
    return Response.json({ error: "Payment not configured" }, { status: 503 });
  }

  const auth = Buffer.from(`${secretKey}:`).toString("base64");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${auth}`,
  };

  // 1. Create a Payment Intent payable via QR Ph
  const intentRes = await fetch("https://api.paymongo.com/v1/payment_intents", {
    method: "POST",
    headers,
    body: JSON.stringify({
      data: {
        attributes: {
          amount,
          currency: "PHP",
          payment_method_allowed: ["qrph"],
          capture_type: "automatic",
          description: `Torny AI — ${label}`,
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

  // 2. Create a QR Ph payment method — no personal details collected
  const methodRes = await fetch("https://api.paymongo.com/v1/payment_methods", {
    method: "POST",
    headers,
    body: JSON.stringify({
      data: { attributes: { type: "qrph" } },
    }),
  });

  if (!methodRes.ok) {
    console.error("PayMongo method error:", await methodRes.text());
    return Response.json({ error: "Failed to create payment method" }, { status: 502 });
  }

  const method = await methodRes.json();
  const methodId: string = method.data.id;

  // 3. Attach the method to the intent — response carries the QR image
  const attachRes = await fetch(
    `https://api.paymongo.com/v1/payment_intents/${intentId}/attach`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        data: { attributes: { payment_method: methodId } },
      }),
    }
  );

  if (!attachRes.ok) {
    console.error("PayMongo attach error:", await attachRes.text());
    return Response.json({ error: "Failed to start payment" }, { status: 502 });
  }

  const attached = await attachRes.json();
  const qrImage: string | undefined =
    attached.data?.attributes?.next_action?.code?.image_url;

  if (!qrImage) {
    console.error("PayMongo: no QR image", JSON.stringify(attached));
    return Response.json({ error: "Could not start QR Ph payment" }, { status: 502 });
  }

  return Response.json({ qr: qrImage, intentId, plan });
}
