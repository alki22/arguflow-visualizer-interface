
import React from 'react';
import { cn } from '@/lib/utils';

interface ArgumentativeStructureData {
  argument1: {
    originalText: string;
    premise: string;
    premiseTopic: string;
    claim: string;
    claimTopic: string;
    argumentTopic: string;
    stance: string;
    reasoningType: string;
  };
  argument2: {
    originalText: string;
    premise: string;
    premiseTopic: string;
    claim: string;
    claimTopic: string;
    argumentTopic: string;
    stance: string;
    reasoningType: string;
  };
  textSimilarity?: {
    arguments: number;
    premises: number;
    claims: number;
  };
}

interface ArgumentativeStructureResultProps {
  data: ArgumentativeStructureData;
  isLoading: boolean;
  className?: string;
}

const ArgumentativeStructureResult = ({ data, isLoading, className }: ArgumentativeStructureResultProps) => {
  if (isLoading) {
    return (
      <div className={cn("mt-6 space-y-4", className)}>
        <div className="h-2 bg-muted rounded">
          <div className="h-full bg-primary rounded animate-pulse-opacity w-full"></div>
        </div>
        <div className="space-y-6">
          <div className="h-32 bg-secondary rounded animate-pulse-opacity opacity-60"></div>
          <div className="h-32 bg-secondary rounded animate-pulse-opacity opacity-70 delay-150"></div>
        </div>
      </div>
    );
  }

  const renderArgumentRow = (argumentData: ArgumentativeStructureData['argument1'], argumentLabel: string) => (
    <div key={argumentLabel} className="space-y-4">
      <h3 className="text-lg font-medium text-gray-800">{argumentLabel}</h3>
      
      {/* Original Text */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Original Text:</h4>
        <div className="text-sm text-gray-900 italic">{argumentData.originalText}</div>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        {/* Premise Column */}
        <div className="space-y-3">
          <h4 className="text-base font-medium text-gray-700">Premise</h4>
          <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm min-h-[120px]">
            <div className="space-y-2">
              <div className="text-sm text-gray-900">{argumentData.premise}</div>
              {argumentData.premiseTopic && argumentData.premiseTopic !== '-' && (
                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                  <strong>Topic:</strong> {argumentData.premiseTopic}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Claim Column */}
        <div className="space-y-3">
          <h4 className="text-base font-medium text-gray-700">Claim</h4>
          <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm min-h-[120px]">
            <div className="space-y-2">
              <div className="text-sm text-gray-900">{argumentData.claim}</div>
              {argumentData.claimTopic && argumentData.claimTopic !== '-' && (
                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                  <strong>Topic:</strong> {argumentData.claimTopic}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Argument Analysis Column */}
        <div className="space-y-3">
          <h4 className="text-base font-medium text-gray-700">Argument Analysis</h4>
          <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm min-h-[120px]">
            <div className="space-y-2">
              {argumentData.argumentTopic && (
                <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                  <strong>Topic:</strong> {argumentData.argumentTopic}
                </div>
              )}
              {argumentData.stance && (
                <div className="text-xs text-gray-600 bg-green-50 p-2 rounded">
                  <strong>Stance:</strong> {argumentData.stance}
                </div>
              )}
              {argumentData.reasoningType && (
                <div className="text-xs text-gray-600 bg-purple-50 p-2 rounded">
                  <strong>Reasoning Type:</strong> {argumentData.reasoningType}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn("mt-6 animate-fade-in", className)}>
      <h3 className="text-lg font-medium mb-6">Argumentative Structure Analysis</h3>
      <div className="space-y-8">
        {renderArgumentRow(data.argument1, 'Argument 1')}
        {renderArgumentRow(data.argument2, 'Argument 2')}
        
        {/* Text Similarity Section */}
        {data.textSimilarity && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Text Similarity</h3>
            <div className="grid grid-cols-3 gap-6">
              {/* Premises Similarity */}
              <div className="space-y-3">
                <h4 className="text-base font-medium text-gray-700">Premises</h4>
                <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm min-h-[80px] flex items-center justify-center">
                  <span className="font-mono text-lg font-medium">
                    {data.textSimilarity.premises !== null ? data.textSimilarity.premises.toFixed(4) : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Claims Similarity */}
              <div className="space-y-3">
                <h4 className="text-base font-medium text-gray-700">Claims</h4>
                <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm min-h-[80px] flex items-center justify-center">
                  <span className="font-mono text-lg font-medium">
                    {data.textSimilarity.claims !== null ? data.textSimilarity.claims.toFixed(4) : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Arguments Similarity */}
              <div className="space-y-3">
                <h4 className="text-base font-medium text-gray-700">Arguments</h4>
                <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm min-h-[80px] flex items-center justify-center">
                  <span className="font-mono text-lg font-medium">
                    {data.textSimilarity.arguments !== null ? data.textSimilarity.arguments.toFixed(4) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArgumentativeStructureResult;
