import { signAdminToken } from "@/app/lib/adminAuth";

export const dynamic = "force-dynamic";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "torny-admin-2024";

export async function POST(req: Request) {
  const { password } = await req.json();

  if (password !== ADMIN_PASSWORD) {
    return Response.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = signAdminToken();
  const headers = new Headers({ "Content-Type": "application/json" });
  headers.append(
    "Set-Cookie",
    `admin_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`
  );

  return new Response(JSON.stringify({ ok: true }), { headers });
}
