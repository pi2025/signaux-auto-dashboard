# Signaux Auto - Système d'Analyse Technique

Un système complet de génération et d'analyse de signaux de trading basé sur plus de 50 indicateurs techniques avec dashboard interactif.

## 🚀 Fonctionnalités

### Moteur de Signaux
- **50+ Indicateurs Techniques** couvrant tous les aspects de l'analyse technique
- **Analyse Multi-Timeframe** (M15, H1, H4, D1)
- **Système de Scoring** avec confiance de 0-100%
- **Génération Automatique** des signaux basée sur des règles avancées
- **Données Réelles** via Yahoo Finance API

### Dashboard Interactif
- **Interface Moderne** avec design professionnel
- **Tableau de Signaux** avec filtres avancés
- **Vue Détaillée** de chaque signal avec indicateurs
- **Visualisations Graphiques** pour l'analyse technique
- **Mises à Jour en Temps Réel**

### Architecture
- **Backend Node.js/Express** avec API REST
- **Frontend Next.js/React** avec Tailwind CSS
- **Base de Données** en mémoire avec cache intelligent
- **WebSocket** pour les mises à jour en temps réel
- **Authentification** prête pour JWT

## 📊 Indicateurs Techniques Supportés

### Tendance (15 indicateurs)
- Moyennes Mobiles Simples (SMA 5, 10, 20, 50, 100, 200)
- Moyennes Mobiles Exponentielles (EMA 5, 10, 20, 50, 100, 200)
- Moyenne Mobile Pondérée (WMA 20)
- MACD (12,26,9)
- ADX (14)

### Momentum/Oscillateurs (15 indicateurs)
- RSI (14, 21, 50)
- Stochastique (%K, %D)
- StochRSI (%K, %D)
- CCI (20)
- Williams %R (14)
- Momentum (10)
- ROC (10)
- Awesome Oscillator (5,34)
- TRIX (15)
- Ultimate Oscillator (7,14,28)

### Volatilité (8 indicateurs)
- Bollinger Bands (Upper, Middle, Lower, Width)
- ATR (14)
- Keltner Channels (Upper, Lower)
- Standard Deviation (20)

### Volume (8 indicateurs)
- OBV
- Chaikin Money Flow (20)
- Money Flow Index (14)
- Volume Oscillator (12,26)
- Accumulation/Distribution Line
- Chaikin A/D Oscillator (3,10)

### Support/Résistance (6 indicateurs)
- Pivot Points (R1, S1, Pivot)
- Fibonacci Retracements (38.2%, 61.8%)
- Fractals

### Autres (8 indicateurs)
- Aroon (Up, Down, Oscillator)
- Parabolic SAR
- SuperTrend (10,3.0)
- Ichimoku (Tenkan, Kijun, Chikou)

## 🛠️ Installation

### Prérequis
- Node.js 18+
- npm ou yarn
- Accès Internet pour les données de marché

### Installation Rapide

1. **Cloner le repository**
```bash
git clone <repository-url>
cd signaux-auto-dashboard
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Démarrer l'application**
```bash
# Démarrer le serveur backend
npm run server

# Dans un autre terminal, démarrer le frontend Next.js
npm run dev
```

4. **Accéder à l'application**
- Frontend: http://localhost:3000
- API Backend: http://localhost:3001
- Health Check: http://localhost:3001/api/health

### Scripts Disponibles

```bash
npm run dev          # Démarrer Next.js en mode développement
npm run build        # Construire l'application pour la production
npm run start        # Démarrer Next.js en production
npm run server       # Démarrer le serveur Express
npm run dev:full     # Démarrer backend et frontend simultanément
```

## 📡 API Endpoints

### Endpoints Principaux

- `GET /api/health` - Vérifier l'état du serveur
- `GET /api/symbols` - Obtenir la liste des symboles disponibles
- `GET /api/symbol-info/:symbol` - Informations sur un symbole
- `GET /api/historical/:symbol` - Données historiques
- `GET /api/indicators/:symbol` - Calculer les indicateurs techniques
- `GET /api/signals/:symbol` - Générer les signaux de trading
- `GET /api/full-analysis/:symbol` - Analyse complète (tout en un)

### Exemple d'utilisation

```javascript
// Obtenir les signaux pour AAPL
fetch('/api/signals/AAPL')
  .then(response => response.json())
  .then(data => {
    console.log('Signaux:', data);
  });

// Analyse complète
fetch('/api/full-analysis/MSFT')
  .then(response => response.json())
  .then(data => {
    console.log('Analyse complète:', data);
  });
```

## 🎯 Utilisation

### Dashboard Web
1. Accédez à http://localhost:3000
2. Sélectionnez un symbole boursier dans la liste déroulante
3. Consultez les signaux générés et l'analyse technique
4. Utilisez les filtres pour affiner l'analyse

### Symboles Supportés
- **Actions**: AAPL, MSFT, GOOGL, AMZN, TSLA, META, NVDA, etc.
- **ETFs**: SPY, QQQ, IWM, VTI, etc.
- **Forex**: EURUSD, GBPUSD, USDJPY, etc.
- **Matières Premières**: GC=F, CL=F, etc.
- **Crypto**: BTC-USD, ETH-USD, etc.

## 🔧 Configuration

### Variables d'Environnement
Créez un fichier `.env` à la racine du projet:

```env
PORT=3001
NODE_ENV=development
API_URL=http://localhost:3001
```

### Personnalisation
- Modifiez les paramètres des indicateurs dans `/services/indicator-engine/indicatorEngine.js`
- Ajustez les règles de génération de signaux dans `/services/signal-engine/signalEngine.js`
- Personnalisez l'interface dans `/app/components/`

## 📈 Performance

### Optimisations Implémentées
- **Cache intelligent** pour les données de marché (5 minutes)
- **Calculs incrémentaux** pour éviter de tout recalculer
- **Cache des indicateurs** (10 minutes)
- **Lazy loading** des composants React
- **Optimisations Webpack** avec Next.js

### Scalabilité
- Architecture modulaire pour facile extension
- Support pour base de données PostgreSQL
- Prêt pour déploiement cloud (Docker supporté)

## 🚨 Sécurité

### Mesures de Sécurité
- Validation des entrées côté backend
- CORS configuré
- Protection contre les requêtes excessives
- Pas de stockage de données sensibles

## 📝 Documentation Technique

### Architecture
```
/mnt/okcomputer/output/
├── app/                    # Frontend Next.js
│   ├── dashboard/
│   │   └── signaux-auto/  # Page principale
│   ├── components/         # Composants React
│   └── api/               # API routes
├── services/              # Services backend
│   ├── market-data-service/
│   ├── indicator-engine/
│   └── signal-engine/
├── public/                # Assets statiques
└── docs/                  # Documentation
```

### Flux de Données
1. Récupération des données OHLCV depuis Yahoo Finance
2. Calcul des 50+ indicateurs techniques
3. Analyse et génération de signaux
4. Scoring et validation
5. Exposition via API REST
6. Affichage dans le dashboard React

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez:
1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commit vos changements
4. Push vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## ⚠️ Avertissement

**IMPORTANT**: Ce système est à des fins éducatives et d'analyse uniquement. 
- Ne constitue pas un conseil financier
- Les signaux générés ne garantissent pas des performances futures
- Faites toujours vos propres recherches avant d'investir
- Le trading comporte des risques de perte

## 📞 Support

Pour toute question ou problème:
- Ouvrez une issue sur GitHub
- Consultez la documentation dans `/docs`
- Vérifiez les logs du serveur pour les erreurs

---

**Développé avec ❤️ pour la communauté de trading**