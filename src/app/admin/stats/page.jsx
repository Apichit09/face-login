import Sidebar from "@/components/layout/Sidebar";
import PassFailChart from "@/components/admin/PassFailChart";

export default function StatsPage() {
  return (
    <div className="admin-layout flex min-h-screen flex-col bg-neutral-50 lg:flex-row">
      <Sidebar />

      <section className="admin-content flex-1">
        <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-neutral-200">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">
                  Statistics
                </h1>
                <p className="mt-2 text-sm text-neutral-500">
                  สถิติภาพรวมของผลการยืนยันตัวตนและเวลาในการประมวลผลของระบบ
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-neutral-50 px-4 py-3 ring-1 ring-neutral-200">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white">
                  <img
                    src="/icon/shield.gif"
                    alt="stats"
                    className="h-6 w-6 object-contain"
                  />
                </div>

                <div>
                  <div className="text-sm font-semibold text-neutral-900">
                    Statistics Overview
                  </div>
                  <div className="text-xs text-neutral-500">
                    สรุป PASS / FAIL และประสิทธิภาพของระบบ
                  </div>
                </div>
              </div>
            </div>
          </div>

          <PassFailChart />
        </div>
      </section>
    </div>
  );
}