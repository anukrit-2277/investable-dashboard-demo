
import React from 'react';
import { Company, CATEGORY_NAMES, CategoryKey } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  Radar, 
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

interface ScoreRadarChartProps {
  company: Company;
  className?: string;
}

const ScoreRadarChart: React.FC<ScoreRadarChartProps> = ({ company, className = '' }) => {
  // Prepare data for the radar chart
  const categories = Object.keys(CATEGORY_NAMES) as CategoryKey[];
  
  const data = categories.map(category => {
    return {
      category: CATEGORY_NAMES[category],
      people: company.people[category].score,
      process: company.process[category].score,
      technology: company.technology[category].score
    };
  });

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Pillar Comparison</CardTitle>
        <CardDescription>People, Process, and Technology by category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius={90} data={data}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="category" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Radar
                name="People"
                dataKey="people"
                stroke="#0369a1"
                fill="#0369a1"
                fillOpacity={0.2}
                dot
              />
              <Radar
                name="Process"
                dataKey="process"
                stroke="#4338ca"
                fill="#4338ca"
                fillOpacity={0.2}
                dot
              />
              <Radar
                name="Technology"
                dataKey="technology"
                stroke="#9333ea"
                fill="#9333ea"
                fillOpacity={0.2}
                dot
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreRadarChart;
