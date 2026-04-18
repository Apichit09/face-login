import RegisterModal from "@/components/face/RegisterModal";

export default function RegisterSuccessModal({
  open,
  message,
  onClose,
  onGoLogin,
}) {
  return (
    <RegisterModal
      open={open}
      title="ลงทะเบียนสำเร็จ"
      onClose={onClose}
    >
      <div className="flex flex-col items-center">
        <div className="mb-2 text-4xl">
          <img src="/icon/check.gif" alt="check" className="h-10 w-10" />
        </div>

        <div className="text-center text-sm leading-7 text-neutral-700">
          {message || "ระบบได้บันทึกข้อมูลเรียบร้อยแล้ว"}
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            className="rounded-xl bg-neutral-100 px-4 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-200"
            onClick={onClose}
          >
            ปิด
          </button>
          <button
            type="button"
            className="rounded-xl bg-green-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-900"
            onClick={onGoLogin}
          >
            ไปหน้า Login
          </button>
        </div>
      </div>
    </RegisterModal>
  );
}