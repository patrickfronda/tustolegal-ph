import { trackVisit, trackQuestion } from "@/app/lib/kv";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { type, sessionId } = await req.json();
  const country = req.headers.get("x-vercel-ip-country") ?? req.headers.get("cf-ipcountry") ?? "Unknown";
  const city = req.headers.get("x-vercel-ip-city") ?? "Unknown";

  if (type === "visit") {
    await trackVisit(country, city);
  } else if (type === "question" && sessionId) {
    await trackQuestion(sessionId, country, city);
  }

  return Response.json({ ok: true });
}
