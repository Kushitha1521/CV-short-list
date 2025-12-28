from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
import datetime
import os

REPORT_DIR = "reports"

def generate_pdf_report(results):
    filename = f"CV_Report_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    path = os.path.join(REPORT_DIR, filename)

    c = canvas.Canvas(path, pagesize=A4)
    width, height = A4

    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, height - 50, "AI-Powered CV Shortlisting Report")

    c.setFont("Helvetica", 10)
    c.drawString(50, height - 70, f"Generated on: {datetime.datetime.now()}")

    y = height - 110

    for idx, res in enumerate(results, start=1):
        if y < 100:
            c.showPage()
            y = height - 50

        c.setFont("Helvetica-Bold", 12)
        c.drawString(50, y, f"{idx}. {res['filename']}")

        c.setFont("Helvetica", 10)
        c.drawString(60, y - 15, f"Match Score: {res['score'] * 100:.2f}%")
        c.drawString(60, y - 30, f"Skills: {', '.join(res['skills'])}")

        y -= 60

    c.save()
    return path
