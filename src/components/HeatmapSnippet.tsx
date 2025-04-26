
import React from 'react';
import { Company, CategoryKey, CATEGORY_NAMES, getScoreColorClass } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HeatmapSnippetProps {
  company: Company;
  className?: string;
}

const HeatmapSnippet: React.FC<HeatmapSnippetProps> = ({ company, className = '' }) => {
  const categories: CategoryKey[] = ['finance', 'legal', 'tax', 'hr', 'assets', 'it', 'product', 'marketing'];
  const pillars = ['people', 'process', 'technology'] as const;

  return (
    <div className={`grid grid-cols-8 gap-1 ${className}`}>
      <TooltipProvider delayDuration={300}>
        {categories.map((category) => (
          <div key={category} className="space-y-1">
            {pillars.map((pillar) => {
              const score = company[pillar][category].score;
              return (
                <Tooltip key={`${pillar}-${category}`}>
                  <TooltipTrigger asChild>
                    <div 
                      className={`h-2 w-full rounded-sm cursor-default ${getScoreColorClass(score, 'bg')}`}
                      aria-label={`${pillar} ${category} score: ${score}`}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    <p>{`${pillar} ${CATEGORY_NAMES[category]}: ${score}`}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        ))}
      </TooltipProvider>
    </div>
  );
};

export default HeatmapSnippet;
