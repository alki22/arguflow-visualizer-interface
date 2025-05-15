
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import TextForm from '@/components/TextForm';
import AnalysisResult from '@/components/AnalysisResult';

// Mock analysis functions (in a real app, these would call your backend)
const mockAnalyze = (type: string, text1: string, text2: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Sanitize inputs - in a real application you'd do this on the server
      const sanitizedText1 = text1.replace(/<[^>]*>?/gm, '');
      const sanitizedText2 = text2.replace(/<[^>]*>?/gm, '');
      
      // Generate a placeholder result based on the analysis type
      let result = '';
      
      switch (type) {
        case 'text-similarity':
          result = `
# Text Similarity Analysis

\`\`\`python
def calculate_similarity(text1, text2):
    # Tokenize texts
    tokens1 = text1.lower().split()
    tokens2 = text2.lower().split()
    
    # Calculate Jaccard similarity
    intersection = set(tokens1).intersection(set(tokens2))
    union = set(tokens1).union(set(tokens2))
    similarity = len(intersection) / len(union)
    
    return similarity

similarity_score = calculate_similarity("${sanitizedText1.substring(0, 15)}...", "${sanitizedText2.substring(0, 15)}...")
print(f"Similarity score: {0.42}")  # Placeholder score
\`\`\`

The texts show a 42% similarity coefficient.`;
          break;
        case 'topic-similarity':
          result = `
# Topic Similarity Analysis

\`\`\`python
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np

def analyze_topic_similarity(text1, text2):
    # Create TF-IDF vectors
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([text1, text2])
    
    # Calculate cosine similarity
    similarity = (tfidf_matrix * tfidf_matrix.T).toarray()[0, 1]
    
    # Get top shared terms
    feature_names = vectorizer.get_feature_names_out()
    dense = tfidf_matrix.todense()
    
    return similarity, feature_names

similarity, terms = analyze_topic_similarity("${sanitizedText1.substring(0, 15)}...", "${sanitizedText2.substring(0, 15)}...")
print(f"Topic similarity: {0.65}")  # Placeholder score
\`\`\`

The texts share 65% topic similarity, with key shared terms including 'argumentation' and 'analysis'.`;
          break;
        case 'stance-classification':
          result = `
# Stance Classification Analysis

\`\`\`python
def classify_stance(text1, text2):
    # In a real application, this would use a trained model
    # to determine if text2 agrees/disagrees/is neutral to text1
    
    # Simplified approach - check for agreement indicators
    agreement_words = ['agree', 'concur', 'correct', 'right', 'exactly']
    disagreement_words = ['disagree', 'incorrect', 'wrong', 'false', 'mistaken']
    
    text_lower = text2.lower()
    
    # Count indicators
    agreement_count = sum(word in text_lower for word in agreement_words)
    disagreement_count = sum(word in text_lower for word in disagreement_words)
    
    if agreement_count > disagreement_count:
        return "Agreement"
    elif disagreement_count > agreement_count:
        return "Disagreement"
    else:
        return "Neutral"

stance = classify_stance("${sanitizedText1.substring(0, 15)}...", "${sanitizedText2.substring(0, 15)}...")
print(f"Classified stance: {stance}")
\`\`\`

The analysis indicates a 'Neutral' stance between the texts, with no strong indicators of agreement or disagreement.`;
          break;
      }
      
      resolve(result);
    }, 2000); // Simulate network delay
  });
};

const Index = () => {
  const [activeTab, setActiveTab] = useState('text-similarity');
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setResult(null);
  };

  const handleAnalyze = async () => {
    // Input validation
    if (!text1.trim() || !text2.trim()) {
      toast.error("Please provide text in both input fields");
      return;
    }

    try {
      setIsLoading(true);
      setResult(null);
      
      const analysisResult = await mockAnalyze(activeTab, text1, text2);
      
      setResult(analysisResult);
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("An error occurred during analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-10 max-w-4xl">
      <Card className="shadow-sm">
        <CardHeader className="pb-4 border-b">
          <CardTitle className="text-2xl font-medium text-center">Argumentation Analysis Tool</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="text-similarity">Text Similarity</TabsTrigger>
              <TabsTrigger value="topic-similarity">Topic Similarity</TabsTrigger>
              <TabsTrigger value="stance-classification">Stance Classification</TabsTrigger>
            </TabsList>
            
            <TabsContent value="text-similarity" className="mt-0 animate-fade-in">
              <p className="text-muted-foreground mb-6">
                Compare two texts to analyze their linguistic similarity based on shared vocabulary and structure.
              </p>
            </TabsContent>
            
            <TabsContent value="topic-similarity" className="mt-0 animate-fade-in">
              <p className="text-muted-foreground mb-6">
                Analyze two texts to determine similarity in topics, themes, and subject matter.
              </p>
            </TabsContent>
            
            <TabsContent value="stance-classification" className="mt-0 animate-fade-in">
              <p className="text-muted-foreground mb-6">
                Determine if the second text agrees, disagrees, or is neutral with respect to the first text.
              </p>
            </TabsContent>
            
            <div className="space-y-6 mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextForm
                  id="text1"
                  label="First Text"
                  placeholder="Enter the first text for analysis..."
                  value={text1}
                  onChange={setText1}
                />
                
                <TextForm
                  id="text2"
                  label="Second Text"
                  placeholder="Enter the second text for analysis..."
                  value={text2}
                  onChange={setText2}
                />
              </div>
              
              <AnalysisResult 
                result={result} 
                isLoading={isLoading} 
              />
            </div>
          </Tabs>
        </CardContent>
        <CardFooter className="justify-center border-t pt-6">
          <Button 
            size="lg" 
            onClick={handleAnalyze} 
            disabled={isLoading}
            className="min-w-32 font-medium transition-all hover:scale-105"
          >
            {isLoading ? "Processing..." : "GO"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Index;
