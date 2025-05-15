
import React from 'react';
import { cn } from '@/lib/utils';

interface AnalysisResultProps {
  result: string | null;
  isLoading: boolean;
  className?: string;
}

const AnalysisResult = ({ result, isLoading, className }: AnalysisResultProps) => {
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

  return (
    <div className={cn("mt-6 animate-fade-in", className)}>
      <h3 className="text-lg font-medium mb-4">Analysis Result</h3>
      <pre className="code-block whitespace-pre-wrap">
        {result}
      </pre>
    </div>
  );
};

export default AnalysisResult;
