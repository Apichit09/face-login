export default function StatusBadge({ status }) {
  const className =
    status === "PASS"
      ? "status-badge pass"
      : status === "FAIL"
      ? "status-badge fail"
      : "status-badge";

  return <span className={className}>{status}</span>;
}