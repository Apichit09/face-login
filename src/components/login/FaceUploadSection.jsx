export default function FaceUploadSection({
  loading,
  fileItem,
  onGuideOpen,
  onSelectFile,
  onOpenCamera,
  onRemoveFile,
}) {
  return (
    <div className="form-group">
      <div className="mb-2 flex items-center justify-between gap-2">
        <label className="form-label !mb-0">เลือกรูปใบหน้า</label>

        <button
          type="button"
          className="text-sm font-medium text-green-800 transition hover:text-green-900"
          onClick={onGuideOpen}
        >
          คำแนะนำ
        </button>
      </div>

      <div className="mt-2 rounded-xl border border-neutral-200 bg-white p-3">
        <input
          id="login-file-input"
          type="file"
          accept="image/*"
          disabled={loading}
          onChange={onSelectFile}
          className="hidden"
        />

        <div className="flex flex-wrap gap-2">
          <label
            htmlFor="login-file-input"
            className="inline-flex min-w-[130px] cursor-pointer items-center justify-center rounded-xl bg-neutral-100 px-4 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-neutral-200"
          >
            อัปโหลดรูป
          </label>

          <button
            type="button"
            className="min-w-[150px] rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            onClick={onOpenCamera}
            disabled={loading}
          >
            เปิดกล้องถ่ายรูป
          </button>
        </div>

        <small className="mt-3 block text-xs text-neutral-500">
          เลือกได้ 1 รูป สำหรับใช้ยืนยันตัวตนด้วยใบหน้า
        </small>
      </div>

      <div className="mt-3 rounded-xl border border-neutral-200 bg-white p-3">
        <div className="mb-2 text-sm font-semibold text-neutral-900">
          รูปที่เลือก
        </div>

        {!fileItem ? (
          <div className="text-sm text-neutral-500">ยังไม่มีรูปที่เลือก</div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
            <div className="aspect-[4/3] w-full bg-neutral-200">
              <img
                src={fileItem.preview}
                alt="login-preview"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="space-y-2 p-3">
              <div className="text-xs font-bold text-green-800">
                พร้อมสำหรับการตรวจสอบ
              </div>

              <div className="break-words text-sm text-neutral-800">
                {fileItem.file.name}
              </div>

              <button
                type="button"
                className="w-full rounded-xl bg-red-100 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-200"
                onClick={onRemoveFile}
                disabled={loading}
              >
                ลบรูปนี้
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}