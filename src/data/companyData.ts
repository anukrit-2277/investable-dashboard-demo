
import { Company, CategoryKey } from "../types";
import { v4 as uuidv4 } from 'uuid';

// Helper function to generate deterministic UUID from string
const generateDeterministicUUID = (input: string): string => {
  // Simple hash function to generate consistent UUID-like string
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert hash to a UUID-like string
  const hashStr = Math.abs(hash).toString(16).padStart(8, '0');
  return `${hashStr}-${hashStr.slice(0, 4)}-${hashStr.slice(4, 8)}-${hashStr.slice(0, 4)}-${hashStr}${hashStr.slice(0, 4)}`;
};

// Helper function to generate random scores
const randomScore = (min = 30, max = 100): number => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(1));
};

// Helper function to generate random attributes for a category
const generateAttributes = (categoryName: string, baseScore: number): { id: string; name: string; score: number; description?: string }[] => {
  const attributeTemplates = {
    finance: ["Financial Reporting", "Budget Management", "Revenue Growth", "Cost Control", "Investment Strategy"],
    legal: ["Contract Management", "Compliance", "Intellectual Property", "Risk Management", "Legal Structure"],
    tax: ["Tax Compliance", "Tax Planning", "International Tax", "Tax Documentation", "Tax Efficiency"],
    hr: ["Recruiting", "Employee Retention", "Training", "Performance Management", "Culture"],
    assets: ["Asset Management", "Physical Security", "Asset Tracking", "Maintenance", "Depreciation Planning"],
    it: ["Infrastructure", "Security", "Support", "Development", "Data Management"],
    product: ["Product Strategy", "Development Process", "Quality Control", "Product Innovation", "Market Fit"],
    marketing: ["Brand Strategy", "Digital Marketing", "Content Strategy", "Lead Generation", "Customer Acquisition"]
  };

  const categoryKey = categoryName as CategoryKey;
  const attributes = attributeTemplates[categoryKey] || ["Attribute 1", "Attribute 2", "Attribute 3", "Attribute 4", "Attribute 5"];
  
  return attributes.map((name) => {
    // Generate score variation around the base category score
    const variation = Math.random() * 20 - 10; // -10 to +10
    let score = baseScore + variation;
    score = Math.max(10, Math.min(100, score)); // Clamp between 10 and 100
    
    return {
      id: uuidv4(),
      name,
      score: parseFloat(score.toFixed(1)),
      description: `Details about ${name.toLowerCase()} within ${categoryName}`,
    };
  });
};

// Generate a random pillar data object
const generatePillarData = () => {
  const categories = ["finance", "legal", "tax", "hr", "assets", "it", "product", "marketing"] as const;
  const pillar: any = {};
  
  categories.forEach((category) => {
    const score = randomScore();
    pillar[category] = {
      score,
      attributes: generateAttributes(category, score)
    };
  });
  
  return pillar;
};

// Generate history entries
const generateHistory = (months = 6, baseScore = 70) => {
  const history: { date: string; score: number; changes?: string }[] = [];
  const now = new Date();
  const changeEvents = ["HR process updated", "New IT security measures", "Finance reporting improved", 
                        "Marketing strategy overhaul", "Product development restructured", "Legal compliance update",
                        "Tax optimization strategy", "Asset management system upgrade"];
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    
    // Add some natural variation to scores
    const variation = (Math.random() * 8) - 4; // -4 to +4 points
    let score = baseScore + (Math.random() < 0.7 ? variation : 0); // 70% chance of change
    score = Math.max(40, Math.min(95, score)); // Clamp between 40 and 95
    
    // Sometimes add a change description
    const change = Math.random() < 0.3 ? changeEvents[Math.floor(Math.random() * changeEvents.length)] : undefined;
    
    history.push({
      date: date.toISOString().split('T')[0],
      score: parseFloat(score.toFixed(1)),
      changes: change
    });
    
    // Update baseScore for next month's calculation
    baseScore = score;
  }
  
  return history;
};

// Generate company names
const companyNames = [
  "Innovatech Solutions", "Quantum Dynamics", "Apex Ventures", "BlueRiver Capital", 
  "CoreSystems Inc.", "DeltaWave Technologies", "Emerald Innovations", "FusionX Labs", 
  "GlobalEdge Partners", "Horizon Enterprises", "ImpactHub", "JetStream Networks",
  "KineticTech", "LuminaHealth", "MeridianGroup", "NovaCore Systems", "OmniTech Solutions",
  "PrismData", "QuantumSoft", "RedShift Robotics"
];

// Generate sample companies
export const generateCompanies = (count = 20): Company[] => {
  return Array(count).fill(null).map((_, index) => {
    const baseScore = randomScore(50, 90);
    
    return {
      id: generateDeterministicUUID(companyNames[index % companyNames.length]),
      name: companyNames[index % companyNames.length],
      macroScore: baseScore,
      lastUpdated: new Date().toISOString().split('T')[0],
      people: generatePillarData(),
      process: generatePillarData(),
      technology: generatePillarData(),
      scoreHistory: generateHistory(6, baseScore)
    };
  });
};

// Export the data
export const sampleCompanies = generateCompanies();
