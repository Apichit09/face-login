import { NextResponse } from "next/server";
import { verifyFaceLogin } from "@/services/faceService";

export async function POST(request) {
  try {
    const formData = await request.formData();

    const username = formData.get("username");
    const image = formData.get("image");

    const result = await verifyFaceLogin({
      username,
      image,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("VERIFY ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Verify failed",
      },
      { status: 500 }
    );
  }
}