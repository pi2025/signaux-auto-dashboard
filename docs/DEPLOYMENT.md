# Guide de Déploiement - Signaux Auto Dashboard

## 🚀 Options de Déploiement

### 1. Déploiement Local (Développement)

```bash
# Méthode simple avec le script de démarrage
./start.sh

# Ou manuellement dans deux terminaux différents
# Terminal 1: Backend
npm run server

# Terminal 2: Frontend  
npm run dev
```

### 2. Déploiement Production

```bash
# Construire et préparer l'application
npm run deploy

# Les fichiers seront dans le dossier /dist
# Transférez-les sur votre serveur et exécutez:
cd /dist && ./start-prod.sh
```

### 3. Déploiement avec Docker (Recommandé)

Créez un `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le reste des fichiers
COPY . .

# Construire l'application
RUN npm run build

# Exposer les ports
EXPOSE 3000 3001

# Démarrer l'application
CMD ["npm", "run", "start:prod"]
```

Et un `docker-compose.yml`:

```yaml
version: '3.8'

services:
  signaux-auto:
    build: .
    ports:
      - "3000:3000"  # Frontend
      - "3001:3001"  # Backend API
    environment:
      - NODE_ENV=production
      - PORT=3001
    restart: unless-stopped
    volumes:
      - ./logs:/app/logs
```

## ☁️ Déploiement Cloud

### Vercel (Frontend uniquement)

1. Connectez votre repository GitHub
2. Configurez les variables d'environnement:
   ```
   API_URL=https://votre-api-backend.com
   ```
3. Déployez

### Railway (Backend + Frontend)

```bash
# Installer Railway CLI
npm install -g @railway/cli

# Connecter et déployer
railway login
railway init
railway up
```

### Heroku

```bash
# Installer Heroku CLI
# Créer l'application
heroku create signaux-auto-dashboard

# Configurer les variables
echo "web: npm run start:prod" > Procfile

# Déployer
git add .
git commit -m "Prêt pour Heroku"
git push heroku main
```

### AWS EC2

```bash
# Sur votre serveur EC2
sudo apt update
sudo apt install nodejs npm nginx -y

# Cloner le projet
git clone https://github.com/votre-repo/signaux-auto-dashboard.git
cd signaux-auto-dashboard

# Installer et démarrer
npm install
npm run deploy

# Configurer Nginx comme reverse proxy
sudo nano /etc/nginx/sites-available/signaux-auto
```

Configuration Nginx:
```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🔧 Configuration Production

### Variables d'Environnement

Créez un fichier `.env.production`:

```bash
# Application
NODE_ENV=production
PORT=3001
API_URL=https://votre-domaine.com

# Sécurité
JWT_SECRET=votre-secret-jwt-complexe
CORS_ORIGIN=https://votre-domaine.com

# Performance
CACHE_TTL=300
ENABLE_COMPRESSION=true

# Monitoring
ENABLE_LOGGING=true
LOG_LEVEL=info
```

### Optimisations Performance

1. **Compression**:
```javascript
// Dans server.js
const compression = require('compression');
app.use(compression());
```

2. **Cache Headers**:
```javascript
// Cache pour les assets statiques
app.use(express.static('public', {
  maxAge: '1d',
  etag: false
}));
```

3. **Rate Limiting**:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limite chaque IP à 100 requêtes par windowMs
});

app.use('/api/', limiter);
```

## 🔒 Sécurité en Production

### 1. HTTPS/TLS

```bash
# Utiliser Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d votre-domaine.com
```

### 2. Headers de Sécurité

```javascript
const helmet = require('helmet');
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
```

### 3. Validation des Entrées

```javascript
const Joi = require('joi');

const symbolSchema = Joi.string().regex(/^[A-Z0-9-=$.]+$/).max(20);

app.get('/api/signals/:symbol', (req, res) => {
  const { error } = symbolSchema.validate(req.params.symbol);
  if (error) {
    return res.status(400).json({ error: 'Symbole invalide' });
  }
  // ... reste du code
});
```

## 📊 Monitoring

### 1. Logs

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});
```

### 2. Health Checks

```javascript
app.get('/health/detailed', (req, res) => {
  const health = {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    services: {
      api: 'OK',
      database: 'OK',
      externalAPIs: 'OK'
    }
  };
  res.json(health);
});
```

### 3. Métriques

```javascript
const promClient = require('prom-client');
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics();

app.get('/metrics', (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(promClient.register.metrics());
});
```

## 🔄 Mises à Jour Continue (CI/CD)

### GitHub Actions

Créez `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build application
      run: npm run build
    
    - name: Deploy to production
      run: |
        # Votre script de déploiement
        ssh user@votre-server 'cd /app && git pull && npm install && pm2 restart all'
      env:
        SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
```

## 🚨 Dépannage

### Problèmes Courants

1. **Port déjà utilisé**:
```bash
# Trouver et tuer le processus
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

2. **Erreurs de dépendances**:
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

3. **Erreur de build Next.js**:
```bash
# Vérifier les imports et la syntaxe
npm run build 2>&1 | grep ERROR
```

4. **API non accessible**:
```bash
# Vérifier que le serveur tourne
curl http://localhost:3001/api/health

# Vérifier les logs
tail -f logs/combined.log
```

### Performance

1. **Monitoring avec PM2**:
```bash
# Installer PM2
npm install -g pm2

# Démarrer avec PM2
pm2 start server.js --name "signaux-backend"
pm2 start npm --name "signaux-frontend" -- start

# Monitoring
pm2 monit
```

2. **Optimisation mémoire**:
```javascript
// Dans server.js
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  // Votre application
}
```

## 📞 Support et Maintenance

### Backup

```bash
# Backup de la configuration
tar -czf backup-$(date +%Y%m%d).tar.gz \
  package.json \
  .env.production \
  ecosystem.config.js \
  logs/
```

### Rollback

```bash
# En cas de problème
pm2 stop all
git checkout <previous-commit>
npm install
npm run build
pm2 start all
```

---

**Pour toute question ou problème, consultez la documentation ou ouvrez une issue.**