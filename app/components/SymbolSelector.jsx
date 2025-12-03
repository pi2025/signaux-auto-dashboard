'use client';

import { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';

export default function SymbolSelector({ symbols, selectedSymbol, onSymbolChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSymbols = symbols.filter(symbol => 
    symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (symbol) => {
    onSymbolChange(symbol);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-48 px-4 py-2 bg-white border border-sage-300 rounded-lg shadow-sm hover:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
      >
        <span className="font-medium text-charcoal-900">{selectedSymbol}</span>
        <ChevronDown className={`h-5 w-5 text-charcoal-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-64 bg-white rounded-lg shadow-lg border border-sage-200">
          <div className="p-4 border-b border-sage-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-charcoal-400" />
              <input
                type="text"
                placeholder="Rechercher un symbole..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {filteredSymbols.map((symbol) => (
              <button
                key={symbol}
                onClick={() => handleSelect(symbol)}
                className={`w-full px-4 py-2 text-left hover:bg-sage-50 transition-colors ${
                  selectedSymbol === symbol ? 'bg-sage-100 text-sage-700 font-medium' : 'text-charcoal-700'
                }`}
              >
                {symbol}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}