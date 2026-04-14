import Table from "@/components/ui/Table";
import StatusBadge from "@/components/ui/StatusBadge";

export default async function LoginLogTable() {
  const res = await fetch("http://localhost:3000/api/logs", {
    cache: "no-store",
  });
  const data = await res.json();
  const logs = data.data || [];

  const rows = logs.map((log) => [
    log.log_id,
    log.username,
    <StatusBadge key={`status-${log.log_id}`} status={log.result} />,
    log.similarity_score,
    `${log.inference_time_ms} ms`,
    log.login_time,
  ]);

  return (
    <Table
      headers={["Log ID", "Username", "Result", "Similarity", "Time", "Login Time"]}
      rows={rows}
    />
  );
}