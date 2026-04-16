import AdminStatCard from "@/components/admin/AdminStatCard";
import { getBaseUrl } from "@/lib/getBaseUrl";

export default async function DashboardCards() {
  const res = await fetch(`${getBaseUrl()}/api/stats`, {
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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard
        title="Total Users"
        value={stats.totalUsers}
        subtitle="จำนวนผู้ใช้ทั้งหมดในระบบ"
        icon="/icon/personnel.gif"
        alt="total-users"
        color="blue"
      />

      <AdminStatCard
        title="Enrolled Users"
        value={stats.enrolledUsers}
        subtitle="ผู้ใช้ที่ลงทะเบียนใบหน้าแล้ว"
        icon="/icon/user.gif"
        alt="enrolled-users"
        color="green"
      />

      <AdminStatCard
        title="PASS"
        value={stats.passCount}
        subtitle="จำนวนครั้งที่ยืนยันตัวตนสำเร็จ"
        icon="/icon/check.gif"
        alt="pass-count"
        color="green"
      />

      <AdminStatCard
        title="FAIL"
        value={stats.failCount}
        subtitle="จำนวนครั้งที่ยืนยันตัวตนไม่สำเร็จ"
        icon="/icon/alert.gif"
        alt="fail-count"
        color="red"
      />
    </div>
  );
}