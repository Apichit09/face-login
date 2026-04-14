import Sidebar from "@/components/layout/Sidebar";
import UserTable from "@/components/admin/UserTable";

export default function UsersPage() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <section className="admin-content">
        <h1 className="section-title">Users</h1>
        <UserTable />
      </section>
    </div>
  );
}