def chatbot_response(score):
    percent = round(score * 100, 2)

    if percent > 75:
        return f"✅ Your CV matches {percent}% with this job. You are shortlisted!"
    elif percent > 50:
        return f"⚠️ Your CV matches {percent}%. You may be considered."
    else:
        return f"❌ Your CV matches only {percent}%. Not shortlisted."
