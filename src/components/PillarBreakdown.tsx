
import React from 'react';
import { Company, PillarData, CategoryKey, CATEGORY_NAMES } from '@/types';
import CategoryCard from './CategoryCard';

interface PillarBreakdownProps {
  company: Company;
  pillar: "people" | "process" | "technology";
  className?: string;
}

const PillarBreakdown: React.FC<PillarBreakdownProps> = ({ company, pillar, className = '' }) => {
  const pillarData = company[pillar];
  const categories = Object.keys(pillarData) as CategoryKey[];
  
  // Industry average values (in a real app these would come from actual data)
  const industryAverages: Record<CategoryKey, number> = {
    finance: 73.5,
    legal: 68.0,
    tax: 70.2,
    hr: 65.8,
    assets: 71.1,
    it: 72.3,
    product: 74.5,
    marketing: 69.7
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {categories.map((categoryKey) => (
        <CategoryCard 
          key={categoryKey}
          name={CATEGORY_NAMES[categoryKey]}
          category={pillarData[categoryKey]}
          industryAverage={industryAverages[categoryKey]}
        />
      ))}
    </div>
  );
};

export default PillarBreakdown;
