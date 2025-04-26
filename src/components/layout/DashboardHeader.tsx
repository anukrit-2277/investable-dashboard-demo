
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  backLink?: string;
  score?: number;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  title, 
  subtitle,
  backLink,
  score
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backLink) {
      navigate(backLink);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 mb-6 border-b">
      <div className="flex items-center gap-4">
        {backLink !== undefined && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full" 
            onClick={handleBack}
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      
      {score !== undefined && (
        <div className="bg-white shadow-sm rounded-md px-4 py-2 mt-2 md:mt-0">
          <div className="text-sm text-muted-foreground">Overall Score</div>
          <div className="text-2xl font-bold">{score.toFixed(1)}</div>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
