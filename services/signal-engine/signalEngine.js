class SignalEngine {
  constructor() {
    this.signals = new Map();
  }

  // Générer des signaux basés sur les indicateurs
  async generateSignals(indicators, symbol, currentPrice, data) {
    const signals = [];
    const currentTime = new Date();

    try {
      // Signaux de tendance basés sur les moyennes mobiles
      const trendSignals = this.analyzeTrendSignals(indicators, currentPrice);
      signals.push(...trendSignals);

      // Signaux de momentum basés sur RSI et oscillateurs
      const momentumSignals = this.analyzeMomentumSignals(indicators);
      signals.push(...momentumSignals);

      // Signaux de volatilité basés sur les bandes de Bollinger
      const volatilitySignals = this.analyzeVolatilitySignals(indicators, currentPrice);
      signals.push(...volatilitySignals);

      // Signaux de volume
      const volumeSignals = this.analyzeVolumeSignals(indicators);
      signals.push(...volumeSignals);

      // Signaux de support/résistance
      const srSignals = this.analyzeSupportResistanceSignals(indicators, currentPrice);
      signals.push(...srSignals);

      // Signaux combinés et avancés
      const advancedSignals = this.analyzeAdvancedSignals(indicators, currentPrice, data);
      signals.push(...advancedSignals);

      // Calculer le score global de confiance
      const overallScore = this.calculateOverallScore(signals);

      // Créer le signal principal
      const mainSignal = {
        id: `${symbol}_${currentTime.getTime()}`,
        symbol: symbol,
        timestamp: currentTime.toISOString(),
        price: currentPrice,
        signals: signals,
        overallScore: overallScore,
        strength: this.getSignalStrength(overallScore),
        recommendation: this.getRecommendation(overallScore, signals),
        timeframe: '1d',
        expiration: new Date(currentTime.getTime() + 24 * 60 * 60 * 1000).toISOString()
      };

      return mainSignal;
    } catch (error) {
      console.error(`Erreur lors de la génération des signaux pour ${symbol}:`, error.message);
      return null;
    }
  }

  // Analyser les signaux de tendance
  analyzeTrendSignals(indicators, currentPrice) {
    const signals = [];
    const currentTime = new Date();

    try {
      // Moyennes Mobiles - Croisement
      const sma20 = this.getCurrentValue(indicators.SMA_20);
      const sma50 = this.getCurrentValue(indicators.SMA_50);
      const sma200 = this.getCurrentValue(indicators.SMA_200);
      const ema20 = this.getCurrentValue(indicators.EMA_20);
      const ema50 = this.getCurrentValue(indicators.EMA_50);

      // Golden Cross / Death Cross (SMA)
      if (sma20 && sma50) {
        const sma20_prev = this.getPreviousValue(indicators.SMA_20, 2);
        const sma50_prev = this.getPreviousValue(indicators.SMA_50, 2);
        
        if (sma20_prev <= sma50_prev && sma20 > sma50) {
          signals.push({
            type: 'BUY',
            indicator: 'SMA_CROSS',
            description: 'Croisement haussier SMA20/SMA50',
            strength: 70,
            timestamp: currentTime.toISOString()
          });
        } else if (sma20_prev >= sma50_prev && sma20 < sma50) {
          signals.push({
            type: 'SELL',
            indicator: 'SMA_CROSS',
            description: 'Croisement baissier SMA20/SMA50',
            strength: 70,
            timestamp: currentTime.toISOString()
          });
        }
      }

      // Prix par rapport aux moyennes mobiles
      if (currentPrice && sma20 && sma50 && sma200) {
        if (currentPrice > sma20 && sma20 > sma50 && sma50 > sma200) {
          signals.push({
            type: 'BUY',
            indicator: 'TREND_ALIGNMENT',
            description: 'Tendance haussière confirmée',
            strength: 80,
            timestamp: currentTime.toISOString()
          });
        } else if (currentPrice < sma20 && sma20 < sma50 && sma50 < sma200) {
          signals.push({
            type: 'SELL',
            indicator: 'TREND_ALIGNMENT',
            description: 'Tendance baissière confirmée',
            strength: 80,
            timestamp: currentTime.toISOString()
          });
        }
      }

      // MACD
      const macd = this.getCurrentValue(indicators.MACD);
      const macdSignal = this.getCurrentValue(indicators.MACD_SIGNAL);
      
      if (macd && macdSignal) {
        const macd_prev = this.getPreviousValue(indicators.MACD, 2);
        const macdSignal_prev = this.getPreviousValue(indicators.MACD_SIGNAL, 2);
        
        if (macd_prev <= macdSignal_prev && macd > macdSignal) {
          signals.push({
            type: 'BUY',
            indicator: 'MACD_CROSS',
            description: 'Croisement haussier MACD',
            strength: 65,
            timestamp: currentTime.toISOString()
          });
        } else if (macd_prev >= macdSignal_prev && macd < macdSignal) {
          signals.push({
            type: 'SELL',
            indicator: 'MACD_CROSS',
            description: 'Croisement baissier MACD',
            strength: 65,
            timestamp: currentTime.toISOString()
          });
        }
      }

      // ADX
      const adx = this.getCurrentValue(indicators.ADX);
      if (adx) {
        if (adx > 25) {
          signals.push({
            type: 'NEUTRAL',
            indicator: 'ADX_STRENGTH',
            description: `Force de tendance élevée (ADX: ${adx.toFixed(1)})`,
            strength: Math.min(adx * 2, 100),
            timestamp: currentTime.toISOString()
          });
        }
      }

    } catch (error) {
      console.error('Erreur lors de l\'analyse des signaux de tendance:', error.message);
    }

    return signals;
  }

  // Analyser les signaux de momentum
  analyzeMomentumSignals(indicators) {
    const signals = [];
    const currentTime = new Date();

    try {
      // RSI
      const rsi = this.getCurrentValue(indicators.RSI);
      if (rsi) {
        if (rsi < 30) {
          signals.push({
            type: 'BUY',
            indicator: 'RSI_OVERSOLD',
            description: `RSI en zone de survente (${rsi.toFixed(1)})`,
            strength: Math.max(30, 100 - rsi * 2),
            timestamp: currentTime.toISOString()
          });
        } else if (rsi > 70) {
          signals.push({
            type: 'SELL',
            indicator: 'RSI_OVERBOUGHT',
            description: `RSI en zone d\'achat excessif (${rsi.toFixed(1)})`,
            strength: Math.min(70, rsi * 1.5),
            timestamp: currentTime.toISOString()
          });
        }
      }

      // Stochastique
      const stochK = this.getCurrentValue(indicators.STOCH_K);
      const stochD = this.getCurrentValue(indicators.STOCH_D);
      
      if (stochK && stochD) {
        if (stochK < 20 && stochD < 20 && stochK > stochD) {
          signals.push({
            type: 'BUY',
            indicator: 'STOCHASTIC_OVERSOLD',
            description: `Stochastique en zone de survente (%K: ${stochK.toFixed(1)}, %D: ${stochD.toFixed(1)})`,
            strength: Math.max(40, 100 - stochK * 3),
            timestamp: currentTime.toISOString()
          });
        } else if (stochK > 80 && stochD > 80 && stochK < stochD) {
          signals.push({
            type: 'SELL',
            indicator: 'STOCHASTIC_OVERBOUGHT',
            description: `Stochastique en zone d\'achat excessif (%K: ${stochK.toFixed(1)}, %D: ${stochD.toFixed(1)})`,
            strength: Math.min(80, stochK * 1.2),
            timestamp: currentTime.toISOString()
          });
        }
      }

      // Williams %R
      const willr = this.getCurrentValue(indicators.WILLR);
      if (willr) {
        if (willr < -80) {
          signals.push({
            type: 'BUY',
            indicator: 'WILLIAMS_OVERSOLD',
            description: `Williams %R en zone de survente (${willr.toFixed(1)})`,
            strength: Math.max(40, 100 + willr),
            timestamp: currentTime.toISOString()
          });
        } else if (willr > -20) {
          signals.push({
            type: 'SELL',
            indicator: 'WILLIAMS_OVERBOUGHT',
            description: `Williams %R en zone d\'achat excessif (${willr.toFixed(1)})`,
            strength: Math.min(80, -willr * 4),
            timestamp: currentTime.toISOString()
          });
        }
      }

      // CCI
      const cci = this.getCurrentValue(indicators.CCI);
      if (cci) {
        if (cci < -100) {
          signals.push({
            type: 'BUY',
            indicator: 'CCI_OVERSOLD',
            description: `CCI en zone de survente (${cci.toFixed(1)})`,
            strength: Math.max(40, Math.min(100, 100 + cci / 2)),
            timestamp: currentTime.toISOString()
          });
        } else if (cci > 100) {
          signals.push({
            type: 'SELL',
            indicator: 'CCI_OVERBOUGHT',
            description: `CCI en zone d\'achat excessif (${cci.toFixed(1)})`,
            strength: Math.min(80, Math.max(20, cci / 2)),
            timestamp: currentTime.toISOString()
          });
        }
      }

    } catch (error) {
      console.error('Erreur lors de l\'analyse des signaux de momentum:', error.message);
    }

    return signals;
  }

  // Analyser les signaux de volatilité
  analyzeVolatilitySignals(indicators, currentPrice) {
    const signals = [];
    const currentTime = new Date();

    try {
      // Bandes de Bollinger
      const bbUpper = this.getCurrentValue(indicators.BB_UPPER);
      const bbLower = this.getCurrentValue(indicators.BB_LOWER);
      const bbMiddle = this.getCurrentValue(indicators.BB_MIDDLE);
      
      if (bbUpper && bbLower && bbMiddle && currentPrice) {
        if (currentPrice >= bbUpper) {
          signals.push({
            type: 'SELL',
            indicator: 'BB_UPPER_TOUCH',
            description: `Prix au contact de la bande supérieure de Bollinger`,
            strength: 60,
            timestamp: currentTime.toISOString()
          });
        } else if (currentPrice <= bbLower) {
          signals.push({
            type: 'BUY',
            indicator: 'BB_LOWER_TOUCH',
            description: `Prix au contact de la bande inférieure de Bollinger`,
            strength: 60,
            timestamp: currentTime.toISOString()
          });
        }

        // Squeeze de Bollinger
        const bbWidth = this.getCurrentValue(indicators.BB_WIDTH);
        const atr = this.getCurrentValue(indicators.ATR);
        
        if (bbWidth && atr && bbWidth < atr * 0.5) {
          signals.push({
            type: 'NEUTRAL',
            indicator: 'BB_SQUEEZE',
            description: `Squeeze de Bollinger détecté - volatilité faible`,
            strength: 50,
            timestamp: currentTime.toISOString()
          });
        }
      }

      // ATR pour la volatilité
      const atr = this.getCurrentValue(indicators.ATR);
      const atr_prev = this.getPreviousValue(indicators.ATR, 5);
      
      if (atr && atr_prev) {
        if (atr > atr_prev * 1.5) {
          signals.push({
            type: 'NEUTRAL',
            indicator: 'ATR_INCREASE',
            description: `Volatilité en forte augmentation (ATR: ${atr.toFixed(2)})`,
            strength: 40,
            timestamp: currentTime.toISOString()
          });
        }
      }

    } catch (error) {
      console.error('Erreur lors de l\'analyse des signaux de volatilité:', error.message);
    }

    return signals;
  }

  // Analyser les signaux de volume
  analyzeVolumeSignals(indicators) {
    const signals = [];
    const currentTime = new Date();

    try {
      // Money Flow Index
      const mfi = this.getCurrentValue(indicators.MFI);
      if (mfi) {
        if (mfi < 20) {
          signals.push({
            type: 'BUY',
            indicator: 'MFI_OVERSOLD',
            description: `Money Flow Index en zone de survente (${mfi.toFixed(1)})`,
            strength: Math.max(40, 100 - mfi * 3),
            timestamp: currentTime.toISOString()
          });
        } else if (mfi > 80) {
          signals.push({
            type: 'SELL',
            indicator: 'MFI_OVERBOUGHT',
            description: `Money Flow Index en zone d\'achat excessif (${mfi.toFixed(1)})`,
            strength: Math.min(80, mfi * 1.2),
            timestamp: currentTime.toISOString()
          });
        }
      }

      // Chaikin Money Flow
      const cmf = this.getCurrentValue(indicators.CMF);
      if (cmf) {
        if (cmf > 0.1) {
          signals.push({
            type: 'BUY',
            indicator: 'CMF_POSITIVE',
            description: `Flux monétaire positif fort (${cmf.toFixed(3)})`,
            strength: Math.min(80, cmf * 500),
            timestamp: currentTime.toISOString()
          });
        } else if (cmf < -0.1) {
          signals.push({
            type: 'SELL',
            indicator: 'CMF_NEGATIVE',
            description: `Flux monétaire négatif fort (${cmf.toFixed(3)})`,
            strength: Math.min(80, -cmf * 500),
            timestamp: currentTime.toISOString()
          });
        }
      }

      // Volume Oscillator
      const vo = this.getCurrentValue(indicators.VO);
      if (vo) {
        if (vo > 5) {
          signals.push({
            type: 'BUY',
            indicator: 'VO_INCREASE',
            description: `Volume en forte augmentation (${vo.toFixed(1)}%)`,
            strength: Math.min(60, vo * 8),
            timestamp: currentTime.toISOString()
          });
        } else if (vo < -5) {
          signals.push({
            type: 'SELL',
            indicator: 'VO_DECREASE',
            description: `Volume en forte diminution (${vo.toFixed(1)}%)`,
            strength: Math.min(60, -vo * 8),
            timestamp: currentTime.toISOString()
          });
        }
      }

    } catch (error) {
      console.error('Erreur lors de l\'analyse des signaux de volume:', error.message);
    }

    return signals;
  }

  // Analyser les signaux de support/résistance
  analyzeSupportResistanceSignals(indicators, currentPrice) {
    const signals = [];
    const currentTime = new Date();

    try {
      // Points pivots
      const pivotR1 = this.getCurrentValue(indicators.PIVOT_R1);
      const pivotS1 = this.getCurrentValue(indicators.PIVOT_S1);
      
      if (pivotR1 && pivotS1 && currentPrice) {
        if (Math.abs(currentPrice - pivotR1) / currentPrice < 0.01) {
          signals.push({
            type: 'SELL',
            indicator: 'PIVOT_RESISTANCE',
            description: `Prix proche du niveau de résistance R1 (${pivotR1.toFixed(2)})`,
            strength: 55,
            timestamp: currentTime.toISOString()
          });
        } else if (Math.abs(currentPrice - pivotS1) / currentPrice < 0.01) {
          signals.push({
            type: 'BUY',
            indicator: 'PIVOT_SUPPORT',
            description: `Prix proche du niveau de support S1 (${pivotS1.toFixed(2)})`,
            strength: 55,
            timestamp: currentTime.toISOString()
          });
        }
      }

      // Fibonacci
      const fib38 = this.getCurrentValue(indicators.FIB_38);
      const fib61 = this.getCurrentValue(indicators.FIB_61);
      
      if (fib38 && fib61 && currentPrice) {
        if (Math.abs(currentPrice - fib38) / currentPrice < 0.01) {
          signals.push({
            type: 'NEUTRAL',
            indicator: 'FIB_38',
            description: `Prix au niveau de retracement Fibonacci 38.2% (${fib38.toFixed(2)})`,
            strength: 45,
            timestamp: currentTime.toISOString()
          });
        } else if (Math.abs(currentPrice - fib61) / currentPrice < 0.01) {
          signals.push({
            type: 'NEUTRAL',
            indicator: 'FIB_61',
            description: `Prix au niveau de retracement Fibonacci 61.8% (${fib61.toFixed(2)})`,
            strength: 50,
            timestamp: currentTime.toISOString()
          });
        }
      }

    } catch (error) {
      console.error('Erreur lors de l\'analyse des signaux S/R:', error.message);
    }

    return signals;
  }

  // Analyser les signaux avancés
  analyzeAdvancedSignals(indicators, currentPrice, data) {
    const signals = [];
    const currentTime = new Date();

    try {
      // SuperTrend
      const supertrend = this.getCurrentValue(indicators.SUPERTREND);
      if (supertrend && currentPrice) {
        if (currentPrice > supertrend) {
          signals.push({
            type: 'BUY',
            indicator: 'SUPERTREND_BULLISH',
            description: `Tendance haussière selon SuperTrend`,
            strength: 65,
            timestamp: currentTime.toISOString()
          });
        } else if (currentPrice < supertrend) {
          signals.push({
            type: 'SELL',
            indicator: 'SUPERTREND_BEARISH',
            description: `Tendance baissière selon SuperTrend`,
            strength: 65,
            timestamp: currentTime.toISOString()
          });
        }
      }

      // Ichimoku
      const tenkan = this.getCurrentValue(indicators.ICHIMOKU_TENKAN);
      const kijun = this.getCurrentValue(indicators.ICHIMOKU_KIJUN);
      
      if (tenkan && kijun && currentPrice) {
        if (currentPrice > tenkan && tenkan > kijun) {
          signals.push({
            type: 'BUY',
            indicator: 'ICHIMOKU_BULLISH',
            description: `Signal haussier Ichimoku confirmé`,
            strength: 70,
            timestamp: currentTime.toISOString()
          });
        } else if (currentPrice < tenkan && tenkan < kijun) {
          signals.push({
            type: 'SELL',
            indicator: 'ICHIMOKU_BEARISH',
            description: `Signal baissier Ichimoku confirmé`,
            strength: 70,
            timestamp: currentTime.toISOString()
          });
        }
      }

      // Divergence RSI/Prix (analyse simple)
      const rsi = this.getCurrentValue(indicators.RSI);
      const rsi_prev = this.getPreviousValue(indicators.RSI, 5);
      
      if (rsi && rsi_prev && data.length >= 10) {
        const price_current = currentPrice;
        const price_prev = data[data.length - 6]?.close;
        
        if (price_prev) {
          // Divergence haussière
          if (price_current < price_prev && rsi > rsi_prev && rsi < 50) {
            signals.push({
              type: 'BUY',
              indicator: 'RSI_DIVERGENCE_BULLISH',
              description: `Divergence haussière RSI/prix détectée`,
              strength: 75,
              timestamp: currentTime.toISOString()
            });
          }
          // Divergence baissière
          else if (price_current > price_prev && rsi < rsi_prev && rsi > 50) {
            signals.push({
              type: 'SELL',
              indicator: 'RSI_DIVERGENCE_BEARISH',
              description: `Divergence baissière RSI/prix détectée`,
              strength: 75,
              timestamp: currentTime.toISOString()
            });
          }
        }
      }

    } catch (error) {
      console.error('Erreur lors de l\'analyse des signaux avancés:', error.message);
    }

    return signals;
  }

  // Calculer le score global
  calculateOverallScore(signals) {
    if (!signals || signals.length === 0) return 50;

    let totalScore = 0;
    let totalWeight = 0;

    signals.forEach(signal => {
      const weight = signal.strength / 100;
      
      if (signal.type === 'BUY') {
        totalScore += signal.strength * weight;
      } else if (signal.type === 'SELL') {
        totalScore -= signal.strength * weight;
      }
      
      totalWeight += weight;
    });

    if (totalWeight === 0) return 50;
    
    // Normaliser entre 0 et 100
    const normalizedScore = (totalScore / totalWeight + 100) / 2;
    return Math.max(0, Math.min(100, Math.round(normalizedScore)));
  }

  // Obtenir la force du signal
  getSignalStrength(score) {
    if (score >= 80) return 'TRÈS FORT';
    if (score >= 65) return 'FORT';
    if (score >= 50) return 'MODÉRÉ';
    if (score >= 35) return 'FAIBLE';
    return 'TRÈS FAIBLE';
  }

  // Obtenir la recommandation
  getRecommendation(score, signals) {
    const buySignals = signals.filter(s => s.type === 'BUY').length;
    const sellSignals = signals.filter(s => s.type === 'SELL').length;
    
    if (score >= 70 && buySignals > sellSignals) {
      return 'ACHAT FORT';
    } else if (score >= 55 && buySignals > sellSignals) {
      return 'ACHAT';
    } else if (score <= 30 && sellSignals > buySignals) {
      return 'VENTE FORTE';
    } else if (score <= 45 && sellSignals > buySignals) {
      return 'VENTE';
    } else {
      return 'NEUTRE';
    }
  }

  // Utilitaires
  getCurrentValue(array) {
    if (!array || array.length === 0) return null;
    return array[array.length - 1];
  }

  getPreviousValue(array, periodsBack = 1) {
    if (!array || array.length < periodsBack + 1) return null;
    return array[array.length - periodsBack - 1];
  }
}

module.exports = SignalEngine;