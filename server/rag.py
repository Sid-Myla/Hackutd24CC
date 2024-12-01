import pinecone
from transformers import AutoTokenizer, AutoModel
import torch
import os
from dotenv import load_dotenv

# VECTORIZED DATA HAS ALREADY BEEN UPLOADED TO DATABASE


load_dotenv()
api_key = os.getenv("PINECONE_API_KEY")

pinecone.init(api_key=api_key, environment="us-east-1") 
index_name = "fraud-data" 

# Connect to the Pinecone index
index = pinecone.Index(index_name)

# Load the tokenizer and model
model_name = "huggingface/llama-2-7b" 
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModel.from_pretrained(model_name)

def get_embedding(text):
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True)
    with torch.no_grad():
        outputs = model(**inputs)
    embedding = outputs.last_hidden_state.mean(dim=1).squeeze().numpy()
    return embedding

# Query function to get similar text based on embedding
def fraud_detection(new_text, top_k=3):
    new_embedding = get_embedding(new_text)  # Get embedding for the new text
    results = index.query(queries=[new_embedding], top_k=top_k, include_metadata=True)
    match = results[0]
    return (f"Match ID: {match['id']}, Score: {match['score']}, Fraudulent: {match['metadata']['Fraudulent']}")

# Test the query function
new_text = "Urgent: Your account is at risk."
results = fraud_detection(new_text)
match = results[0]
'''
# Print the results
for match in results['matches']:
    print(f"Match ID: {match['id']}, Score: {match['score']}, Fraudulent: {match['metadata']['Fraudulent']}")
'''