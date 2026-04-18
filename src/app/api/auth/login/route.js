import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน",
        },
        { status: 400 }
      );
    }

    const cleanUsername = String(username).trim();
    const inputPasswordHash = hashPassword(String(password));

    const users = await query(
      "SELECT user_id, username, password_hash FROM users WHERE username = ? LIMIT 1",
      [cleanUsername]
    );

    if (users.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "ไม่พบชื่อผู้ใช้นี้ในระบบ",
        },
        { status: 404 }
      );
    }

    const user = users[0];

    if (inputPasswordHash !== user.password_hash) {
      return NextResponse.json(
        {
          success: false,
          message: "รหัสผ่านไม่ถูกต้อง",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `เข้าสู่ระบบสำเร็จสำหรับผู้ใช้ ${user.username}`,
      userId: user.user_id,
      username: user.username,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์",
      },
      { status: 500 }
    );
  }
}