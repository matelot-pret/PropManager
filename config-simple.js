// ===========================================
// 🎯 CONFIGURATION RAPIDE - PropManager
// ===========================================
//
// ✨ POUR DÉPLACER VOTRE PROJET :
// Changez uniquement PROJECT_ROOT ci-dessous !

const PROJECT_CONFIG = {
  // 🏠 EMPLACEMENT PRINCIPAL (modifiez ici pour déplacer tout le projet)
  PROJECT_ROOT: "c:\\Users\\samou\\Documents\\projetPerso\\PropManager",

  // 📁 NOMS DES DOSSIERS (modifiez si vous voulez renommer)
  FOLDERS: {
    COMPONENTS: "Components",
    PAGES: "Pages",
    ENTITIES: "Entities",
  },
};

// ===========================================
// 🔧 GÉNÉRATION AUTOMATIQUE DES CHEMINS
// ===========================================
// (Ne modifiez pas cette section, elle se met à jour automatiquement)

const GENERATED_PATHS = {
  // Chemins complets
  ROOT: PROJECT_CONFIG.PROJECT_ROOT,
  COMPONENTS: `${PROJECT_CONFIG.PROJECT_ROOT}\\${PROJECT_CONFIG.FOLDERS.COMPONENTS}`,
  PAGES: `${PROJECT_CONFIG.PROJECT_ROOT}\\${PROJECT_CONFIG.FOLDERS.PAGES}`,
  ENTITIES: `${PROJECT_CONFIG.PROJECT_ROOT}\\${PROJECT_CONFIG.FOLDERS.ENTITIES}`,

  // Sous-dossiers Components
  COMPONENTS_BIENS: `${PROJECT_CONFIG.PROJECT_ROOT}\\${PROJECT_CONFIG.FOLDERS.COMPONENTS}\\Biens`,
  COMPONENTS_CHAMBRES: `${PROJECT_CONFIG.PROJECT_ROOT}\\${PROJECT_CONFIG.FOLDERS.COMPONENTS}\\Chambres`,
  COMPONENTS_LOCATAIRES: `${PROJECT_CONFIG.PROJECT_ROOT}\\${PROJECT_CONFIG.FOLDERS.COMPONENTS}\\Locataires`,
  COMPONENTS_DASHBOARD: `${PROJECT_CONFIG.PROJECT_ROOT}\\${PROJECT_CONFIG.FOLDERS.COMPONENTS}\\Dashboard`,
  COMPONENTS_UI: `${PROJECT_CONFIG.PROJECT_ROOT}\\${PROJECT_CONFIG.FOLDERS.COMPONENTS}\\ui`,

  // Fichiers principaux
  LAYOUT: `${PROJECT_CONFIG.PROJECT_ROOT}\\Layout.js`,
  DEMO: `${PROJECT_CONFIG.PROJECT_ROOT}\\demo.html`,

  // Chemins relatifs pour imports
  RELATIVE: {
    PAGES_TO_COMPONENTS: `..\\${PROJECT_CONFIG.FOLDERS.COMPONENTS}`,
    PAGES_TO_ENTITIES: `..\\${PROJECT_CONFIG.FOLDERS.ENTITIES}`,
    PAGES_TO_COMPONENTS_BIENS: `..\\${PROJECT_CONFIG.FOLDERS.COMPONENTS}\\Biens`,
    PAGES_TO_COMPONENTS_CHAMBRES: `..\\${PROJECT_CONFIG.FOLDERS.COMPONENTS}\\Chambres`,
    PAGES_TO_COMPONENTS_LOCATAIRES: `..\\${PROJECT_CONFIG.FOLDERS.COMPONENTS}\\Locataires`,
    PAGES_TO_COMPONENTS_DASHBOARD: `..\\${PROJECT_CONFIG.FOLDERS.COMPONENTS}\\Dashboard`,
    PAGES_TO_COMPONENTS_UI: `..\\${PROJECT_CONFIG.FOLDERS.COMPONENTS}\\ui`,

    // Alias pour bundlers
    ALIAS_COMPONENTS: "@/components",
    ALIAS_ENTITIES: "@/entities",
    ALIAS_UTILS: "@/utils",
    ALIAS_UI: "@/components/ui",
  },
};

// ===========================================
// 🎁 EXEMPLES DE MIGRATION RAPIDE
// ===========================================

const QUICK_MIGRATIONS = {
  // Déplacer vers le Desktop
  DESKTOP: () => {
    PROJECT_CONFIG.PROJECT_ROOT = "c:\\Users\\samou\\Desktop\\PropManager";
    console.log("✅ Projet déplacé vers le Desktop");
    return GENERATED_PATHS;
  },

  // Déplacer vers le disque D:
  DISK_D: () => {
    PROJECT_CONFIG.PROJECT_ROOT = "D:\\PropManager";
    console.log("✅ Projet déplacé vers le disque D:");
    return GENERATED_PATHS;
  },

  // Adopter la structure src/
  SRC_STRUCTURE: () => {
    PROJECT_CONFIG.FOLDERS = {
      COMPONENTS: "src\\components",
      PAGES: "src\\pages",
      ENTITIES: "src\\entities",
    };
    console.log("✅ Structure src/ adoptée");
    return GENERATED_PATHS;
  },

  // Migration personnalisée
  CUSTOM: (newRoot, folderNames = null) => {
    PROJECT_CONFIG.PROJECT_ROOT = newRoot;
    if (folderNames) {
      PROJECT_CONFIG.FOLDERS = { ...PROJECT_CONFIG.FOLDERS, ...folderNames };
    }
    console.log(`✅ Projet déplacé vers: ${newRoot}`);
    return GENERATED_PATHS;
  },
};

// ===========================================
// 📋 GUIDE RAPIDE D'UTILISATION
// ===========================================

console.log(`
🎯 PropManager - Configuration des Chemins

📍 EMPLACEMENT ACTUEL: ${PROJECT_CONFIG.PROJECT_ROOT}

🚀 POUR DÉPLACER LE PROJET :

1️⃣ Méthode Simple :
   Changez PROJECT_ROOT ligne 8 de ce fichier

2️⃣ Méthode Rapide :
   // Vers le Desktop
   QUICK_MIGRATIONS.DESKTOP();
   
   // Vers le disque D:
   QUICK_MIGRATIONS.DISK_D();
   
   // Structure src/
   QUICK_MIGRATIONS.SRC_STRUCTURE();
   
   // Personnalisé
   QUICK_MIGRATIONS.CUSTOM("D:\\MesProjets\\PropManager");

📁 CHEMINS DISPONIBLES :
   - GENERATED_PATHS.ROOT
   - GENERATED_PATHS.COMPONENTS  
   - GENERATED_PATHS.PAGES
   - GENERATED_PATHS.ENTITIES
   - GENERATED_PATHS.RELATIVE.PAGES_TO_COMPONENTS
`);

// Export pour utilisation dans d'autres fichiers
if (typeof module !== "undefined" && module.exports) {
  module.exports = { PROJECT_CONFIG, GENERATED_PATHS, QUICK_MIGRATIONS };
}
