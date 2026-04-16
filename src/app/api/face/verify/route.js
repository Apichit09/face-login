import { verifyFaceLogin } from "@/services/faceService";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const username = formData.get("username");
    const image = formData.get("image");

    const result = await verifyFaceLogin({ username, image });

    return Response.json(result, { status: 200 });
  } catch (error) {
    console.error("VERIFY ERROR:", error.message);

    const message = error?.message || "เข้าสู่ระบบไม่สำเร็จ";

    let status = 400;

    if (message.includes("ไม่พบชื่อผู้ใช้นี้ในระบบ")) {
      status = 404;
    }

    return Response.json(
      {
        success: false,
        message,
      },
      { status }
    );
  }
}