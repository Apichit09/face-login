import RegisterModal from "@/components/face/RegisterModal";

export default function LoginProgressModal({ open, title, progress }) {
  return (
    <RegisterModal open={open} title={title} onClose={null}>
      <div className="flex flex-col items-center">
        <div className="mb-2 text-4xl">
          <img src="/icon/loading.gif" alt="loading" className="h-10 w-10" />
        </div>

        <div className="text-center text-sm leading-7 text-neutral-700">
          กรุณารอสักครู่ ระบบกำลังตรวจสอบข้อมูลการเข้าสู่ระบบ
        </div>

        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-green-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-700 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-2 text-sm font-bold text-green-800">{progress}%</div>
      </div>
    </RegisterModal>
  );
}