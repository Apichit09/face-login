import Sidebar from "@/components/layout/Sidebar";
import DashboardCards from "@/components/admin/DashboardCards";

export default function AdminDashboardPage() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <section className="admin-content">
        <h1 className="section-title">Admin Dashboard</h1>
        <p className="subtitle" style={{ textAlign: "left" }}>
          ภาพรวมของระบบยืนยันตัวตนด้วยใบหน้า
        </p>
        <DashboardCards />
      </section>
    </div>
  );
}