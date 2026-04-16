import Button from "@/components/ui/Button";
import VerificationResult from "@/components/face/VerificationResult";
import Link from "next/link";

export default async function ResultPage({ searchParams }) {
  const params = await searchParams;

  const loginType = params.loginType || "face";

  const result = {
    result: params.result || "FAIL",
    similarity: params.similarity || "0.00",
    threshold: params.threshold || process.env.NEXT_PUBLIC_THRESHOLD || "0.60",
    inferenceTime: params.inferenceTime || "0",
    message: params.message || "",
    reasonCode: params.reasonCode || "",
  };

  const isFaceLogin = loginType === "face";
  const isPasswordLogin = loginType === "password";

  const isFacePass = result.result === "PASS";
  const isPasswordPass = result.result === "PASSWORD_SUCCESS";
  const isPass = isFacePass || isPasswordPass;

  return (
    <div className="page-center px-4 py-6">
      <div className="auth-card w-full max-w-[560px]">
        {isFaceLogin ? (
          <VerificationResult result={result} />
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <div className="mb-2 flex justify-center">
                <img
                  src={isPasswordPass ? "/icon/check.gif" : "/icon/alert.gif"}
                  alt={isPasswordPass ? "success" : "error"}
                  className="h-20 w-20 object-contain"
                />
              </div>
              <h1 className="title mb-2">
                {isPasswordPass ? "เข้าสู่ระบบสำเร็จ" : "เข้าสู่ระบบไม่สำเร็จ"}
              </h1>
              <p className="text-sm leading-7 text-neutral-600">
                {result.message ||
                  (isPasswordPass
                    ? "ระบบตรวจสอบรหัสผ่านเรียบร้อยแล้ว"
                    : "ไม่สามารถเข้าสู่ระบบด้วยรหัสผ่านได้")}
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-4">
              <div className="mb-3 text-sm font-semibold text-neutral-900">
                รายละเอียดการเข้าสู่ระบบ
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3 rounded-xl bg-neutral-50 px-3 py-3">
                  <span className="text-sm text-neutral-600">
                    ประเภทการเข้าสู่ระบบ
                  </span>
                  <span className="text-sm font-semibold text-neutral-900">
                    รหัสผ่าน
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 rounded-xl bg-neutral-50 px-3 py-3">
                  <span className="text-sm text-neutral-600">สถานะ</span>
                  <span
                    className={`text-sm font-semibold ${
                      isPasswordPass ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {isPasswordPass ? "สำเร็จ" : "ไม่สำเร็จ"}
                  </span>
                </div>

                {result.reasonCode && (
                  <div className="flex items-center justify-between gap-3 rounded-xl bg-neutral-50 px-3 py-3">
                    <span className="text-sm text-neutral-600">รหัสสาเหตุ</span>
                    <span className="text-sm font-semibold text-neutral-900">
                      {result.reasonCode}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-2">
          {isPass ? (
            <>
              <Link href="/login" className="block">
                <Button>กลับไปหน้าเข้าสู่ระบบ</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="block">
                <Button>ลองเข้าสู่ระบบอีกครั้ง</Button>
              </Link>

              <Link href="/register" className="block">
                <button
                  type="button"
                  className="w-full rounded-xl bg-neutral-100 px-4 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-200"
                >
                  ไปหน้าสมัครสมาชิก
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
