
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import AnalysisTabs from '@/components/AnalysisTabs';
import { analyzeTexts, type AnalysisType } from '@/services/analysisService';

const Index = () => {
  const [activeTab, setActiveTab] = useState<AnalysisType>('text-similarity');
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
