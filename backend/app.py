from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import os

from extractor import extract_text
from nlp import extract_info
from matcher import calculate_match
from report import generate_pdf_report
from fastapi.responses import FileResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

UPLOAD_DIR = "uploads"
REPORT_DIR = "reports"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(REPORT_DIR, exist_ok=True)

@app.get("/")
@app.head("/")
async def root():
    return {"status": "active"}

@app.post("/shortlist")
async def shortlist(
    job_description: str = Form(...),
    cvs: list[UploadFile] = File(...)
):
    results = []

    for cv in cvs:
        path = f"{UPLOAD_DIR}/{cv.filename}"
        with open(path, "wb") as f:
            f.write(await cv.read())

        cv_text = extract_text(path)
        skills = extract_info(cv_text)["skills"]
        score = calculate_match(cv_text, job_description)

        results.append({
            "filename": cv.filename,
            "score": round(score, 2),
            "skills": skills
        })

    # Sort by score
    results.sort(key=lambda x: x["score"], reverse=True)

    # Generate PDF
    pdf_path = generate_pdf_report(results)

    return {
        "candidates": results,
        "report_url": f"/download/{os.path.basename(pdf_path)}"
    }

@app.get("/download/{filename}")
def download_report(filename: str):
    return FileResponse(
        path=f"reports/{filename}",
        filename=filename,
        media_type="application/pdf"
    )