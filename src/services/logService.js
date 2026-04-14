import { query } from "@/lib/db";

export async function getLoginLogs() {
  return await query(
    `SELECT l.log_id, u.username, l.result, l.similarity_score, l.inference_time_ms, l.login_time
     FROM login_logs l
     JOIN users u ON l.user_id = u.user_id
     ORDER BY l.log_id DESC`
  );
}