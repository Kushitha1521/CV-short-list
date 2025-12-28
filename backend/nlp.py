import spacy

nlp = spacy.load("en_core_web_sm")

SKILLS = [
    "python", "machine learning", "ai",
    "fastapi", "sql", "react", "java"
]

def extract_info(text):
    doc = nlp(text.lower())

    skills_found = [s for s in SKILLS if s in text.lower()]

    return {
        "skills": skills_found
    }
