const yahooFinance = require('yahoo-finance2').default;
const axios = require('axios');

class MarketDataService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Récupérer les données historiques pour un symbole
  async getHistoricalData(symbol, period = '1y', interval = '1d') {
    const cacheKey = `${symbol}_${period}_${interval}`;
    
    // Vérifier le cache
    if (this.cache.has(cacheKey) && 
        Date.now() - this.cache.get(cacheKey).timestamp < this.cacheTimeout) {
      return this.cache.get(cacheKey).data;
    }

    try {
      const queryOptions = { period, interval };
      const result = await yahooFinance.chart(symbol, queryOptions);
      
      if (!result.quotes || result.quotes.length === 0) {
        throw new Error(`Aucune donnée trouvée pour ${symbol}`);
      }

      // Formater les données
      const formattedData = result.quotes.map(quote => ({
        timestamp: quote.date.getTime(),
        date: quote.date.toISOString().split('T')[0],
        open: quote.open,
        high: quote.high,
        low: quote.low,
        close: quote.close,
        volume: quote.volume || 0,
        adjClose: quote.adjClose || quote.close
      }));

      // Trier par date
      formattedData.sort((a, b) => a.timestamp - b.timestamp);

      // Mettre en cache
      this.cache.set(cacheKey, {
        data: formattedData,
        timestamp: Date.now()
      });

      return formattedData;
    } catch (error) {
      console.error(`Erreur lors de la récupération des données pour ${symbol}:`, error.message);
      throw error;
    }
  }

  // Récupérer les informations sur un symbole
  async getSymbolInfo(symbol) {
    try {
      const quote = await yahooFinance.quote(symbol);
      const info = await yahooFinance.quoteSummary(symbol);
      
      return {
        symbol: quote.symbol,
        name: quote.longName || quote.shortName || symbol,
        currency: quote.currency,
        exchange: quote.exchange,
        marketCap: quote.marketCap,
        sector: info.summaryProfile?.sector || 'N/A',
        industry: info.summaryProfile?.industry || 'N/A',
        currentPrice: quote.regularMarketPrice,
        change: quote.regularMarketChange,
        changePercent: quote.regularMarketChangePercent,
        volume: quote.regularMarketVolume,
        avgVolume: quote.averageDailyVolume10Day,
        fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
        fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
        peRatio: quote.trailingPE,
        dividendYield: quote.trailingAnnualDividendYield
      };
    } catch (error) {
      console.error(`Erreur lors de la récupération des infos pour ${symbol}:`, error.message);
      return {
        symbol,
        name: symbol,
        currency: 'USD',
        exchange: 'N/A',
        currentPrice: 0,
        change: 0,
        changePercent: 0,
        volume: 0
      };
    }
  }

  // Récupérer les données pour plusieurs symboles
  async getMultipleSymbolsData(symbols, period = '1y') {
    const promises = symbols.map(symbol => 
      this.getHistoricalData(symbol, period).catch(error => {
        console.warn(`Impossible de récupérer ${symbol}:`, error.message);
        return null;
      })
    );

    const results = await Promise.all(promises);
    
    return symbols.reduce((acc, symbol, index) => {
      if (results[index]) {
        acc[symbol] = results[index];
      }
      return acc;
    }, {});
  }

  // Obtenir les symboles populaires par défaut
  getDefaultSymbols() {
    return [
      'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX',
      'SPY', 'QQQ', 'IWM', 'VTI', 'VXUS',
      'EURUSD=X', 'GBPUSD=X', 'USDJPY=X',
      'GC=F', 'CL=F', 'BTC-USD', 'ETH-USD'
    ];
  }

  // Obtenir les symboles par catégorie
  getSymbolsByCategory() {
    return {
      actions: [
        'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX',
        'JPM', 'JNJ', 'V', 'PG', 'UNH', 'HD', 'MA', 'DIS', 'BAC', 'ADBE',
        'CRM', 'KO', 'PFE', 'WMT', 'MRK', 'CSCO', 'INTC', 'NFLX', 'ORCL',
        'TMO', 'ABBV', 'DHR', 'ACN', 'CMCSA', 'PGR', 'COST', 'VZ', 'BMY',
        'NEE', 'LLY', 'AVGO', 'TXN', 'UNP', 'MDT', 'LIN', 'QCOM', 'AMGN',
        'HON', 'PM', 'RTX', 'DE', 'LOW', 'IBM', 'CVX', 'T', 'SBUX', 'AMD'
      ],
      etfs: [
        'SPY', 'QQQ', 'IWM', 'VTI', 'VXUS', 'EFA', 'EEM', 'AGG', 'TLT',
        'GLD', 'SLV', 'VNQ', 'XLF', 'XLK', 'XLE', 'XLU', 'XLI', 'XLP',
        'XLY', 'XLV', 'XLB', 'XLRE'
      ],
      forex: [
        'EURUSD=X', 'GBPUSD=X', 'USDJPY=X', 'USDCHF=X', 'AUDUSD=X', 'USDCAD=X',
        'NZDUSD=X', 'EURJPY=X', 'GBPJPY=X', 'EURGBP=X'
      ],
      commodities: [
        'GC=F', 'CL=F', 'SI=F', 'PL=F', 'NG=F', 'ZB=F', 'ZN=F', 'ZF=F'
      ],
      crypto: [
        'BTC-USD', 'ETH-USD', 'ADA-USD', 'DOGE-USD', 'XRP-USD', 'DOT-USD',
        'LINK-USD', 'BCH-USD', 'LTC-USD', 'UNI-USD', 'MATIC-USD', 'SOL-USD'
      ]
    };
  }
}

module.exports = MarketDataService;