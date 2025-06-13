
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
}): { basic: string; details: string } {
  const basic = `Overall Similarity: ${result.overall_similarity.toFixed(4)}`;
  
  let details = "Semantic Feature Similarities:";
  
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
    details += `\n  - ${feature.trim()}: ${score.toFixed(4)}`;
  }
  
  return { basic, details };
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

export function formatTopicSimilarityLLMOutput(response: any): string {
  if (!response || typeof response !== 'object') {
    return 'Invalid response format';
  }

  const {
    argument1,
    argument2,
    topics_argument1,
    topics_argument2,
    top_similarity_score,
    interpretation,
    top_similar_pairs,
    total_comparisons
  } = response;

  let output = '';

  // 1. Interpretation
  if (interpretation) {
    output += `Interpretation: ${interpretation}\n\n`;
  }

  // 2. Top similarity score
  if (typeof top_similarity_score === 'number') {
    output += `Top Similarity Score: ${top_similarity_score.toFixed(4)}\n\n`;
  }

  // 3. Topics for each argument
  if (topics_argument1 && Array.isArray(topics_argument1)) {
    output += `Argument 1 Topics:\n`;
    topics_argument1.forEach((topic: string, index: number) => {
      output += `  ${index + 1}. ${topic}\n`;
    });
    output += '\n';
  }

  if (topics_argument2 && Array.isArray(topics_argument2)) {
    output += `Argument 2 Topics:\n`;
    topics_argument2.forEach((topic: string, index: number) => {
      output += `  ${index + 1}. ${topic}\n`;
    });
    output += '\n';
  }

  // 4. Top similar topic pairs
  if (top_similar_pairs && Array.isArray(top_similar_pairs) && top_similar_pairs.length > 0) {
    output += `Top Similar Topic Pairs:\n\n`;
    
    top_similar_pairs.forEach((pair: any, index: number) => {
      output += `${index + 1}. "${pair.topic_from_arg1}" ↔ "${pair.topic_from_arg2}"\n`;
      output += `   Similarity Score: ${pair.similarity_score.toFixed(4)}\n\n`;
    });
  }

  // 5. Analysis statistics
  if (total_comparisons) {
    output += `Analysis Statistics:\n`;
    output += `• Total Topic Comparisons: ${total_comparisons}\n`;
  }

  return output.trim();
}

// API endpoints for Flask backend
const API_ENDPOINTS = {
  'text-similarity': 'http://127.0.0.1:5000/compare',
  'extract-topics': 'http://127.0.0.1:5000/extract-topics',
  'stance-classification': 'http://localhost:5000/stance-classification',
  'topic-similarity': 'http://127.0.0.1:5000/topic-similarity-llm',
  'reasoning-type-classification': 'http://127.0.0.1:5000/reasoning-type-classification'
};

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>('text-similarity');
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [result, setResult] = useState<string | { basic: string; details: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [useTopic, setUseTopic] = useState(false);
  const [topic, setTopic] = useState('');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setResult(null);
  };

  const handleAnalyze = async () => {
    // Handle reasoning type classification
    if (activeTab === 'reasoning-type-classification') {
      if (!text1.trim()) {
        toast.error("Please provide text for analysis");
        return;
      }
      
      try {
        setIsLoading(true);
        setResult(null);
        
        const response = await fetch(API_ENDPOINTS['reasoning-type-classification'], {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            argument: text1
          }),
        });
        
        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'success' && data.result) {
          const formattedResult = `Reasoning Type: ${data.result.reasoning_type}\n\nJustification: ${data.result.justification}`;
          setResult(formattedResult);
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (error) {
        console.error("Reasoning type analysis error:", error);
        toast.error(`An error occurred during analysis: ${error}. Please try again.`);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Handle global similarity analysis
    if (activeTab === 'global-similarity-analysis') {
      if (!text1.trim() || !text2.trim()) {
        toast.error("Please provide both texts for analysis");
        return;
      }
      
      try {
        setIsLoading(true);
        setResult(null);
        
        // 1. Get overall similarity from /compare
        const compareResponse = await fetch(API_ENDPOINTS['text-similarity'], {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            argument1: text1,
            argument2: text2
          }),
        });
        
        if (!compareResponse.ok) {
          throw new Error(`Text similarity API failed with status: ${compareResponse.status}`);
        }
        
        const compareData = await compareResponse.json();
        const overallSimilarity = compareData.status === 'success' ? compareData.result.overall_similarity : null;
        
        // 2. Get topic similarity from /topic-similarity-llm
        const topicSimilarityResponse = await fetch(API_ENDPOINTS['topic-similarity'], {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            argument1: text1,
            argument2: text2
          }),
        });
        
        if (!topicSimilarityResponse.ok) {
          throw new Error(`Topic similarity API failed with status: ${topicSimilarityResponse.status}`);
        }
        
        const topicSimilarityData = await topicSimilarityResponse.json();
        const topSimilarityScore = topicSimilarityData.status === 'success' ? topicSimilarityData.result.top_similarity_score : null;
        
        // 3. Get stance classification (extract topic first)
        let stanceResult = null;
        try {
          const topicExtractionResponse = await fetch(API_ENDPOINTS['extract-topics'], {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              argument: text1
            }),
          });
          
          if (topicExtractionResponse.ok) {
            const topicData = await topicExtractionResponse.json();
            
            if (topicData.status === 'success' && topicData.result && topicData.result.topics && topicData.result.topics.length > 0) {
              const extractedTopic = topicData.result.topics[0]; // Use first extracted topic
              
              const stanceResponse = await fetch(API_ENDPOINTS['stance-classification'], {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  argument1: text1,
                  argument2: extractedTopic
                }),
              });
              
              if (stanceResponse.ok) {
                const stanceData = await stanceResponse.json();
                if (stanceData.status === 'success' && stanceData.result) {
                  stanceResult = stanceData.result.stance;
                }
              }
            }
          }
        } catch (error) {
          console.warn("Stance classification failed:", error);
        }
        
        // 4. Get reasoning type classification
        let reasoningType = null;
        try {
          const reasoningResponse = await fetch(API_ENDPOINTS['reasoning-type-classification'], {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              argument: text1
            }),
          });
          
          if (reasoningResponse.ok) {
            const reasoningData = await reasoningResponse.json();
            if (reasoningData.status === 'success' && reasoningData.result) {
              reasoningType = reasoningData.result.reasoning_type;
            }
          }
        } catch (error) {
          console.warn("Reasoning type classification failed:", error);
        }
        
        // Format the global similarity results
        let formattedResult = "Global Similarity Analysis Results:\n\n";
        
        if (overallSimilarity !== null) {
          formattedResult += `• Text Similarity (Overall): ${overallSimilarity.toFixed(4)}\n`;
        } else {
          formattedResult += `• Text Similarity (Overall): Failed to retrieve\n`;
        }
        
        if (topSimilarityScore !== null) {
          formattedResult += `• Topic Similarity (Top Score): ${topSimilarityScore.toFixed(4)}\n`;
        } else {
          formattedResult += `• Topic Similarity (Top Score): Failed to retrieve\n`;
        }
        
        if (stanceResult) {
          formattedResult += `• Stance Classification: ${stanceResult}\n`;
        } else {
          formattedResult += `• Stance Classification: Failed to retrieve\n`;
        }
        
        if (reasoningType) {
          formattedResult += `• Reasoning Type: ${reasoningType}\n`;
        } else {
          formattedResult += `• Reasoning Type: Failed to retrieve\n`;
        }
        
        formattedResult += `\nInterpretation: Global analysis combining multiple similarity dimensions and argument characteristics.`;
        
        setResult(formattedResult);
        
      } catch (error) {
        console.error("Global similarity analysis error:", error);
        toast.error(`An error occurred during analysis: ${error}. Please try again.`);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    try {
      setIsLoading(true);
      setResult(null);
      
      // Special handling for stance classification
      if (activeTab === 'stance-classification') {
        if (!useTopic || !topic.trim()) {
          // No topic provided, extract topics first
          const topicExtractionResponse = await fetch(API_ENDPOINTS['extract-topics'], {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              argument: text1
            }),
          });
          
          if (!topicExtractionResponse.ok) {
            throw new Error(`Topic extraction failed with status: ${topicExtractionResponse.status}`);
          }
          
          const topicData = await topicExtractionResponse.json();
          
          if (topicData.status === 'success' && topicData.result && topicData.result.topics) {
            const extractedTopics = topicData.result.topics;
            
            // Run stance classification for each extracted topic
            const stanceResults = [];
            
            for (const extractedTopic of extractedTopics) {
              const stanceResponse = await fetch(API_ENDPOINTS['stance-classification'], {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  argument1: text1,
                  argument2: extractedTopic
                }),
              });
              
              if (stanceResponse.ok) {
                const stanceData = await stanceResponse.json();
                if (stanceData.status === 'success' && stanceData.result) {
                  stanceResults.push({
                    topic: extractedTopic,
                    stance: stanceData.result.stance,
                    justification: stanceData.result.justification
                  });
                }
              }
            }
            
            // Format the results
            let formattedResult = `Extracted Topics and Stance Analysis:\n\n`;
            stanceResults.forEach((result, index) => {
              formattedResult += `${index + 1}. Topic: "${result.topic}"\n`;
              formattedResult += `   Stance: ${result.stance}\n`;
              formattedResult += `   Justification: ${result.justification}\n\n`;
            });
            
            setResult(formattedResult.trim());
          } else {
            throw new Error("Failed to extract topics from the text");
          }
        } else {
          // Topic provided, run stance classification directly
          const response = await fetch(API_ENDPOINTS['stance-classification'], {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              argument1: text1,
              argument2: topic
            }),
          });
          
          if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
          }
          
          const data = await response.json();
          
          if (data.status === 'success' && data.result) {
            const formattedResult = `${data.result.stance} \n${data.result.justification}`;
            setResult(formattedResult);
          } else {
            throw new Error("Invalid API response format");
          }
        }
      } else {
        // Call the appropriate API endpoint based on the active tab
        const endpoint = API_ENDPOINTS[activeTab];
        
        // Prepare request body based on active tab
        const requestBody = {
          argument1: text1,
          argument2: text2
        };
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
        
        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'success' && data.result) {
          // Format the result based on the active tab
          let formattedResult;
          
          switch(activeTab) {
            case 'text-similarity':
              formattedResult = formatSimilarityOutput(data.result);
              break;
            case 'topic-similarity':
              formattedResult = formatTopicSimilarityLLMOutput(data.result);
              break;
            default:
              const similarityScore = data.result.overall_similarity;
              const scorePercent = Math.round(similarityScore * 100);
              formattedResult = `Similarity score: ${scorePercent}%`;
          }
          
          // Store the formatted result
          setResult(formattedResult);
        } else {
          throw new Error("Invalid API response format");
        }
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
            setActiveTab={handleTabChange}
            text1={text1}
            setText1={setText1}
            text2={text2}
            setText2={setText2}
            result={result}
            isLoading={isLoading}
            handleAnalyze={handleAnalyze}
            useTopic={useTopic}
            setUseTopic={setUseTopic}
            topic={topic}
            setTopic={setTopic}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
