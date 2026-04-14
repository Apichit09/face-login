import { query } from "@/lib/db";

export async function getStats() {
  const totalUsersRows = await query("SELECT COUNT(*) AS totalUsers FROM users");
  const enrolledRows = await query(
    "SELECT COUNT(DISTINCT user_id) AS enrolledUsers FROM face_embeddings"
  );
  const passRows = await query(
    "SELECT COUNT(*) AS passCount FROM login_logs WHERE result = 'PASS'"
  );
  const failRows = await query(
    "SELECT COUNT(*) AS failCount FROM login_logs WHERE result = 'FAIL'"
  );
  const avgRows = await query(
    "SELECT COALESCE(ROUND(AVG(inference_time_ms), 2), 0) AS avgInferenceTime FROM login_logs"
  );

  return {
    totalUsers: totalUsersRows[0]?.totalUsers || 0,
    enrolledUsers: enrolledRows[0]?.enrolledUsers || 0,
    passCount: passRows[0]?.passCount || 0,
    failCount: failRows[0]?.failCount || 0,
    avgInferenceTime: avgRows[0]?.avgInferenceTime || 0,
  };
}

export async function getFaceStatus() {
  return await query(`
    SELECT 
      u.user_id,
      u.username,
      CASE WHEN COUNT(f.embedding_id) > 0 THEN TRUE ELSE FALSE END AS has_face,
      COUNT(f.embedding_id) AS embedding_count
    FROM users u
    LEFT JOIN face_embeddings f ON u.user_id = f.user_id
    GROUP BY u.user_id, u.username
    ORDER BY u.user_id DESC
  `);
}