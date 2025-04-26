
import React from 'react';
import { ScoreHistoryEntry, getScoreColorClass } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, TooltipProps } from 'recharts';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ScoreTimelineProps {
  history: ScoreHistoryEntry[];
  className?: string;
}

const ScoreTimeline: React.FC<ScoreTimelineProps> = ({ history, className = '' }) => {
  // Prepare data for the chart
  const data = history.map(entry => ({
    ...entry,
    date: format(parseISO(entry.date), 'MMM d'),
    formattedDate: format(parseISO(entry.date), 'MMM d, yyyy')
  }));

  // Custom tooltip content
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const entry = payload[0].payload as (ScoreHistoryEntry & { formattedDate: string });
      return (
        <div className="bg-white p-3 shadow-md rounded-md border">
          <p className="font-medium">{entry.formattedDate}</p>
          <p className="text-sm">Score: <span className={getScoreColorClass(entry.score)}>{entry.score}</span></p>
          {entry.changes && (
            <p className="text-sm mt-1 max-w-xs">Note: {entry.changes}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Score Timeline</CardTitle>
        <CardDescription>6-month history of investment readiness scores</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={[Math.floor(Math.min(...data.map(d => d.score)) - 5), 100]} 
                tick={{ fontSize: 12 }}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={60} stroke="#f59e0b" strokeDasharray="3 3" />
              <ReferenceLine y={80} stroke="#16a34a" strokeDasharray="3 3" />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#0369a1" 
                strokeWidth={2}
                dot={{ 
                  stroke: '#0369a1',
                  strokeWidth: 2,
                  r: 4,
                  fill: 'white'
                }}
                activeDot={{ 
                  stroke: '#0369a1',
                  strokeWidth: 2, 
                  r: 6,
                  fill: 'white'
                }}
              />
              {/* Special dots for entries with change notes */}
              {data.map((entry, index) => (
                entry.changes ? (
                  <Line 
                    key={`annotation-${index}`}
                    data={[entry]} 
                    dataKey="score"
                    stroke="none"
                    dot={{ 
                      stroke: '#0369a1',
                      strokeWidth: 2,
                      r: 6,
                      fill: '#0369a1'
                    }}
                  />
                ) : null
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-score-low"></span>
            <span>Below 60</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-score-medium"></span>
            <span>60-80</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-score-high"></span>
            <span>Above 80</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreTimeline;
