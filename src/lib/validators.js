export function validateRegisterInput({ username, password, images }) {
  if (!username || !password) {
    return "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน";
  }

  if (!images || images.length !== 4) {
    return "กรุณาอัปโหลดภาพใบหน้าให้ครบ 4 ภาพ";
  }

  return null;
}

export function validateLoginInput({ username, image }) {
  if (!username) {
    return "กรุณากรอกชื่อผู้ใช้";
  }

  if (!image) {
    return "กรุณาอัปโหลดภาพใบหน้า";
  }

  return null;
}