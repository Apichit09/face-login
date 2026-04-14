import { NextResponse } from "next/server";
import { getFaceStatus } from "@/services/statsService";

export async function GET() {
  try {
    const data = await getFaceStatus();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Cannot load face status" },
      { status: 500 }
    );
  }
}