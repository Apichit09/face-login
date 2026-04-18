import RegisterModal from "@/components/face/RegisterModal";

export default function RegisterInvalidImagesModal({
  open,
  invalidImages,
  onClose,
}) {
  return (
    <RegisterModal
      open={open}
      title="รูปภาพบางรายการไม่ผ่านเงื่อนไข"
      onClose={onClose}
    >
      <div className="mb-3 text-sm leading-7 text-neutral-700">
        กรุณาตรวจสอบรูปที่มีปัญหาด้านล่าง และเปลี่ยนเฉพาะรูปที่ไม่ผ่าน
      </div>

      <div className="space-y-3">
        {invalidImages.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-700">
            ไม่พบรายละเอียดของรูปที่มีปัญหา
          </div>
        ) : (
          invalidImages.map((item, index) => (
            <div
              key={`${item.name || "image"}-${index}`}
              className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-900"
            >
              <strong>
                รูปที่ {item.index ?? index + 1}
                {item.name ? ` - ${item.name}` : ""}
              </strong>
              <div className="mt-1">
                สาเหตุ: {item.reason || "รูปภาพไม่ผ่านเงื่อนไขของระบบ"}
              </div>
            </div>
          ))
        )}
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