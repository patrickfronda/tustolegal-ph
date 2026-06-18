import { getApprovedLawyers } from "@/app/lib/kv";

export const dynamic = "force-dynamic";

export async function GET() {
  const lawyers = await getApprovedLawyers();
  return Response.json(lawyers);
}
