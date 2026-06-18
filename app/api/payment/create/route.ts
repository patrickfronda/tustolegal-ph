export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tustolegal.ph";
const AMOUNT_CENTAVOS = 9900; // ₱99

export async function POST() {
  const secretKey = process.env.PAYMONGO_SECRET_KEY;
  if (!secretKey) {
    return Response.json({ error: "Payment not configured" }, { status: 503 });
  }

  const auth = Buffer.from(`${secretKey}:`).toString("base64");

  const res = await fetch("https://api.paymongo.com/v1/checkout_sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      data: {
        attributes: {
          amount: AMOUNT_CENTAVOS,
          currency: "PHP",
          description: "TustoLegal PH — Unlimited Legal Questions (24 hrs)",
          line_items: [
            {
              amount: AMOUNT_CENTAVOS,
              currency: "PHP",
              name: "TustoLegal Pro Session",
              description: "Unlimited legal questions for 24 hours",
              quantity: 1,
            },
          ],
          payment_method_types: ["gcash"],
          success_url: `${SITE_URL}/payment/success?checkout_session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${SITE_URL}/`,
          statement_descriptor: "TUSTOLEGAL",
        },
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("PayMongo error:", err);
    return Response.json({ error: "Failed to create checkout" }, { status: 502 });
  }

  const data = await res.json();
  const checkoutUrl: string = data.data.attributes.checkout_url;
  return Response.json({ url: checkoutUrl });
}
