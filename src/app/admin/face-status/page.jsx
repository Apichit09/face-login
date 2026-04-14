import Sidebar from "@/components/layout/Sidebar";
import FaceStatusTable from "@/components/admin/FaceStatusTable";

export default function FaceStatusPage() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <section className="admin-content">
        <h1 className="section-title">Face Status</h1>
        <FaceStatusTable />
      </section>
    </div>
  );
}