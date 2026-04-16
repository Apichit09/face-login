import Table from "@/components/ui/Table";
import StatusBadge from "@/components/ui/StatusBadge";
import { getBaseUrl } from "@/lib/getBaseUrl";

export default async function LoginLogTable() {
  const res = await fetch(`${getBaseUrl()}/api/logs`, {
    cache: "no-store",
  });

  const data = await res.json();
  const logs = data.data || [];

  const rows = logs.map((log) => [
    log.log_id,
    log.username || "-",
    <StatusBadge key={`status-${log.log_id}`} status={log.result} />,
    log.similarity_score ?? "-",
    `${log.inference_time_ms ?? 0} ms`,
    log.login_time || "-",
  ]);

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-neutral-900">Login Logs</h2>
        <p className="text-sm text-neutral-500">
          ประวัติการเข้าสู่ระบบและผลการตรวจสอบล่าสุด
        </p>
      </div>

      {logs.length === 0 ? (
        <div className="rounded-xl bg-neutral-50 px-4 py-8 text-center text-sm text-neutral-500">
          ยังไม่มีประวัติการเข้าสู่ระบบ
        </div>
      ) : (
        <Table
          headers={[
            "Log ID",
            "Username",
            "Result",
            "Similarity",
            "Time",
            "Login Time",
          ]}
          rows={rows}
        />
      )}
    </div>
  );
}