import Link from 'next/link';
import { Activity, TrendingUp, BarChart3, Zap, Shield, Database } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sage-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sage-600/10 to-charcoal-600/10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-3 bg-white rounded-full px-6 py-3 shadow-lg">
                <Activity className="h-8 w-8 text-sage-600" />
                <span className="text-2xl font-bold text-charcoal-900">Signaux Auto</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-charcoal-900 mb-6">
              Système d'Analyse
              <span className="block text-gradient">Technique Avancée</span>
            </h1>
            
            <p className="text-xl text-charcoal-600 max-w-3xl mx-auto mb-8">
              Générez des signaux de trading basés sur plus de 50 indicateurs techniques. 
              Analyse multi-timeframe avec scoring intelligent et visualisations interactives.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/dashboard/signaux-auto"
                className="gradient-button text-lg px-8 py-3"
              >
                Démarrer l'Analyse
              </Link>
              <Link 
                href="#features"
                className="px-8 py-3 text-lg font-medium text-charcoal-700 bg-white border border-sage-300 rounded-lg hover:bg-sage-50 transition-colors"
              >
                En savoir plus
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-charcoal-900 mb-4">
              Fonctionnalités Principales
            </h2>
            <p className="text-xl text-charcoal-600 max-w-3xl mx-auto">
              Un système complet d'analyse technique avec des données en temps réel 
              et des algorithmes avancés pour des signaux précis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-soft p-8 border border-sage-200 hover:shadow-medium transition-shadow">
              <div className="flex items-center justify-center w-16 h-16 bg-signal-buy/10 rounded-xl mb-6">
                <Zap className="h-8 w-8 text-signal-buy" />
              </div>
              <h3 className="text-xl font-semibold text-charcoal-900 mb-4">
                50+ Indicateurs Techniques
              </h3>
              <p className="text-charcoal-600">
                Analyse complète avec RSI, MACD, Bollinger Bands, Ichimoku, 
                et de nombreux autres indicateurs professionnels.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-soft p-8 border border-sage-200 hover:shadow-medium transition-shadow">
              <div className="flex items-center justify-center w-16 h-16 bg-signal-sell/10 rounded-xl mb-6">
                <BarChart3 className="h-8 w-8 text-signal-sell" />
              </div>
              <h3 className="text-xl font-semibold text-charcoal-900 mb-4">
                Signaux Intelligents
              </h3>
              <p className="text-charcoal-600">
                Génération automatique de signaux avec scoring de confiance 
                et analyse contextuelle avancée.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-soft p-8 border border-sage-200 hover:shadow-medium transition-shadow">
              <div className="flex items-center justify-center w-16 h-16 bg-signal-neutral/10 rounded-xl mb-6">
                <TrendingUp className="h-8 w-8 text-signal-neutral" />
              </div>
              <h3 className="text-xl font-semibold text-charcoal-900 mb-4">
                Données en Temps Réel
              </h3>
              <p className="text-charcoal-600">
                Connexion aux marchés financiers avec Yahoo Finance pour 
                des données précises et à jour.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl shadow-soft p-8 border border-sage-200 hover:shadow-medium transition-shadow">
              <div className="flex items-center justify-center w-16 h-16 bg-sage-100 rounded-xl mb-6">
                <Shield className="h-8 w-8 text-sage-600" />
              </div>
              <h3 className="text-xl font-semibold text-charcoal-900 mb-4">
                Analyse Multi-Timeframe
              </h3>
              <p className="text-charcoal-600">
                Analyse sur différentes périodes (M15, H1, H4, D1) 
                pour une vue d'ensemble complète.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-xl shadow-soft p-8 border border-sage-200 hover:shadow-medium transition-shadow">
              <div className="flex items-center justify-center w-16 h-16 bg-charcoal-100 rounded-xl mb-6">
                <Activity className="h-8 w-8 text-charcoal-600" />
              </div>
              <h3 className="text-xl font-semibold text-charcoal-900 mb-4">
                Dashboard Interactif
              </h3>
              <p className="text-charcoal-600">
                Interface moderne avec visualisations graphiques 
                et filtres avancés pour une analyse intuitive.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-xl shadow-soft p-8 border border-sage-200 hover:shadow-medium transition-shadow">
              <div className="flex items-center justify-center w-16 h-16 bg-slate-100 rounded-xl mb-6">
                <Database className="h-8 w-8 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-charcoal-900 mb-4">
                Base de Données Complète
              </h3>
              <p className="text-charcoal-600">
                Historique des signaux et performance pour 
                l'analyse rétrospective et l'amélioration.
              </p>
            </div>
          </div>
        </div>
      </section>

      /* CTA Section */
      <section className="py-20 bg-gradient-to-r from-sage-600 to-charcoal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Prêt à Commencer ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Rejoignez les traders qui utilisent déjà Signaux Auto pour 
            améliorer leurs décisions d'investissement.
          </p>
          <Link 
            href="/dashboard/signaux-auto"
            className="inline-flex items-center px-8 py-4 text-lg font-medium text-sage-700 bg-white rounded-lg hover:bg-sage-50 transition-colors shadow-lg"
          >
            Accéder au Dashboard
            <Activity className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-charcoal-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Activity className="h-6 w-6 text-sage-400" />
              <span className="text-xl font-bold">Signaux Auto</span>
            </div>
            <p className="text-charcoal-400 mb-4">
              Système d'analyse technique avancée pour le trading moderne
            </p>
            <p className="text-sm text-charcoal-500">
              © 2024 Signaux Auto. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}