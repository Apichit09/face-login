import Table from "@/components/ui/Table";
import { getBaseUrl } from "@/lib/getBaseUrl";

export default async function FaceStatusTable() {
  const res = await fetch(`${getBaseUrl()}/api/face/status`, {
    cache: "no-store",
  });

  const data = await res.json();
  const items = data.data || [];

  const rows = items.map((item) => [
    item.user_id,
    item.username,
    <span
      key={`status-${item.user_id}`}
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        item.has_face
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {item.has_face ? "Registered" : "Not Registered"}
    </span>,
    item.embedding_count ?? 0,
  ]);

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-neutral-900">Face Status</h2>
        <p className="text-sm text-neutral-500">
          สถานะการลงทะเบียนใบหน้าของผู้ใช้แต่ละคน
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl bg-neutral-50 px-4 py-8 text-center text-sm text-neutral-500">
          ยังไม่มีข้อมูลสถานะใบหน้า
        </div>
      ) : (
        <Table
          headers={["User ID", "Username", "Status", "Embedding Count"]}
          rows={rows}
        />
      )}
    </div>
  );
}