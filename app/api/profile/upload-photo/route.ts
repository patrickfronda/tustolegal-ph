import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/app/lib/auth";
import { saveUser, saveUploadedFile } from "@/app/lib/storage";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("photo") as File | null;

  if (!file) return NextResponse.json({ error: "No photo uploaded." }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Only JPG, PNG, or WebP images allowed." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Image must be under 5MB." }, { status: 400 });
  }

  const ext = file.type.split("/")[1].replace("jpeg", "jpg");
  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = saveUploadedFile(user.id, "photo", buffer, ext);

  user.photoPath = filePath;
  saveUser(user);

  return NextResponse.json({ photoPath: filePath });
}
