# Face Login Web Application Using Deep Learning

## Overview
เว็บแอปต้นแบบสำหรับสมัครสมาชิก ลงทะเบียนใบหน้า และเข้าสู่ระบบด้วยใบหน้า โดยใช้ Next.js, FastAPI, ArcFace และ MySQL

## Tech Stack
- Next.js
- FastAPI
- InsightFace / ArcFace
- MySQL
- Google Colab for experiments

## Installation
npm install
cd ArcFace
pip install -r requirements.txt

## Run
python -m uvicorn main:app --reload --port 8000
npm run dev

## Environment Variables
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
PYTHON_API_URL=http://127.0.0.1:8000
NEXT_PUBLIC_THRESHOLD=0.60

## Main Features
- Register + Face Enrollment
- Facial Login
- Result Page
- Admin Dashboard
- Login Logs
