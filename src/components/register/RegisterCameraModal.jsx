import RegisterModal from "@/components/face/RegisterModal";
import CameraCapture from "@/components/face/CameraCapture";

export default function RegisterCameraModal({ open, onClose, onCapture }) {
  return (
    <RegisterModal
      open={open}
      title="ถ่ายรูปใบหน้า"
      onClose={onClose}
    >
      <CameraCapture onCapture={onCapture} onCancel={onClose} />
    </RegisterModal>
  );
}