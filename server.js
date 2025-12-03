const express = require('express');
const cors = require('cors');
const path = require('path');
const MarketDataService = require('./services/market-data-service/marketDataService');
const IndicatorEngine = require('./services/indicator-engine/indicatorEngine');
const SignalEngine = require('./services/signal-engine/signalEngine');

const app = express();
const PORT = process.env.PORT || 3001;

// Services
const marketDataService = new MarketDataService();
const indicatorEngine = new IndicatorEngine();
const signalEngine = new SignalEngine();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes API

// Obtenir les symboles disponibles
app.get('/api/symbols', (req, res) => {
  try {
    const categories = marketDataService.getSymbolsByCategory();
    res.json(categories);
  } catch (error) {
    console.error('Erreur lors de la récupération des symboles:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Obtenir les informations d'un symbole
app.get('/api/symbol-info/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const info = await marketDataService.getSymbolInfo(symbol);
    res.json(info);
  } catch (error) {
    console.error('Erreur lors de la récupération des infos du symbole:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Obtenir les données historiques
app.get('/api/historical/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { period = '1y', interval = '1d' } = req.query;
    
    const data = await marketDataService.getHistoricalData(symbol, period, interval);
    res.json(data);
  } catch (error) {
    console.error('Erreur lors de la récupération des données historiques:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Obtenir les indicateurs techniques
app.get('/api/indicators/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { period = '1y' } = req.query;
    
    // Récupérer les données historiques
    const data = await marketDataService.getHistoricalData(symbol, period);
    
    // Calculer les indicateurs
    const indicators = await indicatorEngine.calculateAllIndicators(data, symbol);
    
    res.json({
      symbol,
      period,
      indicators,
      lastUpdate: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur lors du calcul des indicateurs:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Obtenir les signaux de trading
app.get('/api/signals/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { period = '1y' } = req.query;
    
    // Récupérer les données et calculer les indicateurs
    const data = await marketDataService.getHistoricalData(symbol, period);
    const indicators = await indicatorEngine.calculateAllIndicators(data, symbol);
    
    // Prix actuel
    const currentPrice = data[data.length - 1].close;
    
    // Générer les signaux
    const signal = await signalEngine.generateSignals(indicators, symbol, currentPrice, data);
    
    res.json(signal);
  } catch (error) {
    console.error('Erreur lors de la génération des signaux:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Obtenir les signaux pour plusieurs symboles
app.post('/api/signals/batch', async (req, res) => {
  try {
    const { symbols, period = '1y' } = req.body;
    
    if (!symbols || !Array.isArray(symbols)) {
      return res.status(400).json({ error: 'Symboles manquants ou invalides' });
    }

    const signals = [];
    
    for (const symbol of symbols) {
      try {
        const data = await marketDataService.getHistoricalData(symbol, period);
        const indicators = await indicatorEngine.calculateAllIndicators(data, symbol);
        const currentPrice = data[data.length - 1].close;
        const signal = await signalEngine.generateSignals(indicators, symbol, currentPrice, data);
        
        if (signal) {
          signals.push(signal);
        }
      } catch (error) {
        console.warn(`Impossible de générer les signaux pour ${symbol}:`, error.message);
      }
    }

    res.json({
      signals,
      count: signals.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur lors de la génération des signaux batch:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Obtenir les données complètes (historique + indicateurs + signaux)
app.get('/api/full-analysis/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { period = '1y' } = req.query;
    
    // Récupérer toutes les données
    const [data, info, indicators, signal] = await Promise.all([
      marketDataService.getHistoricalData(symbol, period),
      marketDataService.getSymbolInfo(symbol),
      indicatorEngine.calculateAllIndicators(await marketDataService.getHistoricalData(symbol, period), symbol),
      (async () => {
        const historicalData = await marketDataService.getHistoricalData(symbol, period);
        const inds = await indicatorEngine.calculateAllIndicators(historicalData, symbol);
        const currentPrice = historicalData[historicalData.length - 1].close;
        return signalEngine.generateSignals(inds, symbol, currentPrice, historicalData);
      })()
    ]);

    res.json({
      symbol,
      info,
      data,
      indicators,
      signal,
      analysisDate: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur lors de l\'analyse complète:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    services: {
      marketData: 'OK',
      indicators: 'OK',
      signals: 'OK'
    }
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur API démarré sur le port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Symboles disponibles: http://localhost:${PORT}/api/symbols`);
});

module.exports = app;