from fastapi import FastAPI
import random

app = FastAPI()

# Akıllı Eşleştirme Sözlüğü
MATCHES = {
    "Latte": ["Kruvasan", "Vanilya Şurubu", "Çikolatalı Kurabiye"],
    "Espresso": ["Maden Suyu", "Bitter Çikolata", "Limonlu Tart"],
    "Americano": ["Yaban Mersinli Muffin", "Peynirli Kek"],
    "Mocha": ["Ekstra Krema", "Brownie"]
}

@app.get("/recommend")
async def get_recommendation(item: str):
    suggestions = MATCHES.get(item, ["Günün Tatlısı", "Ev Yapımı Kurabiye"])
    return {
        "user_choice": item,
        "ai_suggestions": random.sample(suggestions, min(len(suggestions), 2)),
        "engine": "FastAPI AI Recommender"
    }