
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Company } from '@/types';
import ScoreRing from './ScoreRing';
import HeatmapSnippet from './HeatmapSnippet';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

interface CompanyCardProps {
  company: Company;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  const navigate = useNavigate();
  const lastUpdatedDate = new Date(company.lastUpdated);
  
  const handleClick = () => {
    navigate(`/company/${company.id}`);
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer animate-fade-in"
      onClick={handleClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">{company.name}</h3>
            <p className="text-xs text-muted-foreground">
              Last updated {formatDistanceToNow(lastUpdatedDate, { addSuffix: true })}
            </p>
          </div>
          <ScoreRing score={company.macroScore} size={60} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Score breakdown</p>
            <HeatmapSnippet company={company} />
          </div>
          <div className="flex justify-end">
            <span className="text-xs text-primary font-medium">View details →</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyCard;
