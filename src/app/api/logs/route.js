import { NextResponse } from "next/server";
import { getLoginLogs } from "@/services/logService";

export async function GET() {
  try {
    const data = await getLoginLogs();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Cannot load logs" },
      { status: 500 }
    );
  }
}