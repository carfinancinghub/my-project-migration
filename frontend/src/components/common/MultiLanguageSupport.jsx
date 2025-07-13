// File: MultiLanguageSupport.jsx
// Path: frontend/src/components/common/MultiLanguageSupport.jsx
// 👑 Cod1 Crown Certified

import React, { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    welcome: "Welcome",
    downloadPDF: "Download PDF",
    matchedLenders: "Matched Lenders",
    reputationScore: "Reputation Score",
    badgesEarned: "Badges Earned",
    shareProfile: "Share Profile",
    aiTips: "AI Coaching Tips"
  },
  es: {
    welcome: "Bienvenido",
    downloadPDF: "Descargar PDF",
    matchedLenders: "Prestamistas Coincidentes",
    reputationScore: "Puntuación de Reputación",
    badgesEarned: "Insignias Obtenidas",
    shareProfile: "Compartir Perfil",
    aiTips: "Consejos de Coaching AI"
  },
  fr: {
    welcome: "Bienvenue",
    downloadPDF: "Télécharger le PDF",
    matchedLenders: "Prêteurs Correspondants",
    reputationScore: "Score de Réputation",
    badgesEarned: "Badges Gagnés",
    shareProfile: "Partager le Profil",
    aiTips: "Conseils de Coaching IA"
  }
};

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const MultiLanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const getTranslation = (key) => translations[language][key] || key;

  const setUserLanguage = (lang) => {
    if (translations[lang]) setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ getTranslation, setUserLanguage, language }}>
      {children}
    </LanguageContext.Provider>
  );
};
