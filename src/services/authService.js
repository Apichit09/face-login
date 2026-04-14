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

  const insertUser = await query(
    "INSERT INTO users (username, password_hash) VALUES (?, ?)",
    [username, passwordHash]
  );

  const userId = insertUser.insertId;

  const form = new FormData();
  form.append("username", username);

  for (const image of images) {
    form.append("images", image, image.name || "face.jpg");
  }

  const pythonApiUrl = process.env.PYTHON_API_URL || "http://127.0.0.1:8000";
  const res = await fetch(`${pythonApiUrl}/enroll`, {
    method: "POST",
    body: form,
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.detail || data.message || "ArcFace enroll failed");
  }

  if (!data.embeddings || data.embeddings.length !== 4) {
    throw new Error("ไม่ได้ embeddings ครบ 4 รูป");
  }

  for (const emb of data.embeddings) {
    await query(
      "INSERT INTO face_embeddings (user_id, embedding_vector, model_name) VALUES (?, ?, ?)",
      [userId, Buffer.from(JSON.stringify(emb)), "ArcFace"]
    );
  }

  return { userId, username };
}