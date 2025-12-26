from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import os
from extractor import extract_text
from matcher import match_score

app = FastAPI()

# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.post("/shortlist")
async def shortlist(job_description: str = Form(...), files: list[UploadFile] = File(...)):
    results = []
    for file in files:
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        with open(file_path, "wb") as f:
            f.write(await file.read())

        cv_text = extract_text(file_path)
        score = match_score(cv_text, job_description)
        results.append({"filename": file.filename, "score": round(score, 2)})

    results.sort(key=lambda x: x["score"], reverse=True)
    return {"shortlisted": results[:5]}  # top 5
