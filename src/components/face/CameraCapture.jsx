"use client";

export default function CameraCapture({
  onCapture,
  title = "คลิกเพื่อเปิดกล้อง",
}) {
  const handleChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    onCapture?.({ file, previewUrl });
  };

  return (
    <div className="camera-box">
      <div className="camera-oval">
        <div>
          <div style={{ fontSize: "2rem", marginBottom: 8 }}>📷</div>
          <div>{title}</div>
        </div>
      </div>

      <input
        type="file"
        accept="image/*"
        capture="user"
        onChange={handleChange}
      />
    </div>
  );
}