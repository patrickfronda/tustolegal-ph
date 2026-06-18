import { verifyAdminToken } from "@/app/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") ?? "";
  const token = cookie.split(";").find((c) => c.trim().startsWith("admin_token="))?.split("=")[1];
  if (!verifyAdminToken(token)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return Response.json({ ok: true });
}
