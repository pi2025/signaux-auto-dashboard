'use client';

import { TrendingUp, TrendingDown, Minus, Clock, Target, Zap } from 'lucide-react';

export default function SignalCard({ signal }) {
  if (!signal) return null;

  const getSignalTypeIcon = (type) => {
    switch (type) {
      case 'BUY':
        return <TrendingUp className="h-4 w-4 text-signal-buy" />;
      case 'SELL':
        return <TrendingDown className="h-4 w-4 text-signal-sell" />;
      default:
        return <Minus className="h-4 w-4 text-signal-neutral" />;
    }
  };

  const getSignalTypeColor = (type) => {
    switch (type) {
      case 'BUY':
        return 'text-signal-buy bg-signal-buy/10';
      case 'SELL':
        return 'text-signal-sell bg-signal-sell/10';
      default:
        return 'text-signal-neutral bg-signal-neutral/10';
    }
  };

  const getRecommendationColor = (recommendation) => {
    if (recommendation.includes('ACHAT')) return 'text-signal-buy';
    if (recommendation.includes('VENTE')) return 'text-signal-sell';
    return 'text-signal-neutral';
  };

  const getStrengthColor = (score) => {
    if (score >= 80) return 'text-signal-buy';
    if (score >= 65) return 'text-green-600';
    if (score >= 35) return 'text-yellow-600';
    return 'text-signal-sell';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-sage-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-sage-50 to-sage-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-bold text-charcoal-900">{signal.symbol}</h2>
              <span className="text-lg text-charcoal-600">${signal.price?.toFixed(2)}</span>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRecommendationColor(signal.recommendation)}`}>
              {signal.recommendation}
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-charcoal-600">Score Global</p>
            <p className={`text-3xl font-bold ${getStrengthColor(signal.overallScore)}`}>
              {signal.overallScore}%
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Force du Signal */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-charcoal-700">Force du Signal</span>
            <span className={`text-sm font-medium ${getStrengthColor(signal.overallScore)}`}>
              {signal.strength}
            </span>
          </div>
          <div className="w-full bg-sage-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                signal.overallScore >= 65 ? 'bg-signal-buy' : 
                signal.overallScore >= 35 ? 'bg-yellow-500' : 'bg-signal-sell'
              }`}
              style={{ width: `${signal.overallScore}%` }}
            ></div>
          </div>
        </div>

        {/* Signaux Détaillés */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-charcoal-900 mb-4 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-sage-600" />
            Signaux Techniques
          </h3>
          
          <div className="space-y-3">
            {signal.signals?.map((sig, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-3 rounded-lg border ${getSignalTypeColor(sig.type)}`}
              >
                <div className="flex items-center space-x-3">
                  {getSignalTypeIcon(sig.type)}
                  <div>
                    <p className="font-medium text-sm">{sig.description}</p>
                    <p className="text-xs opacity-75">{sig.indicator}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium">{sig.strength}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Informations Supplémentaires */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-sage-200">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-charcoal-500" />
            <div>
              <p className="text-xs text-charcoal-600">Dernière mise à jour</p>
              <p className="text-sm font-medium text-charcoal-900">
                {new Date(signal.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-charcoal-500" />
            <div>
              <p className="text-xs text-charcoal-600">Expiration</p>
              <p className="text-sm font-medium text-charcoal-900">
                {signal.expiration ? new Date(signal.expiration).toLocaleDateString() : '24h'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-charcoal-500" />
            <div>
              <p className="text-xs text-charcoal-600">Timeframe</p>
              <p className="text-sm font-medium text-charcoal-900">{signal.timeframe || '1 jour'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}