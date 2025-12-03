#!/bin/bash

# Script de démarrage pour Signaux Auto Dashboard

echo "🚀 Démarrage de Signaux Auto Dashboard"
echo "======================================"

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js 18+"
    exit 1
fi

# Vérifier la version de Node.js
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version $NODE_VERSION détectée. Version 18+ requise."
    exit 1
fi

# Vérifier si les dépendances sont installées
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Erreur lors de l'installation des dépendances"
        exit 1
    fi
fi

# Démarrer le serveur backend
echo "🔧 Démarrage du serveur backend..."
npm run server &
BACKEND_PID=$!

# Attendre que le serveur backend démarre
sleep 3

# Vérifier si le serveur backend a démarré correctement
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "❌ Erreur lors du démarrage du serveur backend"
    exit 1
fi

echo "✅ Serveur backend démarré (PID: $BACKEND_PID)"

# Démarrer le frontend Next.js
echo "🎨 Démarrage du frontend Next.js..."
npm run dev &
FRONTEND_PID=$!

# Attendre que le frontend démarre
sleep 3

# Vérifier si le frontend a démarré correctement
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo "❌ Erreur lors du démarrage du frontend"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo "✅ Frontend Next.js démarré (PID: $FRONTEND_PID)"

echo ""
echo "🎉 Application démarrée avec succès!"
echo "==================================="
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:3001"
echo "Health Check: http://localhost:3001/api/health"
echo ""
echo "📊 Symboles disponibles par défaut:"
echo "- Actions: AAPL, MSFT, GOOGL, AMZN, TSLA, META, NVDA, NFLX"
echo "- ETFs: SPY, QQQ, IWM, VTI"
echo "- Forex: EURUSD, GBPUSD, USDJPY"
echo "- Crypto: BTC-USD, ETH-USD"
echo ""
echo "🔄 Pour arrêter l'application, appuyez sur Ctrl+C"

# Fonction pour arrêter proprement les processus
cleanup() {
    echo ""
    echo "🛑 Arrêt de l'application..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    wait $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo "✅ Application arrêtée"
    exit 0
}

# Capturer les signaux d'arrêt
trap cleanup SIGINT SIGTERM

# Attendre indéfiniment
while true; do
    sleep 1
done