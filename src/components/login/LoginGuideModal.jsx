import RegisterModal from "@/components/face/RegisterModal";

export default function LoginGuideModal({ open, onClose }) {
  return (
    <RegisterModal
      open={open}
      title="คำแนะนำการเข้าสู่ระบบ"
      onClose={onClose}
    >
      <div className="space-y-3 text-sm leading-7 text-neutral-700">
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
          1) กรอกชื่อผู้ใช้ก่อนทุกครั้ง
        </div>
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
          2) ถ้าเข้าสู่ระบบด้วยใบหน้า ให้ใช้ภาพที่เห็นใบหน้าชัดเจน
        </div>
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
          3) ถ้าต้องการใช้รหัสผ่าน ให้กด “ใช้รหัสผ่านแทน” ที่ด้านล่าง
        </div>
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
          4) ระบบจะแสดง popup สำหรับกรอกรหัสผ่านตามชื่อผู้ใช้ที่กรอกไว้
        </div>
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
    </RegisterModal>
  );
}