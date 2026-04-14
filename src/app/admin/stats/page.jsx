import Sidebar from "@/components/layout/Sidebar";
import PassFailChart from "@/components/admin/PassFailChart";

export default function StatsPage() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <section className="admin-content">
        <h1 className="section-title">Statistics</h1>
        <PassFailChart />
      </section>
    </div>
  );
}