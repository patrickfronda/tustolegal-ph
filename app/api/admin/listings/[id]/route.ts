import { verifyAdminToken } from "@/app/lib/adminAuth";
import { updateApplication } from "@/app/lib/kv";

export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookie = req.headers.get("cookie") ?? "";
  const token = cookie.split(";").find((c) => c.trim().startsWith("admin_token="))?.split("=")[1];
  if (!verifyAdminToken(token)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { action } = await req.json();

  if (action !== "approve" && action !== "reject") {
    return Response.json({ error: "Invalid action" }, { status: 400 });
  }

  await updateApplication(id, action);
  return Response.json({ ok: true });
}
