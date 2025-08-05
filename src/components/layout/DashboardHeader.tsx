
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  backLink?: string;
  score?: number;
  onExport?: () => void;
  isExporting?: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  title, 
  subtitle,
  backLink,
  score,
  onExport,
  isExporting
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
      
      <div className="flex items-center gap-3 mt-2 md:mt-0">
        {onExport && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                Exporting...
              </>
            ) : (
              <>
                <Download size={16} />
                Export Report
              </>
            )}
          </Button>
        )}
        {score !== undefined && (
          <div className="bg-card shadow-sm rounded-md px-4 py-2 border border-border">
            <div className="text-sm text-muted-foreground">Overall Score</div>
            <div className="text-2xl font-bold">{score.toFixed(1)}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
