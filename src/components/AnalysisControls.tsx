
import React from 'react';
import { Button } from '@/components/ui/button';
import TextForm from '@/components/TextForm';

interface AnalysisControlsProps {
  text1: string;
  text2: string;
  setText1: (value: string) => void;
  setText2: (value: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

const AnalysisControls = ({
  text1,
  text2,
  setText1,
  setText2,
  onAnalyze,
  isLoading
}: AnalysisControlsProps) => {
  return (
    <div className="space-y-6">
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
      
      <div className="flex justify-center border-t pt-6">
        <Button 
          size="lg" 
          onClick={onAnalyze} 
          disabled={isLoading}
          className="min-w-32 font-medium transition-all hover:scale-105"
        >
          {isLoading ? "Processing..." : "GO"}
        </Button>
      </div>
    </div>
  );
};

export default AnalysisControls;
