import numpy as np
from transformers import AutoTokenizer
import onnxruntime as ort

# Point directly to the unzipped local folder
MODEL_DIR = "./model"

# 1. Load local tokenizer and ONNX session
tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
ort_session = ort.InferenceSession(f"{MODEL_DIR}/model.onnx")

ACTION_MAPPING = {
    0: "SAFE: Allow request normally.",
    1: "MILD: Log search query.",
    2: "MODERATE: Display self-care resources.",
    3: "HIGH: Alert admin dashboard.",
    4: "EMERGENCY: Intercept DNS & show crisis helpline."
}

def analyze_query(query_text):
    # Tokenize input text (this automatically generates token_type_ids)
    inputs = tokenizer(
        query_text, 
        return_tensors="np", 
        max_length=128, 
        padding="max_length", 
        truncation=True
    )
    
    # Format ALL inputs required by the ONNX execution graph
    onnx_inputs = {
        'input_ids': inputs['input_ids'].astype(np.int64),
        'attention_mask': inputs['attention_mask'].astype(np.int64),
        'token_type_ids': inputs['token_type_ids'].astype(np.int64)  # <-- Added this line
    }
    
    # Run ONNX forward pass
    logits = ort_session.run(None, onnx_inputs)[0]
    
    # Compute Softmax probabilities
    probabilities = np.exp(logits) / np.sum(np.exp(logits), axis=-1, keepdims=True)
    predicted_class = int(np.argmax(probabilities))
    confidence = float(probabilities[0][predicted_class])
    
    return {
        "query": query_text,
        "risk_level": predicted_class,
        "confidence": round(confidence, 4),
        "action": ACTION_MAPPING[predicted_class]
    }

# 2. Test execution
if __name__ == "__main__":
    
    while(1):
        query = input(">> ")

        res = analyze_query(query)
        print(f"[{res['risk_level']}] {res['query']} -> {res['action']} (Conf: {res['confidence']})")