import { NextResponse } from "next/server";
import { getStats } from "@/services/statsService";

export async function GET() {
  try {
    const data = await getStats();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Cannot load stats" },
      { status: 500 }
    );
  }
}