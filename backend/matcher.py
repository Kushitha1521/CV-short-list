from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer("all-MiniLM-L6-v2")

def match_score(cv_text, job_text):
    embeddings = model.encode([cv_text, job_text])
    score = util.cos_sim(embeddings[0], embeddings[1])
    return float(score)
