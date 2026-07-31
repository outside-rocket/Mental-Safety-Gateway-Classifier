import sqlite3
import numpy as np
from transformers import AutoTokenizer
import onnxruntime as ort

# ==========================
# Model Setup
# ==========================

MODEL_DIR = "./model"

tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
ort_session = ort.InferenceSession(f"{MODEL_DIR}/model.onnx")

ACTION_MAPPING = {
    0: "SAFE: Allow request normally.",
    1: "MILD: Log search query.",
    2: "MODERATE: Display self-care resources.",
    3: "HIGH: Alert admin dashboard.",
    4: "EMERGENCY: Intercept DNS & show crisis helpline."
}

# ==========================
# SQLite Setup
# ==========================

conn = sqlite3.connect("dashboard.db")
cursor = conn.cursor()

# (Optional) Better performance if dashboard is reading simultaneously
cursor.execute("PRAGMA journal_mode=WAL;")

cursor.execute("""
CREATE TABLE IF NOT EXISTS predictions(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    query TEXT NOT NULL,
    risk_level INTEGER NOT NULL,
    confidence REAL NOT NULL,
    action TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)
""")

conn.commit()

# ==========================
# Inference Function
# ==========================

def analyze_query(query_text):
    inputs = tokenizer(
        query_text,
        return_tensors="np",
        max_length=128,
        padding="max_length",
        truncation=True
    )

    onnx_inputs = {
        "input_ids": inputs["input_ids"].astype(np.int64),
        "attention_mask": inputs["attention_mask"].astype(np.int64),
        "token_type_ids": inputs["token_type_ids"].astype(np.int64)
    }

    logits = ort_session.run(None, onnx_inputs)[0]

    probabilities = np.exp(logits) / np.sum(np.exp(logits), axis=-1, keepdims=True)

    predicted_class = int(np.argmax(probabilities))
    confidence = float(probabilities[0][predicted_class])

    return {
        "query": query_text,
        "risk_level": predicted_class,
        "confidence": round(confidence, 4),
        "action": ACTION_MAPPING[predicted_class]
    }

# ==========================
# Main Loop
# ==========================

try:
    while True:
        query = input(">> ").strip()

        if query == "":
            continue

        res = analyze_query(query)

        cursor.execute("""
        INSERT INTO predictions(query, risk_level, confidence, action)
        VALUES (?, ?, ?, ?)
        """, (
            res["query"],
            res["risk_level"],
            res["confidence"],
            res["action"]
        ))

        conn.commit()

        print(
            f"[{res['risk_level']}] "
            f"{res['query']} -> {res['action']} "
            f"(Conf: {res['confidence']})"
        )

except KeyboardInterrupt:
    print("\nExiting...")

finally:
    conn.close()
