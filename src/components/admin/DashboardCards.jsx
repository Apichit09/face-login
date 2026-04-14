export default async function DashboardCards() {
  const res = await fetch("http://localhost:3000/api/stats", {
    cache: "no-store",
  });
  const data = await res.json();

  const stats = data.data || {
    totalUsers: 0,
    enrolledUsers: 0,
    passCount: 0,
    failCount: 0,
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
        gap: "16px",
      }}
    >
      <div className="card"><strong>Total Users</strong><div>{stats.totalUsers}</div></div>
      <div className="card"><strong>Enrolled Users</strong><div>{stats.enrolledUsers}</div></div>
      <div className="card"><strong>PASS</strong><div>{stats.passCount}</div></div>
      <div className="card"><strong>FAIL</strong><div>{stats.failCount}</div></div>
    </div>
  );
}