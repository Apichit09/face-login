"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import RegisterModal from "@/components/face/RegisterModal";
import CameraCapture from "@/components/face/CameraCapture";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [progress, setProgress] = useState(0);

  const [consentOpen, setConsentOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [progressOpen, setProgressOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [invalidOpen, setInvalidOpen] = useState(false);

  const [invalidImages, setInvalidImages] = useState([]);

  useEffect(() => {
    const accepted = sessionStorage.getItem("register-consent");
    if (!accepted) setConsentOpen(true);
  }, []);

  useEffect(() => {
    if (!loading) return;

    let current = 0;
    const timer = setInterval(() => {
      current += Math.floor(Math.random() * 8) + 4;
      if (current > 92) current = 92;
      setProgress(current);
    }, 220);

    return () => clearInterval(timer);
  }, [loading]);

  useEffect(() => {
    return () => {
      files.forEach((item) => {
        if (item?.preview) {
          URL.revokeObjectURL(item.preview);
        }
      });
    };
  }, [files]);

  const selectedCount = useMemo(() => files.length, [files]);

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;

    const remain = 4 - files.length;
    const limitedSelected = selected.slice(0, remain);

    const mapped = limitedSelected.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setFiles((prev) => [...prev, ...mapped]);
    setErrorMessage("");
    setSuccessMessage("");

    e.target.value = "";
  };

  const handleCapturedFile = (capturedFile) => {
    if (files.length >= 4) {
      openErrorPopup("เลือกรูปครบ 4 รูปแล้ว");
      return;
    }

    const newItem = {
      file: capturedFile,
      preview: URL.createObjectURL(capturedFile),
    };

    setFiles((prev) => [...prev, newItem]);
    setErrorMessage("");
    setSuccessMessage("");
    setCameraOpen(false);
  };

  const removeFile = (indexToRemove) => {
    setFiles((prev) => {
      const target = prev[indexToRemove];
      if (target?.preview) {
        URL.revokeObjectURL(target.preview);
      }
      return prev.filter((_, index) => index !== indexToRemove);
    });
  };

  const resetForm = () => {
    files.forEach((item) => {
      if (item?.preview) {
        URL.revokeObjectURL(item.preview);
      }
    });

    setUsername("");
    setPassword("");
    setFiles([]);
    setErrorMessage("");
    setSuccessMessage("");
    setInvalidImages([]);
  };

  const openErrorPopup = (message) => {
    setErrorMessage(message);
    setErrorOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");
    setInvalidImages([]);

    if (!username.trim() || !password.trim()) {
      openErrorPopup("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
      return;
    }

    if (files.length !== 4) {
      openErrorPopup("กรุณาเลือกรูปใบหน้าให้ครบ 4 รูป");
      return;
    }

    try {
      setLoading(true);
      setProgress(5);
      setProgressOpen(true);

      const formData = new FormData();
      formData.append("username", username.trim());
      formData.append("password", password);

      for (const item of files) {
        formData.append("images", item.file);
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setProgress(100);

      if (!res.ok) {
        if (
          Array.isArray(data.invalidImages) &&
          data.invalidImages.length > 0
        ) {
          setInvalidImages(data.invalidImages);
          setInvalidOpen(true);
        } else {
          openErrorPopup(data.message || "ลงทะเบียนไม่สำเร็จ");
        }
        return;
      }

      setSuccessMessage(data.message || "ลงทะเบียนสำเร็จ");
      setSuccessOpen(true);
      resetForm();
    } catch (error) {
      openErrorPopup("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setTimeout(() => {
        setLoading(false);
        setProgressOpen(false);
        setProgress(0);
      }, 450);
    }
  };

  return (
    <div className="page-center px-4 py-6">
      <RegisterModal
        open={consentOpen}
        title="หนังสือยินยอมการใช้ข้อมูลใบหน้า"
        onClose={null}
      >
        <div className="text-sm leading-7 text-neutral-700">
          ระบบนี้จะนำภาพใบหน้าของผู้ใช้ไปประมวลผลเป็นเวกเตอร์ใบหน้า
          (Face Embedding / Vector) เพื่อใช้สำหรับการลงทะเบียนและยืนยันตัวตนเท่านั้น
          <br />
          <br />
          ภาพจะไม่ถูกนำไปใช้เพื่อวัตถุประสงค์อื่นนอกเหนือจากการทำงานของระบบต้นแบบ
          และการเปรียบเทียบความเหมือนของใบหน้าในการเข้าสู่ระบบ
        </div>

        <div className="mt-4 flex justify-center">
          <button
            type="button"
            className="rounded-xl bg-green-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-900"
            onClick={() => {
              sessionStorage.setItem("register-consent", "accepted");
              setConsentOpen(false);
            }}
          >
            ยินยอมและเริ่มใช้งาน
          </button>
        </div>
      </RegisterModal>

      <RegisterModal
        open={cameraOpen}
        title="ถ่ายรูปใบหน้า"
        onClose={() => setCameraOpen(false)}
      >
        <CameraCapture
          onCapture={handleCapturedFile}
          onCancel={() => setCameraOpen(false)}
        />
      </RegisterModal>

      <RegisterModal
        open={progressOpen}
        title="กำลังลงทะเบียน..."
        onClose={null}
      >
        <div className="flex flex-col items-center">
          <div className="mb-2 text-4xl">
            <img src="/icon/loading.gif" alt="loading" className="h-10 w-10" />
          </div>

          <div className="text-center text-sm leading-7 text-neutral-700">
            กรุณารอสักครู่ ระบบกำลังตรวจสอบข้อมูลและประมวลผลรูปใบหน้า
          </div>

          <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-green-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-700 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-2 text-sm font-bold text-green-800">
            {progress}%
          </div>
        </div>
      </RegisterModal>

      <RegisterModal
        open={successOpen}
        title="ลงทะเบียนสำเร็จ"
        onClose={() => setSuccessOpen(false)}
      >
        <div className="flex flex-col items-center">
          <div className="mb-2 text-4xl">
            <img src="/icon/check.gif" alt="check" className="h-10 w-10" />
          </div>

          <div className="text-center text-sm leading-7 text-neutral-700">
            {successMessage || "ระบบได้บันทึกข้อมูลเรียบร้อยแล้ว"}
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              className="rounded-xl bg-neutral-100 px-4 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-200"
              onClick={() => setSuccessOpen(false)}
            >
              ปิด
            </button>
            <button
              type="button"
              className="rounded-xl bg-green-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-900"
              onClick={() => router.push("/login")}
            >
              ไปหน้า Login
            </button>
          </div>
        </div>
      </RegisterModal>

      <RegisterModal
        open={errorOpen}
        title="เกิดข้อผิดพลาด"
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
        open={invalidOpen}
        title="รูปภาพบางรายการไม่ผ่านเงื่อนไข"
        onClose={() => setInvalidOpen(false)}
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
            onClick={() => setInvalidOpen(false)}
          >
            รับทราบ
          </button>
        </div>
      </RegisterModal>

      <form className="auth-card w-full max-w-[560px]" onSubmit={handleSubmit}>
        <h1 className="title">ลงทะเบียนใช้งาน</h1>

        <Input
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="ตั้งชื่อผู้ใช้"
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="ตั้งรหัสผ่าน"
        />

        <div className="form-group">
          <label className="form-label">อัปโหลดรูปใบหน้า 4 รูป</label>

          <div className="mt-2 rounded-xl border border-neutral-200 bg-white p-3">
            <input
              id="register-file-input"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFiles}
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
                onClick={() => {
                  if (files.length >= 4) {
                    openErrorPopup("เลือกรูปครบ 4 รูปแล้ว");
                    return;
                  }
                  setCameraOpen(true);
                }}
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
                        onClick={() => removeFile(index)}
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

        {errorMessage && !errorOpen && (
          <div className="mt-3 rounded-xl bg-red-100 px-3 py-2.5 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {successMessage && !successOpen && (
          <div className="mt-3 rounded-xl bg-green-100 px-3 py-2.5 text-sm text-green-800">
            {successMessage}
          </div>
        )}

        <div className="mt-4 flex flex-col gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? "กำลังลงทะเบียน..." : "ยืนยันการลงทะเบียน"}
          </Button>

          <button
            type="button"
            className="rounded-xl bg-neutral-100 px-4 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-200"
            onClick={() => router.push("/login")}
            disabled={loading}
          >
            ไปหน้า Login
          </button>
        </div>
      </form>
    </div>
  );
}
