export default function RegisterFaceUploadSection({
  files,
  loading,
  selectedCount,
  onChangeFiles,
  onOpenCamera,
  onRemoveFile,
}) {
  return (
    <div className="form-group">
      <label className="form-label">อัปโหลดรูปใบหน้า 4 รูป</label>

      <div className="mt-2 rounded-xl border border-neutral-200 bg-white p-3">
        <input
          id="register-file-input"
          type="file"
          accept="image/*"
          multiple
          onChange={onChangeFiles}
          disabled={loading || files.length >= 4}
          className="hidden"
        />

        <div className="flex flex-wrap gap-2">
          <label
            htmlFor="register-file-input"
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
          เลือกได้สูงสุด 4 รูป หรือถ่ายจากกล้องทีละรูปจนกว่าจะครบ
        </small>
      </div>

      <div className="mt-3 rounded-xl border border-neutral-200 bg-white p-3">
        <div className="mb-2 text-sm font-semibold text-neutral-900">
          คำแนะนำการถ่ายภาพ
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="flex flex-col gap-1 rounded-xl border border-neutral-100 bg-neutral-50 p-3 text-sm">
            <strong>รูปที่ 1</strong>
            <span className="text-neutral-600">หน้าตรง</span>
          </div>
          <div className="flex flex-col gap-1 rounded-xl border border-neutral-100 bg-neutral-50 p-3 text-sm">
            <strong>รูปที่ 2</strong>
            <span className="text-neutral-600">หน้าตรง</span>
          </div>
          <div className="flex flex-col gap-1 rounded-xl border border-neutral-100 bg-neutral-50 p-3 text-sm">
            <strong>รูปที่ 3</strong>
            <span className="text-neutral-600">หันซ้ายเล็กน้อย</span>
          </div>
          <div className="flex flex-col gap-1 rounded-xl border border-neutral-100 bg-neutral-50 p-3 text-sm">
            <strong>รูปที่ 4</strong>
            <span className="text-neutral-600">หันขวาเล็กน้อย</span>
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-neutral-200 bg-white p-3">
        <div className="mb-2 text-sm font-semibold text-neutral-900">
          เลือกรูปแล้ว {selectedCount} / 4 รูป
        </div>

        {files.length === 0 ? (
          <div className="text-sm text-neutral-500">
            ยังไม่มีรูปที่เลือก
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {files.map((item, index) => (
              <div
                key={`${item.file.name}-${index}`}
                className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50"
              >
                <div className="aspect-[4/3] w-full bg-neutral-200">
                  <img
                    src={item.preview}
                    alt={`preview-${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="space-y-2 p-3">
                  <div className="text-xs font-bold text-green-800">
                    รูปที่ {index + 1}
                  </div>

                  <div className="break-words text-sm text-neutral-800">
                    {item.file.name}
                  </div>

                  <button
                    type="button"
                    className="w-full rounded-xl bg-red-100 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-200"
                    onClick={() => onRemoveFile(index)}
                    disabled={loading}
                  >
                    ลบรูปนี้
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}