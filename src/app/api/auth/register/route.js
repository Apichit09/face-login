import { NextResponse } from "next/server";
import { registerUserWithArcFace } from "@/services/authService";

export async function POST(request) {
  try {
    const formData = await request.formData();

    const username = formData.get("username");
    const password = formData.get("password");
    const images = formData.getAll("images");

    const result = await registerUserWithArcFace({
      username,
      password,
      images,
    });

    return NextResponse.json({
      success: true,
      message: `ลงทะเบียนสำเร็จสำหรับ ${result.username}`,
      data: result,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Register failed",
      },
      { status: 500 }
    );
  }
}