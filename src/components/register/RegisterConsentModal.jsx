import RegisterModal from "@/components/face/RegisterModal";

export default function RegisterConsentModal({ open, onAccept }) {
  return (
    <RegisterModal
      open={open}
      title="หนังสือยินยอมการใช้ข้อมูลใบหน้า"
      onClose={null}
    >
      <div className="text-sm leading-7 text-neutral-700">
        ระบบนี้จะนำภาพใบหน้าของผู้ใช้ไปประมวลผลเป็นเวกเตอร์ใบหน้า
        (Face Embedding / Vector) เพื่อใช้สำหรับการลงทะเบียนและยืนยันตัวตนเท่านั้น
        <br />
        <br />
        ภาพจะไม่ถูกนำไปใช้เพื่อวัตถุประสงค์อื่นนอกเหนือจากการทำงานของระบบต้นแบบ
        และการเปรียบเทียบความเหมือนของใบหน้าในการเข้าสู่ระบบ
      </div>

      <div className="mt-4 flex justify-center">
        <button
          type="button"
          className="rounded-xl bg-green-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-900"
          onClick={onAccept}
        >
          ยินยอมและเริ่มใช้งาน
        </button>
      </div>
    </RegisterModal>
  );
}