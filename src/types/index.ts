
// Core data types for the application

export type CategoryAttribute = {
  id: string;
  name: string;
  score: number;
  description?: string;
};

export type Category = {
  score: number;
  attributes: CategoryAttribute[];
};

export type PillarData = {
  finance: Category;
  legal: Category;
  tax: Category;
  hr: Category;
  assets: Category;
  it: Category;
  product: Category;
  marketing: Category;
};

export type ScoreHistoryEntry = {
  date: string;
  score: number;
  changes?: string;
};

export type Company = {
  id: string;
  name: string;
  logo?: string;
  macroScore: number;
  lastUpdated: string;
  people: PillarData;
  process: PillarData;
  technology: PillarData;
  scoreHistory: ScoreHistoryEntry[];
};

export type Pillar = "people" | "process" | "technology";
export type CategoryKey = keyof PillarData;

export const CATEGORY_NAMES: Record<CategoryKey, string> = {
  finance: "Finance",
  legal: "Legal",
  tax: "Tax",
  hr: "HR",
  assets: "Assets",
  it: "IT",
  product: "Product",
  marketing: "Marketing"
};

export const PILLAR_NAMES: Record<Pillar, string> = {
  people: "People",
  process: "Process",
  technology: "Technology"
};

// Helper functions for score colors
export const getScoreColor = (score: number): 'low' | 'medium' | 'high' => {
  if (score < 60) return 'low';
  if (score < 80) return 'medium';
  return 'high';
};

export const getScoreColorClass = (score: number, type: 'text' | 'bg' | 'stroke' = 'text'): string => {
  const color = getScoreColor(score);
  return `${type}-score-${color}`;
};
