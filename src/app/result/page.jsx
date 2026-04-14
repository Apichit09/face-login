import Button from "@/components/ui/Button";
import VerificationResult from "@/components/face/VerificationResult";
import Link from "next/link";

export default async function ResultPage({ searchParams }) {
  const params = await searchParams;

  const result = {
    result: params.result || "FAIL",
    similarity: params.similarity || "0.00",
    threshold:
      params.threshold || process.env.NEXT_PUBLIC_THRESHOLD || "0.60",
    inferenceTime: params.inferenceTime || "0",
  };

  const isPass = result.result === "PASS";

  return (
    <div className="page-center">
      <div className="auth-card">
        <VerificationResult result={result} />

        <div style={{ marginTop: 18 }}>
          {isPass ? (
            <Link href="/admin">
              <Button>เข้าสู่หน้าแดชบอร์ด</Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button>ลองเข้าสู่ระบบอีกครั้ง</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}