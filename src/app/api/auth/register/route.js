import { registerUserWithArcFace } from "@/services/authService";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const username = formData.get("username");
    const password = formData.get("password");
    const images = formData.getAll("images");

    const result = await registerUserWithArcFace({
      username,
      password,
      images,
    });

    return Response.json(
      {
        success: true,
        message: result.message || "ลงทะเบียนสำเร็จ",
        userId: result.userId,
        username: result.username,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("REGISTER ERROR:", error.message);

    return Response.json(
      {
        success: false,
        message: error?.message || "ลงทะเบียนไม่สำเร็จ",
      },
      { status: 400 }
    );
  }
}