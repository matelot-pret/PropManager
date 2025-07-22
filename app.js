"use strict";
// ===========================================
// CONFIGURATION DES CHEMINS D'ACCÈS
// ===========================================

const PATHS = {
  // Chemins racine du projet
  ROOT: "c:\\Users\\samou\\Documents\\projetPerso\\PropManager",
  // Dossiers principaux
  COMPONENTS: "c:\\Users\\samou\\Documents\\projetPerso\\PropManager\\Components",
  PAGES: "c:\\Users\\samou\\Documents\\projetPerso\\PropManager\\Pages",
  ENTITIES: "c:\\Users\\samou\\Documents\\projetPerso\\PropManager\\Entities",
  // Sous-dossiers Components
  COMPONENTS_BIENS: "c:\\Users\\samou\\Documents\\projetPerso\\PropManager\\Components\\Biens",
  COMPONENTS_CHAMBRES: "c:\\Users\\samou\\Documents\\projetPerso\\PropManager\\Components\\Chambres",
  COMPONENTS_LOCATAIRES: "c:\\Users\\samou\\Documents\\projetPerso\\PropManager\\Components\\Locataires",
  COMPONENTS_DASHBOARD: "c:\\Users\\samou\\Documents\\projetPerso\\PropManager\\Components\\Dashboard",
  COMPONENTS_UI: "c:\\Users\\samou\\Documents\\projetPerso\\PropManager\\Components\\ui",
  // Fichiers spécifiques souvent utilisés
  LAYOUT: "c:\\Users\\samou\\Documents\\projetPerso\\PropManager\\Layout.js",
  // Chemins relatifs pour imports (à partir de chaque contexte)
  RELATIVE: {
    PAGES_TO_COMPONENTS: "../Components",
    PAGES_TO_COMPONENTS_BIENS: "../Components/Biens",
    PAGES_TO_COMPONENTS_CHAMBRES: "../Components/Chambres",
    PAGES_TO_COMPONENTS_LOCATAIRES: "../Components/Locataires",
    PAGES_TO_COMPONENTS_DASHBOARD: "../Components/Dashboard",
    COMPONENTS_TO_ENTITIES: "../Entities",
    ALIAS_COMPONENTS: "@/components",
    ALIAS_ENTITIES: "@/entities",
    ALIAS_UTILS: "@/utils",
    ALIAS_UI: "@/components/ui",
  },
};

// ...existing code JS (à compléter avec tout le JS de demo.html)...
