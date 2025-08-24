'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const countries = [
  // América del Norte
  { value: 'Estados Unidos', label: 'Estados Unidos', region: 'América del Norte' },
  { value: 'Canadá', label: 'Canadá', region: 'América del Norte' },
  { value: 'México', label: 'México', region: 'América del Norte' },
  
  // Centroamérica
  { value: 'Guatemala', label: 'Guatemala', region: 'Centroamérica' },
  { value: 'El Salvador', label: 'El Salvador', region: 'Centroamérica' },
  { value: 'Honduras', label: 'Honduras', region: 'Centroamérica' },
  { value: 'Nicaragua', label: 'Nicaragua', region: 'Centroamérica' },
  { value: 'Costa Rica', label: 'Costa Rica', region: 'Centroamérica' },
  { value: 'Panamá', label: 'Panamá', region: 'Centroamérica' },
  { value: 'Belice', label: 'Belice', region: 'Centroamérica' },
  
  // Caribe
  { value: 'Cuba', label: 'Cuba', region: 'Caribe' },
  { value: 'República Dominicana', label: 'República Dominicana', region: 'Caribe' },
  { value: 'Puerto Rico', label: 'Puerto Rico', region: 'Caribe' },
  { value: 'Jamaica', label: 'Jamaica', region: 'Caribe' },
  { value: 'Haití', label: 'Haití', region: 'Caribe' },
  { value: 'Trinidad y Tobago', label: 'Trinidad y Tobago', region: 'Caribe' },
  { value: 'Barbados', label: 'Barbados', region: 'Caribe' },
  
  // Sudamérica
  { value: 'Argentina', label: 'Argentina', region: 'Sudamérica' },
  { value: 'Bolivia', label: 'Bolivia', region: 'Sudamérica' },
  { value: 'Brasil', label: 'Brasil', region: 'Sudamérica' },
  { value: 'Chile', label: 'Chile', region: 'Sudamérica' },
  { value: 'Colombia', label: 'Colombia', region: 'Sudamérica' },
  { value: 'Ecuador', label: 'Ecuador', region: 'Sudamérica' },
  { value: 'Guyana', label: 'Guyana', region: 'Sudamérica' },
  { value: 'Paraguay', label: 'Paraguay', region: 'Sudamérica' },
  { value: 'Perú', label: 'Perú', region: 'Sudamérica' },
  { value: 'Surinam', label: 'Surinam', region: 'Sudamérica' },
  { value: 'Uruguay', label: 'Uruguay', region: 'Sudamérica' },
  { value: 'Venezuela', label: 'Venezuela', region: 'Sudamérica' },
  
  // Europa (principales)
  { value: 'España', label: 'España', region: 'Europa' },
  { value: 'Portugal', label: 'Portugal', region: 'Europa' },
  { value: 'Francia', label: 'Francia', region: 'Europa' },
  { value: 'Italia', label: 'Italia', region: 'Europa' },
  { value: 'Alemania', label: 'Alemania', region: 'Europa' },
  { value: 'Reino Unido', label: 'Reino Unido', region: 'Europa' },
  { value: 'Países Bajos', label: 'Países Bajos', region: 'Europa' },
  { value: 'Bélgica', label: 'Bélgica', region: 'Europa' },
  { value: 'Suiza', label: 'Suiza', region: 'Europa' },
  { value: 'Austria', label: 'Austria', region: 'Europa' },
  { value: 'Polonia', label: 'Polonia', region: 'Europa' },
  { value: 'Grecia', label: 'Grecia', region: 'Europa' },
  { value: 'Suecia', label: 'Suecia', region: 'Europa' },
  { value: 'Noruega', label: 'Noruega', region: 'Europa' },
  { value: 'Dinamarca', label: 'Dinamarca', region: 'Europa' },
  { value: 'Finlandia', label: 'Finlandia', region: 'Europa' },
  { value: 'Irlanda', label: 'Irlanda', region: 'Europa' },
];

export default function CountrySelect({ value, onChange, error }: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter countries based on search term
  const filteredCountries = countries.filter(country =>
    country.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group countries by region
  const groupedCountries = filteredCountries.reduce((acc, country) => {
    if (!acc[country.region]) {
      acc[country.region] = [];
    }
    acc[country.region].push(country);
    return acc;
  }, {} as Record<string, typeof countries>);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (countryValue: string) => {
    onChange(countryValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const selectedCountry = countries.find(c => c.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-opacity-50 flex items-center justify-between ${
          error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
        } ${isOpen ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {selectedCountry ? selectedCountry.label : 'Selecciona un país'}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar país o región..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>
          </div>

          {/* Countries list */}
          <div className="max-h-72 overflow-y-auto">
            {Object.keys(groupedCountries).length === 0 ? (
              <div className="px-3 py-4 text-center text-gray-500 text-sm">
                No se encontraron países
              </div>
            ) : (
              Object.entries(groupedCountries).map(([region, regionCountries]) => (
                <div key={region}>
                  <div className="px-3 py-2 bg-gray-50 text-xs font-semibold text-gray-600 sticky top-0">
                    {region}
                  </div>
                  {regionCountries.map((country) => (
                    <button
                      key={country.value}
                      type="button"
                      onClick={() => handleSelect(country.value)}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors ${
                        value === country.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {country.label}
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>

          {/* Quick selection for popular countries */}
          <div className="border-t border-gray-200 p-2 bg-gray-50">
            <div className="text-xs text-gray-500 mb-1">Selección rápida:</div>
            <div className="flex flex-wrap gap-1">
              {['El Salvador', 'Estados Unidos', 'México', 'España', 'Argentina'].map((quickCountry) => (
                <button
                  key={quickCountry}
                  type="button"
                  onClick={() => handleSelect(quickCountry)}
                  className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {quickCountry}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}