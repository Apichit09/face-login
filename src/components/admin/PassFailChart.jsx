import { getBaseUrl } from "@/lib/getBaseUrl";

export default async function PassFailChart() {
  const res = await fetch(`${getBaseUrl()}/api/stats`, {
    cache: "no-store",
  });

  const data = await res.json();
  const stats = data.data || {};

  const passCount = Number(stats.passCount || 0);
  const failCount = Number(stats.failCount || 0);
  const total = passCount + failCount;

  const passPercent = total > 0 ? Math.round((passCount / total) * 100) : 0;
  const failPercent = total > 0 ? Math.round((failCount / total) * 100) : 0;

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 ring-1 ring-blue-100">
          <img src="/icon/shield.gif" alt="summary" className="h-7 w-7 object-contain" />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-neutral-900">
            PASS / FAIL Summary
          </h3>
          <p className="text-sm text-neutral-500">
            สรุปผลการเข้าสู่ระบบและเวลาเฉลี่ยในการประมวลผล
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-neutral-700">PASS</span>
            <span className="font-semibold text-green-700">
              {passCount} ({passPercent}%)
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-neutral-100">
            <div
              className="h-full rounded-full bg-green-500"
              style={{ width: `${passPercent}%` }}
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-neutral-700">FAIL</span>
            <span className="font-semibold text-red-700">
              {failCount} ({failPercent}%)
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-neutral-100">
            <div
              className="h-full rounded-full bg-red-500"
              style={{ width: `${failPercent}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
          ค่าเฉลี่ยเวลาประมวลผล:{" "}
          <span className="font-semibold text-neutral-900">
            {stats.avgInferenceTime || 0} ms
          </span>
        </div>
      </div>
    </div>
  );
}