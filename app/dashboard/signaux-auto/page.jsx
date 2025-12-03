'use client';

import { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, Activity, BarChart3, DollarSign } from 'lucide-react';
import SignalCard from '../../components/SignalCard';
import SymbolSelector from '../../components/SymbolSelector';
import IndicatorChart from '../../components/IndicatorChart';
import SignalStrengthMeter from '../../components/SignalStrengthMeter';

export default function SignauxAutoDashboard() {
  const [symbols, setSymbols] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Charger les symboles disponibles
  useEffect(() => {
    fetchSymbols();
  }, []);

  // Charger les signaux quand le symbole change
  useEffect(() => {
    if (selectedSymbol) {
      fetchSignals();
    }
  }, [selectedSymbol]);

  const fetchSymbols = async () => {
    try {
      const response = await fetch('/api/symbols');
      const data = await response.json();
      setSymbols(data.actions || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des symboles:', error);
      // Symboles par défaut en cas d'erreur
      setSymbols(['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX']);
    }
  };

  const fetchSignals = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/full-analysis/${selectedSymbol}`);
      const data = await response.json();
      
      if (data.signal) {
        setSignals([data.signal]);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des signaux:', error);
      // Données de démonstration en cas d'erreur
      setSignals([createDemoSignal(selectedSymbol)]);
    }
    setLoading(false);
  };

  const createDemoSignal = (symbol) => ({
    id: `${symbol}_demo`,
    symbol: symbol,
    timestamp: new Date().toISOString(),
    price: Math.random() * 200 + 50,
    overallScore: Math.floor(Math.random() * 100),
    strength: 'MODÉRÉ',
    recommendation: 'NEUTRE',
    signals: [
      {
        type: 'BUY',
        indicator: 'RSI_OVERSOLD',
        description: 'RSI en zone de survente',
        strength: 75,
        timestamp: new Date().toISOString()
      },
      {
        type: 'SELL',
        indicator: 'MACD_CROSS',
        description: 'Croisement baissier MACD',
        strength: 60,
        timestamp: new Date().toISOString()
      }
    ]
  });

  const refreshSignals = () => {
    fetchSignals();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sage-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-sage-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-8 w-8 text-sage-600" />
                <h1 className="text-2xl font-bold text-charcoal-900">Signaux Auto</h1>
              </div>
              <div className="hidden md:block">
                <span className="text-sm text-charcoal-600">
                  Système d'analyse technique avancé
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <SymbolSelector
                symbols={symbols}
                selectedSymbol={selectedSymbol}
                onSymbolChange={setSelectedSymbol}
              />
              <button
                onClick={refreshSignals}
                disabled={loading}
                className="px-4 py-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Chargement...' : 'Actualiser'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-sage-200">
            <div className="flex items-center">
              <div className="p-2 bg-signal-buy/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-signal-buy" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-charcoal-600">Signaux Achat</p>
                <p className="text-2xl font-bold text-charcoal-900">
                  {signals[0]?.signals?.filter(s => s.type === 'BUY').length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-sage-200">
            <div className="flex items-center">
              <div className="p-2 bg-signal-sell/10 rounded-lg">
                <TrendingDown className="h-6 w-6 text-signal-sell" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-charcoal-600">Signaux Vente</p>
                <p className="text-2xl font-bold text-charcoal-900">
                  {signals[0]?.signals?.filter(s => s.type === 'SELL').length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-sage-200">
            <div className="flex items-center">
              <div className="p-2 bg-signal-neutral/10 rounded-lg">
                <BarChart3 className="h-6 w-6 text-signal-neutral" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-charcoal-600">Score Global</p>
                <p className="text-2xl font-bold text-charcoal-900">
                  {signals[0]?.overallScore || 0}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-sage-200">
            <div className="flex items-center">
              <div className="p-2 bg-sage-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-sage-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-charcoal-600">Prix Actuel</p>
                <p className="text-2xl font-bold text-charcoal-900">
                  ${signals[0]?.price?.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Signal Principal */}
        {signals.map((signal) => (
          <div key={signal.id} className="mb-8">
            <SignalCard signal={signal} />
          </div>
        ))}

        {/* Graphiques et Analyse */}
        {signals.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Indicateur de Force */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-sage-200">
              <h3 className="text-lg font-semibold text-charcoal-900 mb-4">
                Force du Signal
              </h3>
              <SignalStrengthMeter 
                score={signals[0]?.overallScore || 0}
                recommendation={signals[0]?.recommendation || 'NEUTRE'}
              />
            </div>

            {/* Graphique des Indicateurs */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-sage-200">
              <h3 className="text-lg font-semibold text-charcoal-900 mb-4">
                Analyse Technique
              </h3>
              <IndicatorChart 
                symbol={selectedSymbol}
                signals={signals[0]?.signals || []}
              />
            </div>
          </div>
        )}

        {/* Dernier Signal */}
        {lastUpdate && (
          <div className="mt-8 text-center">
            <p className="text-sm text-charcoal-600">
              Dernière mise à jour: {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}