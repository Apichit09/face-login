import Table from "@/components/ui/Table";
import { getBaseUrl } from "@/lib/getBaseUrl";

export default async function UserTable() {
  const res = await fetch(`${getBaseUrl()}/api/users`, {
    cache: "no-store",
  });

  const data = await res.json();
  const users = data.data || [];

  const rows = users.map((user) => [
    user.user_id,
    user.username,
    user.created_at || "-",
  ]);

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-neutral-900">Users</h2>
        <p className="text-sm text-neutral-500">
          รายชื่อผู้ใช้งานทั้งหมดในระบบ
        </p>
      </div>

      {users.length === 0 ? (
        <div className="rounded-xl bg-neutral-50 px-4 py-8 text-center text-sm text-neutral-500">
          ยังไม่มีข้อมูลผู้ใช้
        </div>
      ) : (
        <Table headers={["ID", "Username", "Created At"]} rows={rows} />
      )}
    </div>
  );
}