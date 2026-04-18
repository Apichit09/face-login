"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import CameraLoginModal from "@/components/login/CameraLoginModal";
import LoginProgressModal from "@/components/login/LoginProgressModal";
import LoginErrorModal from "@/components/login/LoginErrorModal";
import LoginGuideModal from "@/components/login/LoginGuideModal";
import PasswordLoginModal from "@/components/login/PasswordLoginModal";
import FaceUploadSection from "@/components/login/FaceUploadSection";

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
      <CameraLoginModal
        open={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={handleCapturedFile}
      />

      <LoginProgressModal
        open={progressOpen}
        title={progressTitle}
        progress={progress}
      />

      <LoginErrorModal
        open={errorOpen}
        message={errorMessage}
        onClose={() => setErrorOpen(false)}
      />

      <LoginGuideModal
        open={guideOpen}
        onClose={() => setGuideOpen(false)}
      />

      <PasswordLoginModal
        open={passwordOpen}
        username={username}
        password={password}
        loading={loading}
        onClose={() => setPasswordOpen(false)}
        onPasswordChange={(e) => {
          setPassword(e.target.value);
          setErrorMessage("");
        }}
        onSubmit={handlePasswordLogin}
      />

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

        <FaceUploadSection
          loading={loading}
          fileItem={fileItem}
          onGuideOpen={() => setGuideOpen(true)}
          onSelectFile={handleSelectFile}
          onOpenCamera={() => setCameraOpen(true)}
          onRemoveFile={removeFile}
        />

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