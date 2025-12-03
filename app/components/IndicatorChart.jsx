'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';

export default function IndicatorChart({ symbol, signals }) {
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistoricalData();
  }, [symbol]);

  const fetchHistoricalData = async () => {
    try {
      const response = await fetch(`/api/historical/${symbol}`);
      const data = await response.json();
      setHistoricalData(data.slice(-30)); // Derniers 30 jours
    } catch (error) {
      console.error('Erreur lors de la récupération des données historiques:', error);
      // Données de démonstration
      setHistoricalData(generateDemoData());
    }
    setLoading(false);
  };

  const generateDemoData = () => {
    const data = [];
    const basePrice = 150;
    let price = basePrice;
    
    for (let i = 0; i < 30; i++) {
      price += (Math.random() - 0.5) * 5;
      data.push({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        close: price,
        volume: Math.floor(Math.random() * 1000000)
      });
    }
    return data;
  };

  const getSignalTypeIcon = (type) => {
    switch (type) {
      case 'BUY':
        return <TrendingUp className="h-4 w-4" />;
      case 'SELL':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getSignalTypeColor = (type) => {
    switch (type) {
      case 'BUY':
        return 'text-signal-buy';
      case 'SELL':
        return 'text-signal-sell';
      default:
        return 'text-signal-neutral';
    }
  };

  // Calculer les tendances
  const calculateTrend = (data) => {
    if (data.length < 2) return 'neutral';
    const recent = data.slice(-5);
    const firstPrice = recent[0].close;
    const lastPrice = recent[recent.length - 1].close;
    const change = ((lastPrice - firstPrice) / firstPrice) * 100;
    
    if (change > 2) return 'up';
    if (change < -2) return 'down';
    return 'neutral';
  };

  const trend = calculateTrend(historicalData);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble de la tendance */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className={`h-5 w-5 ${
            trend === 'up' ? 'text-signal-buy' : 
            trend === 'down' ? 'text-signal-sell' : 'text-signal-neutral'
          }`} />
          <span className="text-sm font-medium text-charcoal-700">
            Tendance {trend === 'up' ? 'Haussière' : trend === 'down' ? 'Baissière' : 'Neutre'}
          </span>
        </div>
        <div className="text-right">
          <p className="text-xs text-charcoal-600">Période</p>
          <p className="text-sm font-medium text-charcoal-900">30 derniers jours</p>
        </div>
      </div>

      {/* Graphique simplifié */}
      <div className="h-32 bg-sage-50 rounded-lg p-4">
        <div className="flex items-end justify-between h-full space-x-1">
          {historicalData.map((data, index) => {
            const maxPrice = Math.max(...historicalData.map(d => d.close));
            const minPrice = Math.min(...historicalData.map(d => d.close));
            const priceRange = maxPrice - minPrice;
            const height = ((data.close - minPrice) / priceRange) * 100;
            
            return (
              <div
                key={index}
                className={`flex-1 rounded-t transition-all duration-300 ${
                  index === historicalData.length - 1 ? 'bg-sage-600' : 'bg-sage-300'
                }`}
                style={{ height: `${Math.max(height, 5)}%` }}
                title={`${data.date}: $${data.close.toFixed(2)}`}
              ></div>
            );
          })}
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-sage-50 rounded-lg p-3">
          <p className="text-xs text-charcoal-600 mb-1">Prix actuel</p>
          <p className="text-lg font-bold text-charcoal-900">
            ${historicalData[historicalData.length - 1]?.close.toFixed(2) || '0.00'}
          </p>
        </div>
        <div className="bg-sage-50 rounded-lg p-3">
          <p className="text-xs text-charcoal-600 mb-1">Volume moyen</p>
          <p className="text-lg font-bold text-charcoal-900">
            {(historicalData.reduce((sum, d) => sum + (d.volume || 0), 0) / historicalData.length / 1000000).toFixed(1)}M
          </p>
        </div>
      </div>

      {/* Signaux Actifs */}
      <div>
        <h4 className="text-sm font-medium text-charcoal-700 mb-3">Signaux Actifs</h4>
        <div className="space-y-2">
          {signals.slice(0, 3).map((signal, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-sage-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className={`${getSignalTypeColor(signal.type)}`}>
                  {getSignalTypeIcon(signal.type)}
                </div>
                <span className="text-xs text-charcoal-700">{signal.description}</span>
              </div>
              <span className="text-xs font-medium text-charcoal-900">{signal.strength}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Indicateurs Clés */}
      <div>
        <h4 className="text-sm font-medium text-charcoal-700 mb-3">Indicateurs Clés</h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-green-50 border border-green-200 rounded-lg p-2">
            <p className="text-xs text-green-700">Support</p>
            <p className="text-sm font-bold text-green-900">
              ${(historicalData[historicalData.length - 1]?.close * 0.95).toFixed(2)}
            </p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-2">
            <p className="text-xs text-red-700">Résistance</p>
            <p className="text-sm font-bold text-red-900">
              ${(historicalData[historicalData.length - 1]?.close * 1.05).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}