
import React from 'react';
import { getScoreColorClass } from '@/types';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showValue?: boolean;
  className?: string;
  animate?: boolean;
}

const ScoreRing: React.FC<ScoreRingProps> = ({ 
  score, 
  size = 80, 
  strokeWidth = 4,
  showValue = true,
  className = '',
  animate = true
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  
  // Animation state
  const [displayedProgress, setDisplayedProgress] = React.useState(animate ? 0 : progress);
  const [displayedScore, setDisplayedScore] = React.useState(animate ? 0 : score);
  
  React.useEffect(() => {
    if (!animate) {
      setDisplayedProgress(progress);
      setDisplayedScore(score);
      return;
    }
    
    const timer = setTimeout(() => {
      setDisplayedProgress(progress);
      
      // Animate score counter
      let startValue = 0;
      const duration = 1200;
      const startTime = Date.now();
      
      const updateScore = () => {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;
        
        if (elapsedTime < duration) {
          const value = Math.min(score * (elapsedTime / duration), score);
          setDisplayedScore(parseFloat(value.toFixed(1)));
          requestAnimationFrame(updateScore);
        } else {
          setDisplayedScore(score);
        }
      };
      
      updateScore();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [score, progress, animate]);

  const scoreColorClass = getScoreColorClass(score, 'stroke');

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - displayedProgress}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className={`transition-all duration-1000 ease-out ${scoreColorClass}`}
        />
      </svg>
      
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-lg font-semibold ${getScoreColorClass(score)}`}>
            {displayedScore.toFixed(1)}
          </span>
        </div>
      )}
    </div>
  );
};

export default ScoreRing;
