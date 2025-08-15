/**
 * @file FooterExpandibleSections.tsx
 * @max-lines 250
 * @module Footer
 * @created 2025-01-15
 */

import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FooterExpandibleSectionsProps {
  localConfig: any;
  expandedSections: any;
  toggleSection: (section: string) => void;
  handleChange: (field: string, value: any) => void;
  handleNestedChange: (parent: string, field: string, value: any) => void;
}

export default function FooterExpandibleSections({
  localConfig,
  expandedSections,
  toggleSection,
  handleChange,
  handleNestedChange
}: FooterExpandibleSectionsProps) {
  return (
    <>
      {/* Copyright notice - Expandible */}
      <div>
        <button
          onClick={() => toggleSection('copyrightNotice')}
          className="w-full flex items-center justify-between text-left"
        >
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Copyright notice
          </span>
          {expandedSections.copyrightNotice ? 
            <ChevronUp className="w-3 h-3 text-gray-500" /> : 
            <ChevronDown className="w-3 h-3 text-gray-500" />
          }
        </button>
        {expandedSections.copyrightNotice && (
          <input
            type="text"
            className="mt-2 w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-1 focus:ring-blue-500 
                       dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            value={localConfig.copyrightNotice}
            onChange={(e) => handleChange('copyrightNotice', e.target.value)}
            placeholder="© 2024 Your Company"
          />
        )}
      </div>

      {/* Follow on shop - Expandible */}
      <div>
        <button
          onClick={() => toggleSection('followOnShop')}
          className="w-full flex items-center justify-between text-left"
        >
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Follow on shop
          </span>
          {expandedSections.followOnShop ? 
            <ChevronUp className="w-3 h-3 text-gray-500" /> : 
            <ChevronDown className="w-3 h-3 text-gray-500" />
          }
        </button>
        {expandedSections.followOnShop && (
          <div className="mt-2 space-y-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Allow customers to follow your store on the Shop app
            </p>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Enable 'Follow on Shop'
              </label>
              <button
                onClick={() => handleNestedChange('followOnShop', 'enabled', !localConfig.followOnShop?.enabled)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  localConfig.followOnShop?.enabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  localConfig.followOnShop?.enabled ? 'translate-x-5' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Language selector - Expandible */}
      <div>
        <button
          onClick={() => toggleSection('languageSelector')}
          className="w-full flex items-center justify-between text-left"
        >
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Language selector
          </span>
          {expandedSections.languageSelector ? 
            <ChevronUp className="w-3 h-3 text-gray-500" /> : 
            <ChevronDown className="w-3 h-3 text-gray-500" />
          }
        </button>
        {expandedSections.languageSelector && (
          <div className="mt-2 space-y-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              To add a language, go to your{' '}
              <a href="#" className="text-blue-500 hover:underline">markets settings</a>
            </p>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Show language selector
              </label>
              <button
                onClick={() => handleNestedChange('languageSelector', 'showSelector', !localConfig.languageSelector?.showSelector)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  localConfig.languageSelector?.showSelector ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  localConfig.languageSelector?.showSelector ? 'translate-x-5' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Currency selector - Expandible */}
      <div>
        <button
          onClick={() => toggleSection('currencySelector')}
          className="w-full flex items-center justify-between text-left"
        >
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Currency selector
          </span>
          {expandedSections.currencySelector ? 
            <ChevronUp className="w-3 h-3 text-gray-500" /> : 
            <ChevronDown className="w-3 h-3 text-gray-500" />
          }
        </button>
        {expandedSections.currencySelector && (
          <div className="mt-2 space-y-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              To add a currency, go to your{' '}
              <a href="#" className="text-blue-500 hover:underline">markets settings</a>
            </p>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Show currency selector
              </label>
              <button
                onClick={() => handleNestedChange('currencySelector', 'showSelector', !localConfig.currencySelector?.showSelector)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  localConfig.currencySelector?.showSelector ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  localConfig.currencySelector?.showSelector ? 'translate-x-5' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Policy links - Expandible */}
      <div>
        <button
          onClick={() => toggleSection('policyLinks')}
          className="w-full flex items-center justify-between text-left"
        >
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Policy links
          </span>
          {expandedSections.policyLinks ? 
            <ChevronUp className="w-3 h-3 text-gray-500" /> : 
            <ChevronDown className="w-3 h-3 text-gray-500" />
          }
        </button>
        {expandedSections.policyLinks && (
          <div className="mt-2 space-y-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              To add store policies, go to your{' '}
              <a href="#" className="text-blue-500 hover:underline">policy settings</a>
            </p>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Show policy links
              </label>
              <button
                onClick={() => handleNestedChange('policyLinks', 'showLinks', !localConfig.policyLinks?.showLinks)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  localConfig.policyLinks?.showLinks ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  localConfig.policyLinks?.showLinks ? 'translate-x-5' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}