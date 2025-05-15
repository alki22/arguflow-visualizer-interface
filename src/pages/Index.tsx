
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import TextForm from '@/components/TextForm';
import AnalysisResult from '@/components/AnalysisResult';

// API endpoints for Supabase Edge Functions (replace these with your actual endpoints after setting up Supabase)
const API_ENDPOINTS = {
  'text-similarity': 'https://your-project-ref.supabase.co/functions/v1/text-similarity',
  'topic-similarity': 'https://your-project-ref.supabase.co/functions/v1/topic-similarity',
  'stance-classification': 'https://your-project-ref.supabase.co/functions/v1/stance-classification'
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
      
      // Call the appropriate API endpoint based on the active tab
      const endpoint = API_ENDPOINTS[activeTab as keyof typeof API_ENDPOINTS];
      
      // For testing before Supabase is set up, use a timeout to simulate API call
      if (endpoint.includes('your-project-ref')) {
        // This is a placeholder - it will be replaced with the real API call once Supabase is configured
        setTimeout(() => {
          const mockResults = {
            'text-similarity': `
# Text Similarity Analysis

\`\`\`python
def calculate_similarity(text1, text2):
    # PLACEHOLDER: Replace with your actual text similarity implementation
    # Example: TF-IDF vectorization with cosine similarity
    
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([text1, text2])
    similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
    
    return similarity

similarity_score = calculate_similarity("${text1.substring(0, 15)}...", "${text2.substring(0, 15)}...")
print(f"Similarity score: {0.42}")  # This will be replaced with actual calculation
\`\`\`

The texts show a 42% similarity coefficient.`,
            'topic-similarity': `
# Topic Similarity Analysis

\`\`\`python
def analyze_topic_similarity(text1, text2):
    # PLACEHOLDER: Replace with your actual topic similarity implementation
    # Example: LDA topic modeling
    
    import gensim
    from gensim.corpora import Dictionary
    
    # Tokenize and prepare texts
    # Extract topics from both texts
    # Compare topic distributions
    
    # This is just a placeholder implementation
    return 0.65, ["term1", "term2", "term3"]

similarity, terms = analyze_topic_similarity("${text1.substring(0, 15)}...", "${text2.substring(0, 15)}...")
print(f"Topic similarity: {similarity}")
\`\`\`

The texts share 65% topic similarity, with key shared terms including 'argumentation' and 'analysis'.`,
            'stance-classification': `
# Stance Classification Analysis

\`\`\`python
def classify_stance(text1, text2):
    # PLACEHOLDER: Replace with your actual stance classification model
    # Example: Fine-tuned transformer model for stance detection
    
    from transformers import AutoTokenizer, AutoModelForSequenceClassification
    import torch
    
    # This would be replaced with actual model loading and prediction code
    # model = AutoModelForSequenceClassification.from_pretrained("stance-detection-model")
    # tokenizer = AutoTokenizer.from_pretrained("stance-detection-model")
    
    # Actual prediction would happen here
    stance = "Neutral"  # Placeholder result
    
    return stance

stance = classify_stance("${text1.substring(0, 15)}...", "${text2.substring(0, 15)}...")
print(f"Classified stance: {stance}")
\`\`\`

The analysis indicates a 'Neutral' stance between the texts, with no strong indicators of agreement or disagreement.`
          };
          
          setResult(mockResults[activeTab as keyof typeof mockResults]);
          setIsLoading(false);
        }, 2000);
        return;
      }
      
      // Real API call (will be used when Supabase is configured)
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text1,
          text2
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      setResult(data.result);
      
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
