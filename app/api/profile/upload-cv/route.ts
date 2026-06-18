import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/app/lib/auth";
import { saveUser, saveUploadedFile } from "@/app/lib/storage";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("cv") as File | null;

  if (!file) return NextResponse.json({ error: "No CV uploaded." }, { status: 400 });
  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "Only PDF files are accepted." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "CV must be under 10MB." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = saveUploadedFile(user.id, "cv", buffer, "pdf");

  user.cvPath = filePath;
  saveUser(user);

  return NextResponse.json({ cvPath: filePath });
}
