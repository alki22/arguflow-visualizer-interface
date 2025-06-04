
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TextForm from '@/components/TextForm';

interface AnalysisControlsProps {
  text1: string;
  text2: string;
  setText1: (value: string) => void;
  setText2: (value: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  activeTab: string;
  useTopic: boolean;
  setUseTopic: (value: boolean) => void;
  topic: string;
  setTopic: (value: string) => void;
}

const AnalysisControls = ({
  text1,
  text2,
  setText1,
  setText2,
  onAnalyze,
  isLoading,
  activeTab,
  useTopic,
  setUseTopic,
  topic,
  setTopic
}: AnalysisControlsProps) => {
  const isStanceClassification = activeTab === 'stance-classification';

  return (
    <div className="space-y-6">
      {isStanceClassification ? (
        // Stance classification layout
        <div className="space-y-4">
          <TextForm
            id="text1"
            label="Text to Analyze"
            placeholder="Enter the text for stance classification..."
            value={text1}
            onChange={setText1}
          />
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="use-topic"
              checked={useTopic}
              onCheckedChange={setUseTopic}
            />
            <Label htmlFor="use-topic" className="text-sm font-medium">
              Topic
            </Label>
          </div>
          
          {useTopic && (
            <div className="space-y-2">
              <Label htmlFor="topic" className="text-sm font-medium">
                Topic
              </Label>
              <Input
                id="topic"
                placeholder="Enter the topic..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
          )}
        </div>
      ) : (
        // Default two-text layout for other tabs
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
      )}
      
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
