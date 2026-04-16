import { query } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function registerUserWithArcFace({ username, password, images }) {
  if (!username || !password) {
    throw new Error("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
  }

  if (!images || images.length !== 4) {
    throw new Error("กรุณาอัปโหลดภาพใบหน้าให้ครบ 4 รูป");
  }

  const existing = await query(
    "SELECT user_id FROM users WHERE username = ?",
    [username]
  );

  if (existing.length > 0) {
    throw new Error("ชื่อผู้ใช้นี้มีอยู่แล้ว");
  }

  const passwordHash = hashPassword(password);

  // 1) สร้าง user ก่อน
  const insertUser = await query(
    "INSERT INTO users (username, password_hash) VALUES (?, ?)",
    [username, passwordHash]
  );

  const userId = insertUser.insertId;

  try {
    // 2) ส่งรูปไป enroll ที่ Python backend
    const form = new FormData();
    form.append("username", username);

    for (const image of images) {
      form.append("images", image, image.name || "face.jpg");
    }

    const pythonApiUrl =
      process.env.PYTHON_API_URL || "http://127.0.0.1:8000";

    const res = await fetch(`${pythonApiUrl}/enroll`, {
      method: "POST",
      body: form,
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      // ถ้ามี failed_image_number ให้แจ้งแบบละเอียด
      if (data?.failed_image_number) {
        throw new Error(
          data.message ||
            `รูปที่ ${data.failed_image_number} ไม่ผ่านเกณฑ์คุณภาพ`
        );
      }

      throw new Error(data.detail || data.message || "ArcFace enroll failed");
    }

    if (!data.embeddings || data.embeddings.length !== 4) {
      throw new Error("ระบบไม่ได้ embeddings ครบ 4 รูป");
    }

    // 3) บันทึก embeddings ลงฐานข้อมูล
    for (const emb of data.embeddings) {
      await query(
        `INSERT INTO face_embeddings (user_id, embedding_vector, model_name)
         VALUES (?, ?, ?)`,
        [userId, Buffer.from(JSON.stringify(emb)), "ArcFace"]
      );
    }

    return {
      userId,
      username,
      message: data.message || "ลงทะเบียนสำเร็จ",
    };
  } catch (error) {
    // 4) cleanup user ที่เพิ่งสร้าง ถ้า enroll ไม่ผ่าน
    try {
      await query("DELETE FROM face_embeddings WHERE user_id = ?", [userId]);
      await query("DELETE FROM users WHERE user_id = ?", [userId]);
    } catch (cleanupError) {
      console.error("Cleanup failed:", cleanupError);
    }

    throw error;
  }
}