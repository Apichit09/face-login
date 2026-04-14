"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files || []).slice(0, 4);
    setFiles(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
      return;
    }

    if (files.length !== 4) {
      alert("กรุณาเลือกรูปให้ครบ 4 รูป");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      for (const file of files) {
        formData.append("images", file);
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "ลงทะเบียนไม่สำเร็จ");
        return;
      }

      alert(data.message || "ลงทะเบียนสำเร็จ");
      setUsername("");
      setPassword("");
      setFiles([]);
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center">
      <form className="auth-card" onSubmit={handleSubmit}>
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
          <input type="file" accept="image/*" multiple onChange={handleFiles} />
        </div>

        <Button type="submit">
          {loading ? "กำลังลงทะเบียน..." : "ยืนยันการลงทะเบียน"}
        </Button>
      </form>
    </div>
  );
}