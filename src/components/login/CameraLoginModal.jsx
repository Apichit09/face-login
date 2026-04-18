import RegisterModal from "@/components/face/RegisterModal";
import CameraCapture from "@/components/face/CameraCapture";

export default function CameraLoginModal({ open, onClose, onCapture }) {
  return (
    <RegisterModal
      open={open}
      title="ถ่ายรูปเพื่อเข้าสู่ระบบ"
      onClose={onClose}
    >
      <CameraCapture onCapture={onCapture} onCancel={onClose} />
    </RegisterModal>
  );
}