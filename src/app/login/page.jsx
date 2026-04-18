"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import RegisterModal from "@/components/face/RegisterModal";
import CameraCapture from "@/components/face/CameraCapture";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fileItem, setFileItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [progress, setProgress] = useState(0);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [progressOpen, setProgressOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  const [progressTitle, setProgressTitle] = useState("กำลังตรวจสอบ...");

  useEffect(() => {
    if (!loading) return;

    let current = 0;
    const timer = setInterval(() => {
      current += Math.floor(Math.random() * 10) + 5;
      if (current > 92) current = 92;
      setProgress(current);
    }, 220);

    return () => clearInterval(timer);
  }, [loading]);

  useEffect(() => {
    return () => {
      if (fileItem?.preview) {
        URL.revokeObjectURL(fileItem.preview);
      }
    };
  }, [fileItem]);

  const openErrorPopup = (message) => {
    setErrorMessage(message);
    setErrorOpen(true);
  };

  const handleSelectFile = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (fileItem?.preview) {
      URL.revokeObjectURL(fileItem.preview);
    }

    setFileItem({
      file: selected,
      preview: URL.createObjectURL(selected),
    });

    setErrorMessage("");
    e.target.value = "";
  };

  const handleCapturedFile = (capturedFile) => {
    if (fileItem?.preview) {
      URL.revokeObjectURL(fileItem.preview);
    }

    setFileItem({
      file: capturedFile,
      preview: URL.createObjectURL(capturedFile),
    });

    setErrorMessage("");
    setCameraOpen(false);
  };

  const removeFile = () => {
    if (fileItem?.preview) {
      URL.revokeObjectURL(fileItem.preview);
    }
    setFileItem(null);
  };

  const startProgress = (title = "กำลังตรวจสอบ...") => {
    setProgressTitle(title);
    setLoading(true);
    setProgress(5);
    setProgressOpen(true);
  };

  const stopProgress = () => {
    setTimeout(() => {
      setLoading(false);
      setProgressOpen(false);
      setProgress(0);
    }, 450);
  };

  const openPasswordPopup = () => {
    setErrorMessage("");

    if (!username.trim()) {
      openErrorPopup("กรุณากรอกชื่อผู้ใช้ก่อน");
      return;
    }

    setPassword("");
    setPasswordOpen(true);
  };

  const handleFaceLogin = async () => {
    setErrorMessage("");

    if (!username.trim()) {
      openErrorPopup("กรุณากรอกชื่อผู้ใช้");
      return;
    }

    if (!fileItem?.file) {
      openErrorPopup("กรุณาเลือกรูปใบหน้า");
      return;
    }

    try {
      startProgress("กำลังตรวจสอบใบหน้า...");

      const formData = new FormData();
      formData.append("username", username.trim());
      formData.append("image", fileItem.file);

      const res = await fetch("/api/face/verify", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setProgress(100);

      if (!res.ok) {
        openErrorPopup(data.message || "เข้าสู่ระบบไม่สำเร็จ");
        return;
      }

      if (data.result === "QUALITY_FAILED") {
        openErrorPopup(data.message || "ภาพไม่ผ่านเกณฑ์คุณภาพ กรุณาถ่ายใหม่");
        return;
      }

      const params = new URLSearchParams({
        result: String(data.result || ""),
        similarity: String(data.similarity || "0.0000"),
        threshold: String(data.threshold || "0.60"),
        inferenceTime: String(data.inferenceTime || 0),
        message: String(data.message || ""),
        loginType: "face",
      });

      if (data.reasonCode) {
        params.append("reasonCode", String(data.reasonCode));
      }

      router.push(`/result?${params.toString()}`);
    } catch (error) {
      openErrorPopup("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      stopProgress();
    }
  };

  const handlePasswordLogin = async () => {
    setErrorMessage("");

    if (!username.trim()) {
      openErrorPopup("กรุณากรอกชื่อผู้ใช้ก่อน");
      return;
    }

    if (!password.trim()) {
      openErrorPopup("กรุณากรอกรหัสผ่าน");
      return;
    }

    try {
      startProgress("กำลังตรวจสอบรหัสผ่าน...");

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await res.json();
      setProgress(100);

if (!res.ok || !data.success) {
  setPasswordOpen(false);
  setPassword("");
  openErrorPopup(data.message || "รหัสผ่านไม่ถูกต้อง");
  return;
}

      setPasswordOpen(false);

      const params = new URLSearchParams({
        result: "PASSWORD_SUCCESS",
        similarity: "0.0000",
        threshold: "0.0000",
        inferenceTime: "0",
        message: String(data.message || "เข้าสู่ระบบด้วยรหัสผ่านสำเร็จ"),
        loginType: "password",
      });

      router.push(`/result?${params.toString()}`);
    } catch (error) {
      openErrorPopup("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      stopProgress();
    }
  };

  return (
    <div className="page-center px-4 py-6">
      <RegisterModal
        open={cameraOpen}
        title="ถ่ายรูปเพื่อเข้าสู่ระบบ"
        onClose={() => setCameraOpen(false)}
      >
        <CameraCapture
          onCapture={handleCapturedFile}
          onCancel={() => setCameraOpen(false)}
        />
      </RegisterModal>

      <RegisterModal open={progressOpen} title={progressTitle} onClose={null}>
        <div className="flex flex-col items-center">
          <div className="mb-2 text-4xl">
            <img src="/icon/loading.gif" alt="loading" className="h-10 w-10" />
          </div>

          <div className="text-center text-sm leading-7 text-neutral-700">
            กรุณารอสักครู่ ระบบกำลังตรวจสอบข้อมูลการเข้าสู่ระบบ
          </div>

          <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-green-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-700 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-2 text-sm font-bold text-green-800">{progress}%</div>
        </div>
      </RegisterModal>

      <RegisterModal
        open={errorOpen}
        title="ไม่สามารถเข้าสู่ระบบได้"
        onClose={() => setErrorOpen(false)}
      >
        <div className="flex flex-col items-center">
          <div className="mb-2 text-4xl">
            <img src="/icon/alert.gif" alt="alert" className="h-10 w-10" />
          </div>

          <div className="text-center text-sm leading-7 text-neutral-700">
            {errorMessage || "กรุณาตรวจสอบข้อมูลแล้วลองใหม่อีกครั้ง"}
          </div>

          <div className="mt-4 flex justify-center">
            <button
              type="button"
              className="rounded-xl bg-green-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-900"
              onClick={() => setErrorOpen(false)}
            >
              รับทราบ
            </button>
          </div>
        </div>
      </RegisterModal>

      <RegisterModal
        open={guideOpen}
        title="คำแนะนำการเข้าสู่ระบบ"
        onClose={() => setGuideOpen(false)}
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
            onClick={() => setGuideOpen(false)}
          >
            รับทราบ
          </button>
        </div>
      </RegisterModal>

      <RegisterModal
        open={passwordOpen}
        title="เข้าสู่ระบบด้วยรหัสผ่าน"
        onClose={() => setPasswordOpen(false)}
      >
        <div className="space-y-4">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
            ชื่อผู้ใช้: <span className="font-semibold">{username}</span>
          </div>

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrorMessage("");
            }}
            placeholder="กรอกรหัสผ่าน"
          />

          <button
            type="button"
            className="w-full rounded-xl bg-green-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handlePasswordLogin}
            disabled={loading}
          >
            {loading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
          </button>
        </div>
      </RegisterModal>

      <div className="auth-card w-full max-w-[560px]">
        <h1 className="title">เข้าสู่ระบบ</h1>

        <Input
          label="Username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setErrorMessage("");
          }}
          placeholder="กรอกชื่อผู้ใช้"
        />

        <div className="form-group">
          <div className="mb-2 flex items-center justify-between gap-2">
            <label className="form-label !mb-0">เลือกรูปใบหน้า</label>

            <button
              type="button"
              className="text-sm font-medium text-green-800 transition hover:text-green-900"
              onClick={() => setGuideOpen(true)}
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
              onChange={handleSelectFile}
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
                onClick={() => setCameraOpen(true)}
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
                    onClick={removeFile}
                    disabled={loading}
                  >
                    ลบรูปนี้
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {errorMessage && !errorOpen && (
          <div className="mt-3 rounded-xl bg-amber-100 px-3 py-2.5 text-sm text-amber-800">
            {errorMessage}
          </div>
        )}

        <div className="mt-4 flex flex-col gap-2">
          <Button onClick={handleFaceLogin} disabled={loading}>
            {loading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบด้วยใบหน้า"}
          </Button>

          <button
            type="button"
            className="rounded-xl bg-neutral-100 px-4 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-200"
            onClick={() => router.push("/register")}
            disabled={loading}
          >
            ไปหน้าสมัครสมาชิก
          </button>
        </div>

        <div className="mt-5 text-center">
          <button
            type="button"
            className="text-sm text-neutral-600 underline underline-offset-4 transition hover:text-neutral-900"
            onClick={openPasswordPopup}
          >
            ใช้รหัสผ่านแทน
          </button>
        </div>
      </div>
    </div>
  );
}