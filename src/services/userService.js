import { query } from "@/lib/db";

export async function getUsers() {
  return await query(
    "SELECT user_id, username, created_at FROM users ORDER BY user_id DESC"
  );
}