import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import TextForm from '@/components/TextForm';
import AnalysisResult from '@/components/AnalysisResult';

function formatSimilarityOutput(result: {
  sentence1: string;
  sentence2: string;
  overall_similarity: number;
  feature_similarities: Record<string, number>;
}): string {
  let output = "";
  
  output += `Overall Similarity: ${result.overall_similarity.toFixed(4)}`;
  
  output += "\n\nSemantic Feature Similarities:";
  
  // Get all feature similarities excluding global and residual
  const features = Object.fromEntries(
    Object.entries(result.feature_similarities)
      .filter(([k, _]) => k !== 'global' && k !== 'residual')
  );
  
  // Sort features by similarity score
  const sortedFeatures = Object.entries(features)
    .sort(([_, a], [__, b]) => b - a);
  
  // Add each feature line
  for (const [feature, score] of sortedFeatures) {
    output += `\n  - ${feature.trim()}: ${score.toFixed(4)}`;
  }
  
  return output;
}

// API endpoints for Flask backend
const API_ENDPOINTS = {
  'text-similarity': 'http://localhost:5000/compare',
  'topic-similarity': 'http://localhost:5000/compare', // Using same endpoint for now
  'stance-classification': 'http://localhost:5000/compare' // Using same endpoint for now
};

const Index = () => {
  const [activeTab, setActiveTab] = useState('text-similarity');
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTabChange = (value) => {
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
      const endpoint = API_ENDPOINTS[activeTab];
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sentence1: text1,
          sentence2: text2
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'success' && data.result) {
        // Format the result based on the active tab
        let formattedResult;
        const similarityScore = data.result.overall_similarity;
        const scorePercent = Math.round(similarityScore * 100);
        
        switch(activeTab) {
          case 'text-similarity':
            formattedResult = formatSimilarityOutput(data.result);
            break;
          case 'topic-similarity':
            formattedResult = `The texts share ${scorePercent}% topic similarity.`;
            break;
          case 'stance-classification':
            if (scorePercent >= 75) {
              formattedResult = `The analysis indicates strong agreement (${scorePercent}%).`;
            } else if (scorePercent >= 40) {
              formattedResult = `The analysis indicates a neutral stance (${scorePercent}%).`;
            } else {
              formattedResult = `The analysis indicates disagreement (${scorePercent}%).`;
            }
            break;
          default:
            formattedResult = `Similarity score: ${scorePercent}%`;
        }
        
        // Store the formatted result
        setResult(formattedResult);
      } else {
        throw new Error("Invalid API response format");
      }
      
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error(`An error occurred during analysis: ${error}. Please try again.`);
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