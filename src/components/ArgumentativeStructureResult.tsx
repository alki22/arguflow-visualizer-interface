
import React from 'react';
import { cn } from '@/lib/utils';

interface ArgumentComponent {
  premise: string;
  claim: string;
  originalArgument: string;
  premiseTopic?: string;
  claimTopic?: string;
  argumentTopic?: string;
  stance?: string;
  reasoningType?: string;
}

interface ArgumentativeStructureResultProps {
  argument1?: ArgumentComponent;
  argument2?: ArgumentComponent;
  isLoading: boolean;
  className?: string;
}

const ArgumentativeStructureResult = ({ 
  argument1, 
  argument2, 
  isLoading, 
  className 
}: ArgumentativeStructureResultProps) => {
  if (isLoading) {
    return (
      <div className={cn("mt-6 space-y-4", className)}>
        <div className="h-2 bg-muted rounded">
          <div className="h-full bg-primary rounded animate-pulse-opacity w-full"></div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="h-32 bg-secondary rounded animate-pulse-opacity opacity-60"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!argument1 && !argument2) return null;

  const renderArgumentRow = (argument: ArgumentComponent, label: string) => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-700 mb-4">{label}</h3>
      <div className="grid grid-cols-3 gap-6">
        {/* Premise Column */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-600">Premise</h4>
          <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm min-h-[100px]">
            <p className="text-sm mb-2">{argument.premise}</p>
            {argument.premiseTopic && (
              <div className="text-xs text-gray-500 mt-2 pt-2 border-t">
                <strong>Topic:</strong> {argument.premiseTopic}
              </div>
            )}
          </div>
        </div>

        {/* Claim Column */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-600">Claim</h4>
          <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm min-h-[100px]">
            <p className="text-sm mb-2">{argument.claim}</p>
            {argument.claimTopic && (
              <div className="text-xs text-gray-500 mt-2 pt-2 border-t">
                <strong>Topic:</strong> {argument.claimTopic}
              </div>
            )}
          </div>
        </div>

        {/* Argument Column */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-600">Argument</h4>
          <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm min-h-[100px]">
            <p className="text-sm mb-2">{argument.originalArgument}</p>
            <div className="text-xs text-gray-500 mt-2 pt-2 border-t space-y-1">
              {argument.argumentTopic && (
                <div><strong>Topic:</strong> {argument.argumentTopic}</div>
              )}
              {argument.stance && (
                <div><strong>Stance:</strong> {argument.stance}</div>
              )}
              {argument.reasoningType && (
                <div><strong>Reasoning Type:</strong> {argument.reasoningType}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn("mt-6 animate-fade-in space-y-8", className)}>
      {argument1 && renderArgumentRow(argument1, "Argument 1")}
      {argument2 && renderArgumentRow(argument2, "Argument 2")}
    </div>
  );
};

export default ArgumentativeStructureResult;
