import Sidebar from "@/components/layout/Sidebar";
import DashboardCards from "@/components/admin/DashboardCards";
import PassFailChart from "@/components/admin/PassFailChart";
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="admin-layout">
      <Sidebar />

      <section className="admin-content bg-neutral-50">
        <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-neutral-200">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">
                  Admin Dashboard
                </h1>
                <p className="mt-2 text-sm text-neutral-500">
                  ภาพรวมของระบบยืนยันตัวตนด้วยใบหน้าและข้อมูลสำคัญของผู้ใช้งาน
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href="/admin/users"
                  className="rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
                >
                  จัดการผู้ใช้
                </Link>
                <Link
                  href="/admin/login-logs"
                  className="rounded-xl bg-neutral-100 px-4 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-neutral-200"
                >
                  ดูประวัติการเข้าสู่ระบบ
                </Link>
              </div>
            </div>
          </div>

          <DashboardCards />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <PassFailChart />

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 ring-1 ring-green-100">
                  <img
                    src="/icon/tasks.gif"
                    alt="system-status"
                    className="h-7 w-7 object-contain"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">
                    System Status
                  </h3>
                  <p className="text-sm text-neutral-500">
                    สถานะโดยรวมของระบบและการใช้งานเบื้องต้น
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-3">
                  <span className="text-sm text-neutral-600">Frontend</span>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Online
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-3">
                  <span className="text-sm text-neutral-600">Backend API</span>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Connected
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-3">
                  <span className="text-sm text-neutral-600">Database</span>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Ready
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}