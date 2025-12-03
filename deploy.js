const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Déploiement de Signaux Auto Dashboard');
console.log('======================================');

// Vérifier si les dépendances sont installées
if (!fs.existsSync('node_modules')) {
    console.log('📦 Installation des dépendances...');
    try {
        execSync('npm install', { stdio: 'inherit' });
    } catch (error) {
        console.error('❌ Erreur lors de l\'installation des dépendances');
        process.exit(1);
    }
}

// Construire l'application Next.js
console.log('🔨 Construction de l\'application...');
try {
    execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
    console.error('❌ Erreur lors de la construction de l\'application');
    process.exit(1);
}

// Créer le dossier de sortie pour le déploiement
const outputDir = path.join(__dirname, 'dist');
if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true, force: true });
}
fs.mkdirSync(outputDir, { recursive: true });

// Copier les fichiers nécessaires
console.log('📁 Préparation des fichiers de déploiement...');

// Copier le fichier package.json
fs.copyFileSync('package.json', path.join(outputDir, 'package.json'));

// Copier le serveur
fs.copyFileSync('server.js', path.join(outputDir, 'server.js'));

// Copier les services
fs.cpSync('services', path.join(outputDir, 'services'), { recursive: true });

// Copier le dossier .next
fs.cpSync('.next', path.join(outputDir, '.next'), { recursive: true });

// Copier le dossier public
if (fs.existsSync('public')) {
    fs.cpSync('public', path.join(outputDir, 'public'), { recursive: true });
}

// Créer un script de démarrage pour la production
const startScript = `#!/bin/bash
npm install --production
npm run start:prod
`;
fs.writeFileSync(path.join(outputDir, 'start-prod.sh'), startScript);
fs.chmodSync(path.join(outputDir, 'start-prod.sh'), '755');

console.log('✅ Application préparée pour le déploiement dans le dossier /dist');
console.log('');
console.log('📋 Prochaines étapes:');
console.log('1. Transférez le dossier /dist sur votre serveur');
console.log('2. Exécutez ./start-prod.sh pour démarrer l\'application');
console.log('3. L\'application sera accessible sur le port configuré');
console.log('');
console.log('🎉 Déploiement terminé!');