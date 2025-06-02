import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import AnalysisTabs from '@/components/AnalysisTabs';
import { analyzeTexts, type AnalysisType } from '@/services/analysisService';
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

export function formatTopicSimilarityOutput(response: any): string {
  if (!response || typeof response !== 'object') {
    return 'Invalid response format';
  }

  const {
    interpretation,
    topic_info,
    distributions,
    similarities
  } = response;

  let output = '';

  // 1. Interpretation
  if (interpretation) {
    output += `Interpretation: ${interpretation}\n\n`;
  }

  // 2. List of topics with key words in 'representation'
  if (topic_info?.topics && Array.isArray(topic_info.topics)) {
    output += `Identified Topics:\n\n`;
    
    topic_info.topics.forEach((topic: any, index: number) => {
      const topicName = topic.Name || `Topic ${topic.Topic || index}`;
      const keywords = topic.Representation || [];
      
      output += `Topic ${topic.Topic || index}: ${topicName}\n`;
      output += `Key words: ${keywords.join(', ')}\n`;
      if (topic.Representative_Docs && topic.Representative_Docs.length > 0) {
        output += `Representative sentences:\n`;
        topic.Representative_Docs.forEach((doc: string) => {
          output += `  • "${doc.trim()}"\n`;
        });
      }
      output += '\n';
    });
  }

  // 3. List of topics for each argument
  if (distributions) {
    output += `Topic Distribution by Argument:\n\n`;
    
    if (distributions.argument1_topics) {
      output += `Argument 1 Topics: ${distributions.argument1_topics.join(', ')}\n`;
    }
    
    if (distributions.argument2_topics) {
      output += `Argument 2 Topics: ${distributions.argument2_topics.join(', ')}\n`;
    }
    
    output += '\n';
  }

  // 4. Calculated metrics
  if (similarities) {
    output += `Similarity Metrics:\n\n`;
    
    if (typeof similarities.cosine_similarity === 'number') {
      output += `• Cosine Similarity: ${similarities.cosine_similarity.toFixed(3)}\n`;
    }
    
    if (typeof similarities.jaccard_similarity === 'number') {
      output += `• Jaccard Similarity: ${similarities.jaccard_similarity.toFixed(3)}\n`;
    }
    
    if (typeof similarities.js_distance === 'number') {
      output += `• Jensen-Shannon Distance: ${similarities.js_distance.toFixed(3)}\n`;
    }
    
    output += '\n';
  }

  // Additional statistics if available
  if (topic_info?.total_sentences || topic_info?.total_topics) {
    output += `Analysis Statistics:\n\n`;
    
    if (topic_info.total_sentences) {
      output += `• Total Sentences Analyzed: ${topic_info.total_sentences}\n`;
    }
    
    if (topic_info.total_topics) {
      output += `• Total Topics Discovered: ${topic_info.total_topics}\n`;
    }
  }

  return output.trim();
}

// API endpoints for Flask backend
const API_ENDPOINTS = {
  'text-similarity': 'http://127.0.0.1:5000/compare',
  'topic-similarity': 'http://127.0.0.1:5000/topic-similarity',
  'stance-classification': 'http://localhost:5000/stance-classification' // Using same endpoint for now
};

const Index = () => {
  const [activeTab, setActiveTab] = useState<AnalysisType>('text-similarity');
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
      
      const analysisResult = await analyzeTexts(activeTab, text1, text2);
      setResult(analysisResult);
      // Call the appropriate API endpoint based on the active tab
      const endpoint = API_ENDPOINTS[activeTab];
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          argument1: text1,
          argument2: text2
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
            formattedResult = formatTopicSimilarityOutput(data.result);
            break;
          case 'stance-classification':
            formattedResult = `${data.result.stance} \n${data.result.justification}`;
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
          <AnalysisTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            text1={text1}
            setText1={setText1}
            text2={text2}
            setText2={setText2}
            result={result}
            isLoading={isLoading}
            handleAnalyze={handleAnalyze}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;