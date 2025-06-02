
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TabDescription from './TabDescription';
import AnalysisResult from './AnalysisResult';
import AnalysisControls from './AnalysisControls';

interface AnalysisTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  text1: string;
  setText1: (value: string) => void;
  text2: string;
  setText2: (value: string) => void;
  result: string | { basic: string; details: string } | null;
  isLoading: boolean;
  handleAnalyze: () => void;
}

const tabDescriptions = {
  'text-similarity': 'Compare two texts to analyze their linguistic similarity based on shared vocabulary and structure.',
  'topic-similarity': 'Analyze two texts to determine similarity in topics, themes, and subject matter.',
  'stance-classification': 'Determine if the second text agrees, disagrees, or is neutral with respect to the first text.'
};

const AnalysisTabs = ({
  activeTab,
  setActiveTab,
  text1,
  setText1,
  text2,
  setText2,
  result,
  isLoading,
  handleAnalyze
}: AnalysisTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="text-similarity">Text Similarity</TabsTrigger>
        <TabsTrigger value="topic-similarity">Topic Similarity</TabsTrigger>
        <TabsTrigger value="stance-classification">Stance Classification</TabsTrigger>
      </TabsList>
      
      {Object.entries(tabDescriptions).map(([tabId, description]) => (
        <TabsContent key={tabId} value={tabId} className="mt-0 animate-fade-in">
          <TabDescription description={description} />
        </TabsContent>
      ))}
      
      <div className="space-y-6 mt-2">
        <AnalysisControls
          text1={text1}
          setText1={setText1}
          text2={text2}
          setText2={setText2}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
        />
        
        <AnalysisResult 
          result={result} 
          isLoading={isLoading} 
          activeTab={activeTab}
        />
      </div>
    </Tabs>
  );
};

export default AnalysisTabs;
