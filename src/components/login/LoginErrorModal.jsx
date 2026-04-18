import RegisterModal from "@/components/face/RegisterModal";

export default function LoginErrorModal({ open, message, onClose }) {
  return (
    <RegisterModal
      open={open}
      title="ไม่สามารถเข้าสู่ระบบได้"
      onClose={onClose}
    >
      <div className="flex flex-col items-center">
        <div className="mb-2 text-4xl">
          <img src="/icon/alert.gif" alt="alert" className="h-10 w-10" />
        </div>

        <div className="text-center text-sm leading-7 text-neutral-700">
          {message || "กรุณาตรวจสอบข้อมูลแล้วลองใหม่อีกครั้ง"}
        </div>

        <div className="mt-4 flex justify-center">
          <button
            type="button"
            className="rounded-xl bg-green-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-900"
            onClick={onClose}
          >
            รับทราบ
          </button>
        </div>
      </div>
    </RegisterModal>
  );
}