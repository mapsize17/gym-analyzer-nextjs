import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { analyzeImage } from "@/lib/analyze";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("image");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

  // Save uploaded file temporarily
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const uploadDir = join(process.cwd(), "public", "uploads");
  const imgPath = join(uploadDir, "current.jpg");
  try {
    await writeFile(imgPath, buffer);
  } catch {
    await mkdir(uploadDir, { recursive: true });
    await writeFile(imgPath, buffer);
  }

  // Run multi-pass vision analysis
  const result = await analyzeImage(imgPath);
  return NextResponse.json(result);
}
