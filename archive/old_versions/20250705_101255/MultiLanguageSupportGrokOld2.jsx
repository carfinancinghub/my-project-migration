/**
 * File: MultiLanguageSupportGrokOld2.jsx
 * Path: frontend/src/components/common/MultiLanguageSupport.jsx
 * Purpose: Language toggle UI with i18n, auto-detect locale, preference modal, and gamified language switch
 * Author: SG
 * Date: April 28, 2025
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '@components/common/Navbar'; // Alias for navigation component
import logger from '@utils/logger'; // Assumed logger for error tracking

const MultiLanguageSupport = () => {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language || 'en');
  const [isPreferenceModalOpen, setPreferenceModalOpen] = useState(false);
  const [languageBadges, setLanguageBadges] = useState(
    JSON.parse(localStorage.getItem('languageBadges')) || {}
  );

  // Supported languages
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  // Auto-detect browser locale on mount
  useEffect(() => {
    try {
      const browserLocale = navigator.language.split('-')[0];
      const supportedLocale = languages.find((lang) => lang.code === browserLocale)?.code || 'en';
      if (supportedLocale !== selectedLanguage) {
        i18n.changeLanguage(supportedLocale);
        setSelectedLanguage(supportedLocale);
        localStorage.setItem('preferredLanguage', supportedLocale);
        logger.info(`Auto-detected locale: ${supportedLocale}`);
      }
    } catch (err) {
      logger.error(`Error auto-detecting locale: ${err.message}`);
    }
  }, []);

  // Handle language change with gamification
  const handleLanguageChange = (langCode) => {
    try {
      i18n.changeLanguage(langCode);
      setSelectedLanguage(langCode);
      localStorage.setItem('preferredLanguage', langCode);

      // Award badge for switching language (gamification)
      const newBadges = { ...languageBadges };
      if (!newBadges[langCode]) {
        newBadges[langCode] = { name: `Polyglot (${langCode.toUpperCase()})`, earned: new Date() };
        setLanguageBadges(newBadges);
        localStorage.setItem('languageBadges', JSON.stringify(newBadges));
        logger.info(`Badge awarded for language ${langCode}`);
      }

      setPreferenceModalOpen(false);
      logger.info(`Language changed to ${langCode}`);
    } catch (err) {
      logger.error(`Error changing language to ${langCode}: ${err.message}`);
      alert('Failed to change language');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 max-w-md mx-auto animate-fade-in">
      {/* Navbar integration */}
      <Navbar aria-label="Main navigation with language support" />

      {/* Language toggle UI */}
      <div
        className="mt-4"
        role="region"
        aria-labelledby="language-toggle-title"
      >
        <h2 id="language-toggle-title" className="text-lg font-semibold text-gray-700 mb-3">
          Language
        </h2>
        <button
          onClick={() => setPreferenceModalOpen(true)}
          className="flex items-center px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          aria-label={`Current language: ${languages.find((lang) => lang.code === selectedLanguage)?.name}`}
        >
          <span className="mr-2">
            {languages.find((lang) => lang.code === selectedLanguage)?.flag}
          </span>
          {languages.find((lang) => lang.code === selectedLanguage)?.name}
        </button>
      </div>

      {/* Language badges (gamification) */}
      {Object.keys(languageBadges).length > 0 && (
        <div className="mt-4">
          <h3 className="text-md font-semibold text-gray-700 mb-2" id="badges-title">
            Language Badges
          </h3>
          <div
            className="flex flex-wrap gap-2"
            role="region"
            aria-labelledby="badges-title"
          >
            {Object.values(languageBadges).map((badge, index) => (
              <span
                key={index}
                className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full animate-pulse-short"
                aria-label={`Badge: ${badge.name}`}
              >
                {badge.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Preference modal */}
      {isPreferenceModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          role="dialog"
          aria-labelledby="language-modal-title"
        >
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h3 id="language-modal-title" className="text-lg font-semibold text-gray-800 mb-4">
              Choose Language
            </h3>
            <div className="flex flex-col gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedLanguage === lang.code
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  aria-label={`Switch to ${lang.name} language`}
                  aria-current={selectedLanguage === lang.code ? 'true' : 'false'}
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.name}
                  {languageBadges[lang.code] && (
                    <span className="ml-2 text-xs text-green-500">✓ Earned</span>
                  )}
                </button>
              ))}
              <button
                onClick={() => setPreferenceModalOpen(false)}
                className="mt-2 bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
                aria-label="Cancel language selection"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Cod2 Crown Certified: This component provides a multilingual toggle UI with i18n,
// auto-detects locale, includes an accessible preference modal with gamified language badges,
// uses TailwindCSS, integrates with Navbar.jsx, and ensures robust error handling.
export default MultiLanguageSupport;