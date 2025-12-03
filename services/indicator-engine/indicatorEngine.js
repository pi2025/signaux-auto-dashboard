const { 
  SMA, EMA, WMA, MACD, ADX, RSI, Stochastic, StochRSI, 
  CCI, WilliamsR, Momentum, ROC, AwesomeOscillator, TRIX, 
  UltimateOscillator, KST, BollingerBands, ATR, KeltnerChannels,
  StandardDeviation, OBV, ChaikinMoneyFlow, MoneyFlowIndex,
  VolumeOscillator, ADL, ChaikinADOscillator, ForceIndex,
  NegativeVolumeIndex, Aroon, PSAR, SuperTrend, Ichimoku
} = require('technicalindicators');

class IndicatorEngine {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 10 * 60 * 1000; // 10 minutes
  }

  // Calculer tous les indicateurs pour un ensemble de données
  async calculateAllIndicators(data, symbol) {
    const cacheKey = `${symbol}_${data.length}`;
    
    if (this.cache.has(cacheKey) && 
        Date.now() - this.cache.get(cacheKey).timestamp < this.cacheTimeout) {
      return this.cache.get(cacheKey).data;
    }

    const indicators = {};

    try {
      // Préparer les données
      const prices = data.map(d => d.close);
      const highs = data.map(d => d.high);
      const lows = data.map(d => d.low);
      const volumes = data.map(d => d.volume);
      const opens = data.map(d => d.open);

      // Moyennes Mobiles (Tendance)
      indicators.SMA_5 = SMA.calculate({ period: 5, values: prices });
      indicators.SMA_10 = SMA.calculate({ period: 10, values: prices });
      indicators.SMA_20 = SMA.calculate({ period: 20, values: prices });
      indicators.SMA_50 = SMA.calculate({ period: 50, values: prices });
      indicators.SMA_100 = SMA.calculate({ period: 100, values: prices });
      indicators.SMA_200 = SMA.calculate({ period: 200, values: prices });

      indicators.EMA_5 = EMA.calculate({ period: 5, values: prices });
      indicators.EMA_10 = EMA.calculate({ period: 10, values: prices });
      indicators.EMA_20 = EMA.calculate({ period: 20, values: prices });
      indicators.EMA_50 = EMA.calculate({ period: 50, values: prices });
      indicators.EMA_100 = EMA.calculate({ period: 100, values: prices });
      indicators.EMA_200 = EMA.calculate({ period: 200, values: prices });

      indicators.WMA_20 = WMA.calculate({ period: 20, values: prices });

      // MACD
      const macdResult = MACD.calculate({ 
        fastPeriod: 12, 
        slowPeriod: 26, 
        signalPeriod: 9, 
        values: prices 
      });
      indicators.MACD = macdResult.map(r => r.MACD);
      indicators.MACD_SIGNAL = macdResult.map(r => r.signal);
      indicators.MACD_HISTOGRAM = macdResult.map(r => r.histogram);

      // ADX
      const adxResult = ADX.calculate({ 
        period: 14, 
        close: prices, 
        high: highs, 
        low: lows 
      });
      indicators.ADX = adxResult;

      // Momentum/Oscillators
      indicators.RSI = RSI.calculate({ period: 14, values: prices });
      indicators.RSI_21 = RSI.calculate({ period: 21, values: prices });
      indicators.RSI_50 = RSI.calculate({ period: 50, values: prices });

      const stochResult = Stochastic.calculate({ 
        high: highs, 
        low: lows, 
        close: prices, 
        period: 14, 
        signalPeriod: 3 
      });
      indicators.STOCH_K = stochResult.map(r => r.k);
      indicators.STOCH_D = stochResult.map(r => r.d);

      const stochRSIResult = StochRSI.calculate({ 
        values: prices, 
        rsiPeriod: 14, 
        stochasticPeriod: 14, 
        kPeriod: 3, 
        dPeriod: 3 
      });
      indicators.STOCHRSI_K = stochRSIResult.map(r => r.k);
      indicators.STOCHRSI_D = stochRSIResult.map(r => r.d);

      indicators.CCI = CCI.calculate({ 
        period: 20, 
        high: highs, 
        low: lows, 
        close: prices 
      });

      indicators.WILLR = WilliamsR.calculate({ 
        high: highs, 
        low: lows, 
        close: prices, 
        period: 14 
      });

      indicators.MOM = Momentum.calculate({ period: 10, values: prices });
      indicators.ROC = ROC.calculate({ period: 10, values: prices });
      indicators.AO = AwesomeOscillator.calculate({ high: highs, low: lows });
      indicators.TRIX = TRIX.calculate({ period: 15, values: prices });

      indicators.UO = UltimateOscillator.calculate({ 
        high: highs, 
        low: lows, 
        close: prices, 
        period1: 7, 
        period2: 14, 
        period3: 28 
      });

      indicators.KST = KST.calculate({ 
        values: prices, 
        ROCPer1: 10, 
        ROCPer2: 15, 
        ROCPer3: 20, 
        ROCPer4: 30, 
        SMAROCPer1: 4, 
        SMAROCPer2: 4, 
        SMAROCPer3: 4, 
        SMAROCPer4: 6, 
        signalPeriod: 9 
      }).map(r => r.kst);

      // Volatilité
      const bbResult = BollingerBands.calculate({ 
        period: 20, 
        stdDev: 2, 
        values: prices 
      });
      indicators.BB_UPPER = bbResult.map(r => r.upper);
      indicators.BB_MIDDLE = bbResult.map(r => r.middle);
      indicators.BB_LOWER = bbResult.map(r => r.lower);
      indicators.BB_WIDTH = bbResult.map(r => r.upper - r.lower);

      indicators.ATR = ATR.calculate({ 
        period: 14, 
        high: highs, 
        low: lows, 
        close: prices 
      });

      const kcResult = KeltnerChannels.calculate({ 
        period: 20, 
        multiplier: 2.0, 
        high: highs, 
        low: lows, 
        close: prices 
      });
      indicators.KC_UPPER = kcResult.map(r => r.upper);
      indicators.KC_LOWER = kcResult.map(r => r.lower);

      indicators.STDDEV = StandardDeviation.calculate({ period: 20, values: prices });

      // Volume
      indicators.OBV = OBV.calculate({ close: prices, volume: volumes });
      indicators.CMF = ChaikinMoneyFlow.calculate({ 
        high: highs, 
        low: lows, 
        close: prices, 
        volume: volumes, 
        period: 20 
      });
      indicators.MFI = MoneyFlowIndex.calculate({ 
        high: highs, 
        low: lows, 
        close: prices, 
        volume: volumes, 
        period: 14 
      });
      indicators.VO = VolumeOscillator.calculate({ 
        fastPeriod: 12, 
        slowPeriod: 26, 
        volume: volumes 
      });
      indicators.AD_LINE = ADL.calculate({ 
        high: highs, 
        low: lows, 
        close: prices, 
        volume: volumes 
      });
      indicators.ADOSC = ChaikinADOscillator.calculate({ 
        high: highs, 
        low: lows, 
        close: prices, 
        volume: volumes, 
        fastPeriod: 3, 
        slowPeriod: 10 
      });
      indicators.FI = ForceIndex.calculate({ 
        close: prices, 
        volume: volumes, 
        period: 13 
      });
      indicators.NVI = NegativeVolumeIndex.calculate({ close: prices, volume: volumes });

      // Support/Résistance et autres
      const aroonResult = Aroon.calculate({ 
        period: 25, 
        high: highs, 
        low: lows 
      });
      indicators.AROON_UP = aroonResult.map(r => r.up);
      indicators.AROON_DOWN = aroonResult.map(r => r.down);
      indicators.AROON_OSC = aroonResult.map(r => r.oscillator);

      indicators.PSAR = PSAR.calculate({ 
        high: highs, 
        low: lows, 
        step: 0.02, 
        max: 0.2 
      });

      const supertrendResult = SuperTrend.calculate({ 
        period: 10, 
        multiplier: 3.0, 
        high: highs, 
        low: lows, 
        close: prices 
      });
      indicators.SUPERTREND = supertrendResult.map(r => r.value);

      const ichimokuResult = Ichimoku.calculate({ 
        high: highs, 
        low: lows, 
        conversionPeriod: 9, 
        basePeriod: 26, 
        spanPeriod: 52, 
        displacement: 26 
      });
      indicators.ICHIMOKU_TENKAN = ichimokuResult.map(r => r.conversion);
      indicators.ICHIMOKU_KIJUN = ichimokuResult.map(r => r.base);
      indicators.ICHIMOKU_CHIKOU = ichimokuResult.map(r => r.spanA);

      // Calculer les pivots de Fibonacci
      const recentHigh = Math.max(...prices.slice(-50));
      const recentLow = Math.min(...prices.slice(-50));
      const range = recentHigh - recentLow;
      
      indicators.FIB_38 = Array(prices.length).fill(recentHigh - range * 0.382);
      indicators.FIB_61 = Array(prices.length).fill(recentHigh - range * 0.618);

      // Calculer les points pivots
      const yesterday = data[data.length - 2];
      if (yesterday) {
        const pivot = (yesterday.high + yesterday.low + yesterday.close) / 3;
        const r1 = 2 * pivot - yesterday.low;
        const s1 = 2 * pivot - yesterday.high;
        
        indicators.PIVOT = Array(prices.length).fill(pivot);
        indicators.PIVOT_R1 = Array(prices.length).fill(r1);
        indicators.PIVOT_S1 = Array(prices.length).fill(s1);
      }

      // Mettre en cache
      this.cache.set(cacheKey, {
        data: indicators,
        timestamp: Date.now()
      });

      return indicators;
    } catch (error) {
      console.error(`Erreur lors du calcul des indicateurs pour ${symbol}:`, error.message);
      throw error;
    }
  }

  // Obtenir la valeur actuelle d'un indicateur
  getCurrentValue(indicatorArray) {
    if (!indicatorArray || indicatorArray.length === 0) return null;
    return indicatorArray[indicatorArray.length - 1];
  }

  // Obtenir l'historique récent d'un indicateur
  getRecentValues(indicatorArray, periods = 10) {
    if (!indicatorArray || indicatorArray.length === 0) return [];
    return indicatorArray.slice(-periods);
  }
}

module.exports = IndicatorEngine;