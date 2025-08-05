
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { sampleCompanies } from '@/data/companyData';
import { Company, Pillar, PILLAR_NAMES } from '@/types';
import DashboardHeader from '@/components/layout/DashboardHeader';
import ScoreTimeline from '@/components/ScoreTimeline';
import ScoreRadarChart from '@/components/ScoreRadarChart';
import PillarBreakdown from '@/components/PillarBreakdown';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { exportCompanyReportSimple } from '@/utils/pdfExportSimple';
import { useToast } from '@/hooks/use-toast';

const CompanyDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedPillar, setSelectedPillar] = useState<Pillar>('people');
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  
  // Find the company by ID
  const company = sampleCompanies.find(c => c.id === id);
  
  // If company not found, show error message
  if (!company) {
    return (
      <div className="container max-w-7xl py-6">
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <h1 className="text-2xl font-bold mb-2">Company Not Found</h1>
          <p className="text-muted-foreground mb-4">The company you're looking for doesn't exist.</p>
          <a href="/" className="text-primary hover:underline">
            Return to Homepage
          </a>
        </div>
      </div>
    );
  }

  const handleExportReport = async () => {
    setIsExporting(true);
    try {
      await exportCompanyReportSimple(company);
      toast({
        title: "Company report exported!",
        description: `Detailed PDF report for ${company.name} has been downloaded.`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "There was an error generating the company report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="container max-w-7xl py-6">
      <DashboardHeader 
        title={company.name} 
        subtitle="Investment Readiness Analysis"
        backLink="/"
        score={company.macroScore}
        onExport={handleExportReport}
        isExporting={isExporting}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <ScoreTimeline history={company.scoreHistory} className="lg:col-span-2" />
        <ScoreRadarChart company={company} />
      </div>
      
      <Tabs defaultValue="people" onValueChange={(value) => setSelectedPillar(value as Pillar)} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
          <TabsTrigger value="people">People</TabsTrigger>
          <TabsTrigger value="process">Process</TabsTrigger>
          <TabsTrigger value="technology">Technology</TabsTrigger>
        </TabsList>
        
        {Object.keys(PILLAR_NAMES).map((pillar) => (
          <TabsContent key={pillar} value={pillar}>
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">{PILLAR_NAMES[pillar as Pillar]} Assessment</h2>
              <PillarBreakdown company={company} pillar={pillar as Pillar} />
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default CompanyDashboard;
