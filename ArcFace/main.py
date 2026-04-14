from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from typing import List
from PIL import Image
import numpy as np
import io

from insightface.app import FaceAnalysis

app = FastAPI()

# ถ้าไม่มี GPU ให้ใช้ ctx_id=-1
face_app = FaceAnalysis(name="buffalo_l")
face_app.prepare(ctx_id=-1, det_size=(640, 640))

def read_image(file_bytes: bytes):
    image = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    return np.array(image)

def extract_embedding_from_image(img: np.ndarray):
    faces = face_app.get(img)
    if len(faces) == 0:
        raise HTTPException(status_code=400, detail="ไม่พบใบหน้าในภาพ")
    # ใช้ใบหน้าแรก
    return faces[0].embedding.tolist()

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

    for image in images:
        file_bytes = await image.read()
        img = read_image(file_bytes)
        emb = extract_embedding_from_image(img)
        embeddings.append(emb)

    return {
        "success": True,
        "username": username,
        "embeddings": embeddings
    }

@app.post("/embed")
async def embed(
    username: str = Form(...),
    image: UploadFile = File(...)
):
    file_bytes = await image.read()
    img = read_image(file_bytes)
    emb = extract_embedding_from_image(img)

    return {
        "success": True,
        "username": username,
        "embedding": emb
    }