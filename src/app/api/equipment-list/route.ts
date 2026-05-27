import { NextResponse } from "next/server";
import { EXERCISE_DB } from "@/lib/exercises";

export async function GET() {
  const names = Object.entries(EXERCISE_DB).map(([key, v]) => ({
    key,
    name: v.name,
    category: v.category,
  }));
  names.sort((a, b) => a.name.localeCompare(b.name));
  return NextResponse.json(names);
}
