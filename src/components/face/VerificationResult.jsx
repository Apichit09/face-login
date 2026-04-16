export default function VerificationResult({ result }) {
  const isPass = result?.result === "PASS";

  return (
    <>
      <div className="mb-2 flex justify-center items-center">
        <img
          src={isPass ? "/icon/check.gif" : "/icon/shield.gif"}
          alt={isPass ? "success" : "error"}
          className="h-21 w-21 object-contain"
        />
      </div>

      <h1 className="title">
        {isPass ? "เข้าสู่ระบบสำเร็จ" : "เข้าสู่ระบบไม่สำเร็จ"}
      </h1>
      <p className="subtitle">
        {isPass
          ? "ระบบยืนยันตัวตนด้วยใบหน้าถูกต้อง"
          : "ระบบไม่สามารถยืนยันตัวตนได้"}
      </p>

      <div className="metric-box">
        <span className="metric-label">คะแนนความเหมือน (Similarity Score)</span>
        <span className={`metric-value ${isPass ? "success" : ""}`}>
          {result?.similarity}
        </span>
      </div>

      <div className="metric-box">
        <span className="metric-label">ค่าเกณฑ์การตัดสิน (Threshold)</span>
        <span className="metric-value">{result?.threshold}</span>
      </div>

      <div className="metric-box">
        <span className="metric-label">เวลาในการประมวลผล (Inference Time)</span>
        <span className="metric-value">{result?.inferenceTime} ms</span>
      </div>

      <div className={isPass ? "success-box" : "info-box"}>
        {isPass ? (
          <>
            ยินดีต้อนรับเข้าสู่ระบบ <br />
            ใบหน้าของคุณตรงกับฐานข้อมูลที่ลงทะเบียนไว้
          </>
        ) : (
          <>
            กรุณาลองใหม่อีกครั้ง <br />
            โดยให้ใบหน้าอยู่กึ่งกลางและมีแสงสว่างเพียงพอ
          </>
        )}
      </div>
    </>
  );
}
