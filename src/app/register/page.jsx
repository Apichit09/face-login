"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import RegisterConsentModal from "@/components/register/RegisterConsentModal";
import RegisterCameraModal from "@/components/register/RegisterCameraModal";
import RegisterProgressModal from "@/components/register/RegisterProgressModal";
import RegisterSuccessModal from "@/components/register/RegisterSuccessModal";
import RegisterErrorModal from "@/components/register/RegisterErrorModal";
import RegisterInvalidImagesModal from "@/components/register/RegisterInvalidImagesModal";
import RegisterFaceUploadSection from "@/components/register/RegisterFaceUploadSection";

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
      <RegisterConsentModal
        open={consentOpen}
        onAccept={() => {
          sessionStorage.setItem("register-consent", "accepted");
          setConsentOpen(false);
        }}
      />

      <RegisterCameraModal
        open={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={handleCapturedFile}
      />

      <RegisterProgressModal open={progressOpen} progress={progress} />

      <RegisterSuccessModal
        open={successOpen}
        message={successMessage}
        onClose={() => setSuccessOpen(false)}
        onGoLogin={() => router.push("/login")}
      />

      <RegisterErrorModal
        open={errorOpen}
        message={errorMessage}
        onClose={() => setErrorOpen(false)}
      />

      <RegisterInvalidImagesModal
        open={invalidOpen}
        invalidImages={invalidImages}
        onClose={() => setInvalidOpen(false)}
      />

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

        <RegisterFaceUploadSection
          files={files}
          loading={loading}
          selectedCount={selectedCount}
          onChangeFiles={handleFiles}
          onOpenCamera={() => {
            if (files.length >= 4) {
              openErrorPopup("เลือกรูปครบ 4 รูปแล้ว");
              return;
            }
            setCameraOpen(true);
          }}
          onRemoveFile={removeFile}
        />

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