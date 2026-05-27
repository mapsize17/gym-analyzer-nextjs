import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { analyzeImage } from "@/lib/analyze";

// Prevent Vercel from caching or bundling this route
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const maxDuration = 55;

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
    const imgPath = join(uploadDir, `img_${Date.now()}.jpg`);
    try {
      await writeFile(imgPath, buffer);
    } catch {
      await mkdir(uploadDir, { recursive: true });
      await writeFile(imgPath, buffer);
    }

    const result = await analyzeImage(imgPath);
    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (err: any) {
    console.error("Analyze error:", err);
    return NextResponse.json(
      { error: `Analysis failed: ${err.message || "Unknown error"}` },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
