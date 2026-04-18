# python -m uvicorn main:app --reload --port 8000

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from typing import List
from PIL import Image, ImageOps
import numpy as np
import io
import cv2
import time
import math

from insightface.app import FaceAnalysis

app = FastAPI()

# ใช้ ArcFace / InsightFace pipeline
face_app = FaceAnalysis(name="buffalo_l")
face_app.prepare(ctx_id=-1, det_size=(320, 320))


# Utility Functions
def read_image(file_bytes: bytes) -> np.ndarray:
    """
    อ่านรูปและแก้ EXIF orientation
    สำคัญมากสำหรับรูปจากมือถือ
    """
    image = Image.open(io.BytesIO(file_bytes))
    image = ImageOps.exif_transpose(image).convert("RGB")
    return np.array(image)


def resize_if_needed(img_rgb: np.ndarray, max_side: int = 960) -> np.ndarray:
    """
    ลดขนาดรูปก่อน detect เพื่อให้เร็วขึ้น
    """
    h, w = img_rgb.shape[:2]
    longest = max(h, w)

    if longest <= max_side:
        return img_rgb

    scale = max_side / float(longest)
    new_w = max(1, int(w * scale))
    new_h = max(1, int(h * scale))

    return cv2.resize(img_rgb, (new_w, new_h), interpolation=cv2.INTER_AREA)


def select_primary_face(faces):
    """
    เลือกใบหน้าที่ใหญ่ที่สุดในภาพ
    """
    return max(
        faces,
        key=lambda f: (f.bbox[2] - f.bbox[0]) * (f.bbox[3] - f.bbox[1])
    )


def crop_face_with_margin(img_rgb: np.ndarray, face, margin_ratio: float = 0.25):
    """
    crop รอบใบหน้า พร้อม margin
    """
    h, w = img_rgb.shape[:2]
    x1, y1, x2, y2 = map(int, face.bbox)

    face_w = max(1, x2 - x1)
    face_h = max(1, y2 - y1)

    mx = int(face_w * margin_ratio)
    my = int(face_h * margin_ratio)

    nx1 = max(0, x1 - mx)
    ny1 = max(0, y1 - my)
    nx2 = min(w, x2 + mx)
    ny2 = min(h, y2 + my)

    return img_rgb[ny1:ny2, nx1:nx2]


def get_face_area_ratio(img_rgb: np.ndarray, face):
    h, w = img_rgb.shape[:2]
    x1, y1, x2, y2 = map(int, face.bbox)
    face_w = max(1, x2 - x1)
    face_h = max(1, y2 - y1)
    return (face_w * face_h) / float(w * h)


def compute_image_metrics(img_rgb: np.ndarray):
    gray = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2GRAY)
    brightness = float(np.mean(gray))
    blur_score = float(cv2.Laplacian(gray, cv2.CV_64F).var())

    return {
        "brightness": round(brightness, 2),
        "blur_score": round(blur_score, 2),
    }


def check_face_pose(face):
    """
    วัดความเอียงจาก 'มุมของเส้นเชื่อมตา' (องศา)
    ดีกว่าการใช้ส่วนต่างพิกเซลของแกน Y ตรง ๆ
    """
    eyes_visible = True
    tilt_score = 0.0

    if hasattr(face, "kps") and face.kps is not None and len(face.kps) >= 2:
        left_eye = face.kps[0]
        right_eye = face.kps[1]

        dx = float(right_eye[0] - left_eye[0])
        dy = float(right_eye[1] - left_eye[1])

        if abs(dx) < 1e-6:
            tilt_score = 90.0
        else:
            tilt_score = abs(math.degrees(math.atan2(dy, dx)))
    else:
        eyes_visible = False

    return {
        "tilt_score": round(tilt_score, 2),
        "eyes_visible": eyes_visible,
    }


def check_quality(img_rgb: np.ndarray, face):
    """
    Quality Gate แบบผ่อนปรนขึ้น
    และใช้มุมเอียงจริงแทนพิกเซลดิบ
    """

    face_area_ratio = get_face_area_ratio(img_rgb, face)
    image_metrics = compute_image_metrics(img_rgb)
    pose_metrics = check_face_pose(face)

    brightness = image_metrics["brightness"]
    blur_score = image_metrics["blur_score"]
    tilt_score = pose_metrics["tilt_score"]
    eyes_visible = pose_metrics["eyes_visible"]

    metrics = {
        "face_area_ratio": round(face_area_ratio, 4),
        "brightness": brightness,
        "blur_score": blur_score,
        "tilt_score": tilt_score,
        "eyes_visible": eyes_visible,
    }

    # Threshold
    MIN_FACE_AREA_RATIO_HARD = 0.02
    MIN_FACE_AREA_RATIO_SOFT = 0.05

    MIN_BRIGHTNESS = 35
    MIN_BLUR_SCORE = 25
    MAX_TILT_SCORE = 15   # เดิมควรแก้ให้เป็นองศา

    # เล็กมากจริงค่อย reject
    if face_area_ratio < MIN_FACE_AREA_RATIO_HARD:
        return (
            False,
            "FACE_TOO_SMALL_HARD",
            "ใบหน้าอยู่ไกลเกินไปมาก กรุณาขยับเข้าใกล้กล้อง",
            metrics,
        )

    # เล็กแต่ยังพอช่วยได้
    if face_area_ratio < MIN_FACE_AREA_RATIO_SOFT:
        return (
            False,
            "FACE_TOO_SMALL",
            "ใบหน้าอยู่ไกลเกินไป ระบบจะพยายามปรับกรอบใบหน้าให้อัตโนมัติ",
            metrics,
        )

    if brightness < MIN_BRIGHTNESS:
        return (
            False,
            "TOO_DARK",
            "ภาพมืดเกินไป กรุณาเพิ่มแสงหรือเปลี่ยนตำแหน่งถ่าย",
            metrics,
        )

    if blur_score < MIN_BLUR_SCORE:
        return (
            False,
            "TOO_BLURRY",
            "ภาพเบลอเกินไป กรุณาถ่ายใหม่โดยถือกล้องให้นิ่ง",
            metrics,
        )

    # ถ้าไม่เห็นตา แต่ตรวจจับหน้าได้แล้ว ยังไม่ต้อง reject ทันที
    if not eyes_visible:
        return True, "OK_NO_EYE_CHECK", "ผ่านเกณฑ์คุณภาพภาพ", metrics

    if tilt_score > MAX_TILT_SCORE:
        return (
            False,
            "FACE_TILT_TOO_MUCH",
            f"ใบหน้าเอียงมากเกินไป ({tilt_score}°) กรุณาหันหน้าให้ตรงมากขึ้น",
            metrics,
        )

    return True, "OK", "ผ่านเกณฑ์คุณภาพภาพ", metrics


def try_extract_from_cropped_face(original_img_rgb: np.ndarray, original_face):
    """
    กรณีหน้าเล็ก -> crop + resize + detect ใหม่
    """
    cropped = crop_face_with_margin(original_img_rgb, original_face, margin_ratio=0.25)

    if cropped.size == 0:
        return {
            "success": False,
            "reason_code": "CROP_FAILED",
            "message": "ระบบไม่สามารถตัดภาพใบหน้าได้ กรุณาถ่ายใหม่",
            "metrics": {},
        }

    cropped = cv2.resize(cropped, (320, 320), interpolation=cv2.INTER_AREA)

    faces2 = face_app.get(cropped)
    if len(faces2) == 0:
        return {
            "success": False,
            "reason_code": "NO_FACE_AFTER_CROP",
            "message": "ระบบไม่สามารถเตรียมภาพใบหน้าได้ กรุณาถ่ายใหม่",
            "metrics": {},
        }

    face2 = select_primary_face(faces2)

    ok2, reason_code2, message2, metrics2 = check_quality(cropped, face2)

    # ถ้ายังมีปัญหาเรื่อง brightness/blur/tilt ค่อย reject
    if not ok2 and reason_code2 not in ["FACE_TOO_SMALL", "FACE_TOO_SMALL_HARD"]:
        return {
            "success": False,
            "reason_code": reason_code2,
            "message": message2,
            "metrics": metrics2,
        }

    embedding = face2.embedding.tolist()

    return {
        "success": True,
        "reason_code": "OK_AFTER_CROP",
        "message": "ผ่านเกณฑ์คุณภาพภาพหลังปรับกรอบใบหน้า",
        "embedding": embedding,
        "metrics": metrics2,
    }


def extract_embedding_with_quality_check(img_rgb: np.ndarray):
    """
    ตรวจจับใบหน้า -> เลือกใบหน้าหลัก -> ตรวจ Quality Gate -> ดึง embedding
    """
    faces = face_app.get(img_rgb)

    if len(faces) == 0:
        return {
            "success": False,
            "reason_code": "NO_FACE",
            "message": "ไม่พบใบหน้าในภาพ กรุณาถ่ายใหม่",
            "metrics": {},
        }

    face = select_primary_face(faces)

    ok, reason_code, message, metrics = check_quality(img_rgb, face)

    # ถ้าเล็กนิดหน่อย -> crop ช่วยก่อน
    if not ok and reason_code == "FACE_TOO_SMALL":
        return try_extract_from_cropped_face(img_rgb, face)

    # เล็กมากจริงค่อย reject
    if not ok and reason_code == "FACE_TOO_SMALL_HARD":
        return {
            "success": False,
            "reason_code": reason_code,
            "message": message,
            "metrics": metrics,
        }

    if not ok:
        return {
            "success": False,
            "reason_code": reason_code,
            "message": message,
            "metrics": metrics,
        }

    embedding = face.embedding.tolist()

    return {
        "success": True,
        "reason_code": reason_code,
        "message": message,
        "embedding": embedding,
        "metrics": metrics,
    }


def run_pipeline_with_timing(img_rgb: np.ndarray):
    start = time.perf_counter()
    result = extract_embedding_with_quality_check(img_rgb)
    elapsed_ms = int((time.perf_counter() - start) * 1000)
    result["inference_time_ms"] = elapsed_ms
    return result


# API Routes
@app.get("/")
async def root():
    return {"message": "FastAPI ArcFace backend is running"}


@app.post("/enroll")
async def enroll(
    username: str = Form(...),
    images: List[UploadFile] = File(...)
):
    if len(images) != 4:
        raise HTTPException(status_code=400, detail="Enrollment ต้องใช้ 4 รูป")

    embeddings = []
    all_metrics = []
    total_inference_time_ms = 0

    for idx, image in enumerate(images):
        file_bytes = await image.read()
        img = read_image(file_bytes)
        img = resize_if_needed(img, max_side=960)

        result = run_pipeline_with_timing(img)
        total_inference_time_ms += result.get("inference_time_ms", 0)

        if not result["success"]:
            return {
                "success": False,
                "username": username,
                "failed_index": idx,
                "failed_image_number": idx + 1,
                "reason_code": result["reason_code"],
                "message": f"รูปที่ {idx + 1}: {result['message']}",
                "metrics": result.get("metrics", {}),
                "inference_time_ms": result.get("inference_time_ms", 0),
            }

        embeddings.append(result["embedding"])
        all_metrics.append({
            "image_number": idx + 1,
            "reason_code": result.get("reason_code", "OK"),
            "message": result.get("message", ""),
            "metrics": result.get("metrics", {}),
            "inference_time_ms": result.get("inference_time_ms", 0),
        })

    return {
        "success": True,
        "username": username,
        "message": "ลงทะเบียนใบหน้าสำเร็จ",
        "embeddings": embeddings,
        "quality_metrics": all_metrics,
        "total_inference_time_ms": total_inference_time_ms,
        "avg_inference_time_ms": int(total_inference_time_ms / 4) if len(images) == 4 else 0,
    }


@app.post("/embed")
async def embed(
    username: str = Form(...),
    image: UploadFile = File(...)
):
    file_bytes = await image.read()
    img = read_image(file_bytes)
    img = resize_if_needed(img, max_side=960)

    result = run_pipeline_with_timing(img)

    if not result["success"]:
        return {
            "success": False,
            "username": username,
            "reason_code": result["reason_code"],
            "message": result["message"],
            "metrics": result.get("metrics", {}),
            "inference_time_ms": result.get("inference_time_ms", 0),
        }

    return {
        "success": True,
        "username": username,
        "reason_code": result.get("reason_code", "OK"),
        "message": result.get("message", "สร้าง embedding สำเร็จ"),
        "embedding": result["embedding"],
        "metrics": result.get("metrics", {}),
        "inference_time_ms": result.get("inference_time_ms", 0),
    }