import { query } from "@/lib/db";

function cosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));

  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

export async function verifyFaceLogin({ username, image }) {
  if (!username) {
    throw new Error("กรุณากรอกชื่อผู้ใช้");
  }

  if (!image) {
    throw new Error("กรุณาอัปโหลดภาพใบหน้า");
  }

  // หา user
  const users = await query(
    "SELECT user_id, username FROM users WHERE username = ?",
    [username]
  );

  if (users.length === 0) {
    throw new Error("ไม่พบชื่อผู้ใช้นี้ในระบบ");
  }

  const user = users[0];

  // ดึง embeddings อ้างอิง
  const rows = await query(
    "SELECT embedding_vector FROM face_embeddings WHERE user_id = ?",
    [user.user_id]
  );

  if (rows.length === 0) {
    // กรณีนี้ถือเป็น FAIL จริง เพราะบัญชียังไม่มีข้อมูลอ้างอิง
    await query(
      `INSERT INTO login_logs (user_id, result, similarity_score, inference_time_ms)
       VALUES (?, ?, ?, ?)`,
      [user.user_id, "FAIL", 0, 0]
    );

    return {
      result: "FAIL",
      similarity: "0.0000",
      threshold: "0.60",
      inferenceTime: 0,
      message: "บัญชีนี้ยังไม่ได้ลงทะเบียนใบหน้า",
    };
  }

  // ส่งรูป login ไปให้ Python สร้าง embedding ปัจจุบัน
  const form = new FormData();
  form.append("username", username);
  form.append("image", image, image.name || "login.jpg");

  const pythonApiUrl = process.env.PYTHON_API_URL || "http://127.0.0.1:8000";

  const start = Date.now();

  const res = await fetch(`${pythonApiUrl}/embed`, {
    method: "POST",
    body: form,
  });

  const data = await res.json();

  const inferenceTime = Date.now() - start;

  // ถ้าภาพไม่ผ่าน Quality Gate
  // ไม่ควรนับเป็น FAIL เชิง verification
  if (!res.ok || !data.success || !data.embedding) {
    const qualityMessage =
      data?.message || data?.detail || "ภาพไม่ผ่านเกณฑ์คุณภาพ";

    return {
      result: "QUALITY_FAILED",
      similarity: "0.0000",
      threshold: Number(
        process.env.NEXT_PUBLIC_THRESHOLD || 0.6
      ).toFixed(2),
      inferenceTime,
      reasonCode: data?.reason_code || "QUALITY_GATE_FAILED",
      message: qualityMessage,
      metrics: data?.metrics || {},
    };
  }

  const currentEmbedding = data.embedding;

  // เทียบกับ embeddings ที่ลงทะเบียนไว้ทั้งหมด แล้วเอาคะแนนสูงสุด
  let maxSimilarity = 0;

  for (const row of rows) {
    let refEmbedding = [];

    try {
      refEmbedding = JSON.parse(Buffer.from(row.embedding_vector).toString());
    } catch {
      continue;
    }

    if (
      Array.isArray(refEmbedding) &&
      refEmbedding.length === currentEmbedding.length
    ) {
      const score = cosineSimilarity(currentEmbedding, refEmbedding);
      if (score > maxSimilarity) {
        maxSimilarity = score;
      }
    }
  }

  const threshold = Number(process.env.NEXT_PUBLIC_THRESHOLD || 0.6);
  const result = maxSimilarity >= threshold ? "PASS" : "FAIL";

  // บันทึก log เฉพาะ verification attempt ที่ผ่าน Quality Gate แล้ว
  await query(
    `INSERT INTO login_logs (user_id, result, similarity_score, inference_time_ms)
     VALUES (?, ?, ?, ?)`,
    [user.user_id, result, maxSimilarity, inferenceTime]
  );

  return {
    result,
    similarity: maxSimilarity.toFixed(4),
    threshold: threshold.toFixed(2),
    inferenceTime,
    message:
      result === "PASS"
        ? "ระบบยืนยันตัวตนด้วยใบหน้าถูกต้อง"
        : "ใบหน้าไม่ตรงกับข้อมูลที่ลงทะเบียนไว้",
    metrics: data?.metrics || {},
  };
}