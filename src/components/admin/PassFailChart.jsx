export default async function PassFailChart() {
  const res = await fetch("http://localhost:3000/api/stats", {
    cache: "no-store",
  });
  const data = await res.json();
  const stats = data.data || {};

  return (
    <div className="card">
      <h3 style={{ marginTop: 0, color: "#123d6b" }}>PASS / FAIL Summary</h3>
      <p>PASS: {stats.passCount || 0}</p>
      <p>FAIL: {stats.failCount || 0}</p>
      <p>ค่าเฉลี่ยเวลาประมวลผล: {stats.avgInferenceTime || 0} ms</p>
    </div>
  );
}