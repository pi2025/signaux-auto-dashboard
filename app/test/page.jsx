'use client';

import { useState, useEffect } from 'react';
import { Activity, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function TestPage() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runTests();
  }, []);

  const runTests = async () => {
    const testResults = [];

    // Test 1: Vérifier la connexion au backend
    testResults.push({
      name: 'Connexion Backend API',
      status: 'running',
      description: 'Vérification de la connexion au serveur Express'
    });

    try {
      const healthResponse = await fetch('/api/health');
      if (healthResponse.ok) {
        testResults[0].status = 'passed';
        testResults[0].details = 'API fonctionnelle';
      } else {
        testResults[0].status = 'failed';
        testResults[0].details = 'API non accessible';
      }
    } catch (error) {
      testResults[0].status = 'failed';
      testResults[0].details = error.message;
    }

    // Test 2: Récupération des symboles
    testResults.push({
      name: 'Récupération des Symboles',
      status: 'running',
      description: 'Test de récupération de la liste des symboles'
    });

    try {
      const symbolsResponse = await fetch('/api/symbols');
      if (symbolsResponse.ok) {
        const data = await symbolsResponse.json();
        testResults[1].status = 'passed';
        testResults[1].details = `${Object.keys(data).length} catégories trouvées`;
      } else {
        testResults[1].status = 'failed';
        testResults[1].details = 'Impossible de récupérer les symboles';
      }
    } catch (error) {
      testResults[1].status = 'failed';
      testResults[1].details = error.message;
    }

    // Test 3: Données historiques AAPL
    testResults.push({
      name: 'Données Historiques AAPL',
      status: 'running',
      description: 'Test de récupération des données historiques'
    });

    try {
      const historicalResponse = await fetch('/api/historical/AAPL');
      if (historicalResponse.ok) {
        const data = await historicalResponse.json();
        testResults[2].status = 'passed';
        testResults[2].details = `${data.length} points de données`;
      } else {
        testResults[2].status = 'failed';
        testResults[2].details = 'Impossible de récupérer les données historiques';
      }
    } catch (error) {
      testResults[2].status = 'failed';
      testResults[2].details = error.message;
    }

    // Test 4: Indicateurs techniques
    testResults.push({
      name: 'Calcul des Indicateurs',
      status: 'running',
      description: 'Test du calcul des indicateurs techniques'
    });

    try {
      const indicatorsResponse = await fetch('/api/indicators/AAPL');
      if (indicatorsResponse.ok) {
        const data = await indicatorsResponse.json();
        const indicatorCount = Object.keys(data.indicators || {}).length;
        testResults[3].status = indicatorCount > 0 ? 'passed' : 'failed';
        testResults[3].details = `${indicatorCount} indicateurs calculés`;
      } else {
        testResults[3].status = 'failed';
        testResults[3].details = 'Impossible de calculer les indicateurs';
      }
    } catch (error) {
      testResults[3].status = 'failed';
      testResults[3].details = error.message;
    }

    // Test 5: Génération de signaux
    testResults.push({
      name: 'Génération de Signaux',
      status: 'running',
      description: 'Test de génération des signaux de trading'
    });

    try {
      const signalsResponse = await fetch('/api/signals/AAPL');
      if (signalsResponse.ok) {
        const data = await signalsResponse.json();
        testResults[4].status = 'passed';
        testResults[4].details = `Score: ${data.overallScore}%, ${data.signals?.length || 0} signaux`;
      } else {
        testResults[4].status = 'failed';
        testResults[4].details = 'Impossible de générer les signaux';
      }
    } catch (error) {
      testResults[4].status = 'failed';
      testResults[4].details = error.message;
    }

    setTests(testResults);
    setLoading(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'running':
        return <Activity className="h-5 w-5 text-blue-500 animate-pulse" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'passed':
        return 'border-green-200 bg-green-50';
      case 'failed':
        return 'border-red-200 bg-red-50';
      case 'running':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-yellow-200 bg-yellow-50';
    }
  };

  const passedTests = tests.filter(t => t.status === 'passed').length;
  const totalTests = tests.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sage-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-charcoal-900 mb-4">
            Tests de l'Application
          </h1>
          <p className="text-xl text-charcoal-600">
            Vérification du bon fonctionnement de tous les composants
          </p>
        </div>

        {/* Résumé des tests */}
        {!loading && (
          <div className="bg-white rounded-xl shadow-sm border border-sage-200 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-charcoal-900">
                  Résultats des Tests
                </h2>
                <p className="text-charcoal-600">
                  {passedTests} / {totalTests} tests réussis
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-sage-600">
                  {totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0}%
                </div>
                <p className="text-sm text-charcoal-600">Taux de réussite</p>
              </div>
            </div>
            
            {/* Barre de progression */}
            <div className="mt-4">
              <div className="w-full bg-sage-200 rounded-full h-3">
                <div 
                  className="h-3 bg-sage-600 rounded-full transition-all duration-500"
                  style={{ width: `${totalTests > 0 ? (passedTests / totalTests) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Liste des tests */}
        <div className="space-y-4">
          {tests.map((test, index) => (
            <div 
              key={index} 
              className={`rounded-xl border p-6 transition-all duration-300 ${getStatusColor(test.status)}`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {getStatusIcon(test.status)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-charcoal-900 mb-2">
                    {test.name}
                  </h3>
                  <p className="text-charcoal-600 mb-2">
                    {test.description}
                  </p>
                  {test.details && (
                    <p className="text-sm text-charcoal-700 bg-white/50 rounded-lg p-2">
                      <strong>Détails:</strong> {test.details}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className={`text-sm font-medium ${
                    test.status === 'passed' ? 'text-green-700' :
                    test.status === 'failed' ? 'text-red-700' :
                    'text-blue-700'
                  }`}>
                    {test.status === 'passed' ? 'Réussi' :
                     test.status === 'failed' ? 'Échoué' :
                     'En cours'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="text-center py-12">
            <Activity className="h-12 w-12 text-sage-600 animate-spin mx-auto mb-4" />
            <p className="text-lg text-charcoal-600">
              Exécution des tests en cours...
            </p>
          </div>
        )}

        {/* Actions */}
        {!loading && (
          <div className="mt-8 text-center">
            <button
              onClick={runTests}
              className="gradient-button px-6 py-3"
            >
              Relancer les Tests
            </button>
          </div>
        )}
      </div>
    </div>
  );
}