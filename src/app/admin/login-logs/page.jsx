import Sidebar from "@/components/layout/Sidebar";
import LoginLogTable from "@/components/admin/LoginLogTable";

export default function LoginLogsPage() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <section className="admin-content">
        <h1 className="section-title">Login Logs</h1>
        <LoginLogTable />
      </section>
    </div>
  );
}