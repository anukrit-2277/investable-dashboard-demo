
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Category, CategoryAttribute, getScoreColorClass } from '@/types';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Cell,
  LabelList
} from 'recharts';

interface CategoryCardProps {
  name: string;
  category: Category;
  industryAverage?: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ 
  name, 
  category, 
  industryAverage = 70 // Default value if not provided
}) => {
  const [expanded, setExpanded] = useState(false);
  const { score, attributes } = category;
  
  // Color based on score
  const scoreColorClass = getScoreColorClass(score);
  
  // Sort attributes by score (descending)
  const sortedAttributes = [...attributes].sort((a, b) => b.score - a.score);
  
  // Prepare data for attribute chart
  const attributeData = sortedAttributes.map(attr => ({
    name: attr.name,
    score: attr.score
  }));

  return (
    <Card className="overflow-hidden transition-all duration-300">
      <CardHeader className="pb-2 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">{name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-lg font-semibold ${scoreColorClass}`}>
                {score.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">
                / Industry avg: {industryAverage.toFixed(1)}
              </span>
            </div>
          </div>
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </CardHeader>
      
      <CardContent className={`pb-3 ${expanded ? '' : 'hidden'}`}>
        <div className="space-y-6">
          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Score</span>
              <span className={scoreColorClass}>{score.toFixed(1)}%</span>
            </div>
            <Progress value={score} className="h-2" />
          </div>
          
          {/* Attributes Breakdown */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Attributes Breakdown</h4>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={attributeData}
                  margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                >
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={60} />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                    {attributeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} className={getScoreColorClass(entry.score, 'fill')} />
                    ))}
                    <LabelList dataKey="score" position="right" formatter={(value: number) => `${value.toFixed(1)}`} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
