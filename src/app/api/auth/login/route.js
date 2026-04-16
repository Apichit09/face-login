import { NextResponse } from "next/server";

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

    // ตัวอย่างชั่วคราว
    if (password !== "1234") {
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
      message: `เข้าสู่ระบบสำเร็จสำหรับผู้ใช้ ${username}`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์",
      },
      { status: 500 }
    );
  }
}