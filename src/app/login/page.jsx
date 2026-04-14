"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username) {
      alert("กรุณากรอกชื่อผู้ใช้");
      return;
    }

    if (!file) {
      alert("กรุณาเลือกรูปใบหน้า");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("username", username);
      formData.append("image", file);

      const res = await fetch("/api/face/verify", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "เข้าสู่ระบบไม่สำเร็จ");
        return;
      }

      const params = new URLSearchParams({
        result: data.result,
        similarity: String(data.similarity),
        threshold: String(data.threshold),
        inferenceTime: String(data.inferenceTime),
      });

      router.push(`/result?${params.toString()}`);
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center">
      <div className="auth-card">
        <h1 className="title">เข้าสู่ระบบ</h1>

        <Input
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="กรอกชื่อผู้ใช้"
        />

        <div className="form-group">
          <label className="form-label">เลือกรูปใบหน้า</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>

        <Button onClick={handleLogin}>
          {loading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบด้วยใบหน้า"}
        </Button>
      </div>
    </div>
  );
}