import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const rows = await query("SELECT 1 AS ok");
    return NextResponse.json({
      success: true,
      message: "เชื่อมฐานข้อมูลสำเร็จ",
      data: rows,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "เชื่อมฐานข้อมูลไม่สำเร็จ",
        error: error.message,
      },
      { status: 500 }
    );
  }
}