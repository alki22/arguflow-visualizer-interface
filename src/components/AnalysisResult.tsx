import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AnalysisResultProps {
  result: string | { basic: string; details: string } | null;
  isLoading: boolean;
  activeTab: string;
  className?: string;
}

const AnalysisResult = ({ result, isLoading, activeTab, className }: AnalysisResultProps) => {
  const [showDetails, setShowDetails] = useState(false);

  if (isLoading) {
    return (
      <div className={cn("mt-6 space-y-4", className)}>
        <div className="h-2 bg-muted rounded">
          <div className="h-full bg-primary rounded animate-pulse-opacity w-full"></div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="h-24 bg-secondary rounded animate-pulse-opacity opacity-60"></div>
          <div className="h-24 bg-secondary rounded animate-pulse-opacity opacity-70 delay-150"></div>
          <div className="h-24 bg-secondary rounded animate-pulse-opacity opacity-80 delay-300"></div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  // Handle Global Similarity Analysis with separate fields
  if (activeTab === 'global-similarity-analysis' && typeof result === 'string') {
    const sections = result.split('\n\n').filter(section => section.trim());
    const parsedResults: { title: string; value: string }[] = [];
    
    for (let i = 0; i < sections.length; i += 2) {
      if (i + 1 < sections.length) {
        parsedResults.push({
          title: sections[i],
          value: sections[i + 1]
        });
      }
    }

    return (
      <div className={cn("mt-6 animate-fade-in space-y-6", className)}>
        {parsedResults.map((item, index) => (
          <div key={index} className="space-y-2">
            <h3 className="text-lg font-medium">{item.title}</h3>
            <div className="code-block p-4 text-center font-mono text-lg">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Handle text similarity with detailed results
  if (activeTab === 'text-similarity' && typeof result === 'object' && 'basic' in result) {
    return (
      <div className={cn("mt-6 animate-fade-in", className)}>
        <h3 className="text-lg font-medium mb-4">Analysis Result</h3>
        <pre className="code-block whitespace-pre-wrap mb-4">
          {result.basic}
        </pre>
        <Button 
          variant="outline" 
          onClick={() => setShowDetails(!showDetails)}
          className="mb-4"
        >
          {showDetails ? 'Hide details' : 'More details'}
        </Button>
        {showDetails && (
          <pre className="code-block whitespace-pre-wrap animate-fade-in">
            {result.details}
          </pre>
        )}
      </div>
    );
  }

  // Handle other analysis types with string results
  return (
    <div className={cn("mt-6 animate-fade-in", className)}>
      <h3 className="text-lg font-medium mb-4">Analysis Result</h3>
      <pre className="code-block whitespace-pre-wrap">
        {typeof result === 'string' ? result : result.basic}
      </pre>
    </div>
  );
};

export default AnalysisResult;
