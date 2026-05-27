import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { analyzeImage } from "@/lib/analyze";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Use /tmp for Vercel compatibility (read-only filesystem elsewhere)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = join(tmpdir(), "gym-analyzer-uploads");
    const imgPath = join(uploadDir, "current.jpg");
    try {
      await writeFile(imgPath, buffer);
    } catch {
      await mkdir(uploadDir, { recursive: true });
      await writeFile(imgPath, buffer);
    }

    const result = await analyzeImage(imgPath);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Analyze error:", err);
    return NextResponse.json(
      { error: `Analysis failed: ${err.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}
