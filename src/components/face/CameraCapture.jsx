"use client";

import { useEffect, useRef, useState } from "react";

export default function CameraCapture({ onCapture, onCancel }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraError, setCameraError] = useState("");
  const [starting, setStarting] = useState(true);

  useEffect(() => {
    let mounted = true;

    const startCamera = async () => {
      try {
        setCameraError("");
        setStarting(true);

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("เบราว์เซอร์นี้ไม่รองรับการเปิดกล้อง");
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          await videoRef.current.play().catch((err) => {
            console.error("video play error:", err);
            throw new Error("ไม่สามารถเริ่มแสดงภาพจากกล้องได้");
          });
        }
      } catch (error) {
        console.error("startCamera error:", error);

        if (error.name === "NotAllowedError") {
          setCameraError("ไม่ได้รับอนุญาตให้ใช้กล้อง กรุณาอนุญาตการใช้งานกล้อง");
        } else if (error.name === "NotFoundError") {
          setCameraError("ไม่พบกล้องบนอุปกรณ์นี้");
        } else if (error.name === "NotReadableError") {
          setCameraError("กล้องกำลังถูกใช้งานโดยโปรแกรมอื่น");
        } else if (error.name === "OverconstrainedError") {
          setCameraError("กล้องไม่รองรับความละเอียดที่ร้องขอ");
        } else {
          setCameraError(error.message || "ไม่สามารถเปิดกล้องได้");
        }
      } finally {
        if (mounted) setStarting(false);
      }
    };

    startCamera();

    return () => {
      mounted = false;
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const file = new File([blob], `camera-face-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });

        stopCamera();
        onCapture(file);
      },
      "image/jpeg",
      0.95
    );
  };

  return (
    <div>
      {starting && !cameraError && (
        <div className="mb-3 rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-700">
          กำลังเปิดกล้อง...
        </div>
      )}

      {cameraError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {cameraError}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="block max-h-[420px] w-full object-cover"
            style={{ transform: "scaleX(-1)" }}
          />
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            stopCamera();
            onCancel();
          }}
          className="rounded-xl bg-neutral-100 px-4 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-neutral-200"
        >
          ยกเลิก
        </button>

        {!cameraError && !starting && (
          <button
            type="button"
            onClick={capturePhoto}
            className="rounded-xl bg-green-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-900"
          >
            จับภาพนี้
          </button>
        )}
      </div>
    </div>
  );
}