import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import ArgumentativeStructureResult from './ArgumentativeStructureResult';

interface AnalysisResultProps {
  result: string | { basic: string; details: string } | any | null;
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

  // Handle Argumentative Structure Analysis
  if (activeTab === 'argumentative-structure-analysis' && typeof result === 'object' && result.argument1) {
    return (
      <ArgumentativeStructureResult 
        data={result} 
        isLoading={isLoading} 
        className={className}
      />
    );
  }

  // Handle Global Similarity Analysis with separate fields
  if (activeTab === 'global-similarity-analysis' && typeof result === 'string') {
    const sections = result.split('\n\n').filter(section => section.trim());
    
    // Create a fixed structure for the four components we expect
    const components = [
      { title: 'Text similarity', value: '' },
      { title: 'Topic Similarity', value: '' },
      { title: 'Stance', value: '' },
      { title: 'Reasoning type', value: '' }
    ];
    
    // Parse the sections to extract values (skip the title lines, take the value lines)
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i].trim();
      const lines = section.split('\n');
      
      if (lines.length >= 2) {
        const title = lines[0].trim();
        const value = lines[1].trim();
        
        if (title.includes('Text Similarity')) {
          components[0].value = value;
        } else if (title.includes('Topic Similarity')) {
          components[1].value = value;
        } else if (title.includes('Stance')) {
          components[2].value = value;
        } else if (title.includes('Reasoning Type')) {
          components[3].value = value;
        }
      }
    }

    return (
      <div className={cn("mt-6 animate-fade-in", className)}>
        <div className="grid grid-cols-2 gap-6">
          {components.map((item, index) => (
            <div key={index} className="space-y-2">
              <h3 className="text-base font-medium text-gray-700">{item.title}</h3>
              <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm min-h-[60px] flex items-center justify-center">
                <span className="font-mono text-lg font-medium">{item.value || 'N/A'}</span>
              </div>
            </div>
          ))}
        </div>
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
