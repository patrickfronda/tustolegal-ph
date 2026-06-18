import { submitApplication } from "@/app/lib/kv";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, rollNumber, specialties, location, experience, fee, phone, email, bio } = body;

  if (!name || !phone || !email || !specialties?.length) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const id = await submitApplication({ name, rollNumber, specialties, location, experience: Number(experience), fee, phone, email, bio });
  return Response.json({ ok: true, id });
}
