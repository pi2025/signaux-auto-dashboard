'use client';

import { useEffect, useState } from 'react';

export default function SignalStrengthMeter({ score, recommendation }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const animationDuration = 1000;
    const steps = 60;
    const increment = score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, animationDuration / steps);

    return () => clearInterval(timer);
  }, [score]);

  const getRecommendationColor = (rec) => {
    if (rec.includes('ACHAT FORT')) return 'text-signal-buy';
    if (rec.includes('ACHAT')) return 'text-green-600';
    if (rec.includes('VENTE FORTE')) return 'text-signal-sell';
    if (rec.includes('VENTE')) return 'text-red-600';
    return 'text-signal-neutral';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-signal-buy';
    if (score >= 65) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    if (score >= 35) return 'text-orange-600';
    return 'text-signal-sell';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Très Fort';
    if (score >= 65) return 'Fort';
    if (score >= 50) return 'Modéré';
    if (score >= 35) return 'Faible';
    return 'Très Faible';
  };

  return (
    <div className="flex flex-col items-center">
      {/* Cercle de Progression */}
      <div className="relative w-32 h-32 mb-6">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
          {/* Cercle de fond */}
          <circle
            cx="60"
            cy="60"
            r="50"
            stroke="#e2e8f0"
            strokeWidth="8"
            fill="none"
          />
          {/* Cercle de progression */}
          <circle
            cx="60"
            cy="60"
            r="50"
            stroke={score >= 65 ? '#10b981' : score >= 35 ? '#f59e0b' : '#ef4444'}
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 50}`}
            strokeDashoffset={`${2 * Math.PI * 50 * (1 - animatedScore / 100)}`}
            className="transition-all duration-1000 ease-out"
            strokeLinecap="round"
          />
        </svg>
        
        {/* Texte au centre */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
            {animatedScore}%
          </span>
          <span className="text-xs text-charcoal-600 mt-1">
            {getScoreLabel(score)}
          </span>
        </div>
      </div>

      {/* Recommandation */}
      <div className="text-center">
        <p className="text-sm text-charcoal-600 mb-2">Recommandation</p>
        <p className={`text-xl font-bold ${getRecommendationColor(recommendation)}`}>
          {recommendation}
        </p>
      </div>

      {/* Barre de progression horizontale */}
      <div className="w-full mt-4">
        <div className="flex justify-between text-xs text-charcoal-600 mb-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
        <div className="w-full bg-sage-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-1000 ${
              score >= 65 ? 'bg-signal-buy' : score >= 35 ? 'bg-yellow-500' : 'bg-signal-sell'
            }`}
            style={{ width: `${animatedScore}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}