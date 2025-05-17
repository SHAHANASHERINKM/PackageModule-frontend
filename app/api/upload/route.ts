import { writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file: File | null = formData.get("upload") as unknown as File;

  if (!file) {
    return NextResponse.json({ uploaded: false, error: { message: "No file uploaded" } });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
  const uploadPath = path.join(process.cwd(), "public", "uploads", filename);

  await writeFile(uploadPath, buffer);

  return NextResponse.json({
    uploaded: true,
    url: `/uploads/${filename}`,
  });
}
