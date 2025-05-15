
# Supabase Edge Functions Setup Guide for Argumentation Analysis Tool

This guide explains how to set up Supabase Edge Functions to run Python code for the text analysis functionality in your application.

## Prerequisites
1. Connect your Lovable project to Supabase (click the green Supabase button).
2. Install the Supabase CLI on your local machine to develop Edge Functions.

## Creating Edge Functions

You'll need to create three Edge Functions, one for each analysis type:

### 1. Text Similarity Function

```python
# supabase/functions/text-similarity/index.py
import json
from http.server import BaseHTTPRequestHandler
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def calculate_similarity(text1, text2):
    # Implement text similarity calculation
    # Example using TF-IDF and cosine similarity:
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([text1, text2])
    similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
    return similarity

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))
        
        text1 = data.get('text1', '')
        text2 = data.get('text2', '')
        
        similarity = calculate_similarity(text1, text2)
        
        # Format result with code explanation
        result = f"""
# Text Similarity Analysis

```python
def calculate_similarity(text1, text2):
    # TF-IDF vectorization with cosine similarity
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([text1, text2])
    similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
    
    return similarity

similarity_score = calculate_similarity("{text1[:15]}...", "{text2[:15]}...")
print(f"Similarity score: {similarity:.2f}")
```

The texts show a {similarity:.0%} similarity coefficient.
"""
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({"result": result}).encode())
        return
```

### 2. Topic Similarity Function

```python
# supabase/functions/topic-similarity/index.py
import json
from http.server import BaseHTTPRequestHandler
# Import your preferred topic modeling library
# For example: gensim, scikit-learn, etc.

def analyze_topic_similarity(text1, text2):
    # Implement your topic similarity analysis
    # For example, using LDA topic modeling
    
    # Placeholder implementation - replace with actual code
    similarity = 0.65
    shared_terms = ["term1", "term2", "term3"]
    
    return similarity, shared_terms

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))
        
        text1 = data.get('text1', '')
        text2 = data.get('text2', '')
        
        similarity, shared_terms = analyze_topic_similarity(text1, text2)
        
        # Format result with code explanation
        result = f"""
# Topic Similarity Analysis

```python
def analyze_topic_similarity(text1, text2):
    # Topic modeling implementation
    # Example using LDA topic modeling
    
    import gensim
    from gensim.corpora import Dictionary
    from gensim.models import LdaModel
    
    # Implementation details here...
    # This would extract topics and compare distributions
    
    return similarity, shared_terms

similarity, terms = analyze_topic_similarity("{text1[:15]}...", "{text2[:15]}...")
print(f"Topic similarity: {similarity:.2f}")
```

The texts share {similarity:.0%} topic similarity, with key shared terms including '{shared_terms[0]}' and '{shared_terms[1]}'.
"""
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({"result": result}).encode())
        return
```

### 3. Stance Classification Function

```python
# supabase/functions/stance-classification/index.py
import json
from http.server import BaseHTTPRequestHandler
# Import your preferred NLP library for stance detection
# For example: transformers, scikit-learn, etc.

def classify_stance(text1, text2):
    # Implement stance classification
    # For example, using a pre-trained transformer model
    
    # Placeholder implementation - replace with actual code
    # Determine if text2 agrees/disagrees/is neutral to text1
    stance = "Neutral"  # or "Agreement" or "Disagreement"
    
    return stance

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))
        
        text1 = data.get('text1', '')
        text2 = data.get('text2', '')
        
        stance = classify_stance(text1, text2)
        
        # Format result with code explanation
        result = f"""
# Stance Classification Analysis

```python
def classify_stance(text1, text2):
    # Stance classification implementation
    # Example using a transformer-based approach
    
    from transformers import AutoTokenizer, AutoModelForSequenceClassification
    import torch
    
    # Model loading and prediction would happen here
    # This would determine if text2 agrees/disagrees/is neutral to text1
    
    return stance_prediction

stance = classify_stance("{text1[:15]}...", "{text2[:15]}...")
print(f"Classified stance: {stance}")
```

The analysis indicates a '{stance}' stance between the texts.
"""
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({"result": result}).encode())
        return
```

## Deployment Steps

1. After creating these files in your local Supabase project folder, deploy them:
   ```bash
   supabase functions deploy text-similarity
   supabase functions deploy topic-similarity
   supabase functions deploy stance-classification
   ```

2. Update your frontend code to use the correct URLs:
   - Get your Supabase project reference from the Supabase dashboard.
   - Update the `API_ENDPOINTS` object in your React code with the correct URLs.

## Dependencies

Your Supabase Edge Functions will need access to libraries like:
- scikit-learn for vectorization and similarity metrics
- gensim for topic modeling
- transformers for stance detection

You can specify these in a `requirements.txt` file in each function folder.

## Security Considerations

1. Add proper CORS headers to restrict access to your frontend domain.
2. Consider adding rate limiting to prevent abuse.
3. Validate input sizes to prevent resource exhaustion.
