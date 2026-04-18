import RegisterModal from "@/components/face/RegisterModal";
import Input from "@/components/ui/Input";

export default function PasswordLoginModal({
  open,
  username,
  password,
  loading,
  onClose,
  onPasswordChange,
  onSubmit,
}) {
  return (
    <RegisterModal
      open={open}
      title="เข้าสู่ระบบด้วยรหัสผ่าน"
      onClose={onClose}
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
          ชื่อผู้ใช้: <span className="font-semibold">{username}</span>
        </div>

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={onPasswordChange}
          placeholder="กรอกรหัสผ่าน"
        />

        <button
          type="button"
          className="w-full rounded-xl bg-green-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
        </button>
      </div>
    </RegisterModal>
  );
}