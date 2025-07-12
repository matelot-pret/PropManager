// ===========================================
// CONFIGURATION CENTRALISÉE DES CHEMINS D'ACCÈS
// ===========================================
//
// Ce fichier centralise tous les chemins d'accès du projet PropManager.
// Pour déplacer le projet ou changer la structure des dossiers,
// modifiez uniquement les valeurs dans ce fichier.

export const PATHS = {
  // ===========================================
  // CONFIGURATION PRINCIPALE
  // ===========================================

  // Chemin racine du projet (MODIFIEZ ICI pour déplacer tout le projet)
  ROOT: "c:\\Users\\samou\\Documents\\projetPerso\\PropManager",

  // Nom des dossiers principaux (MODIFIEZ ICI pour renommer les dossiers)
  FOLDER_NAMES: {
    COMPONENTS: "Components",
    PAGES: "Pages",
    ENTITIES: "Entities",
    ASSETS: "assets",
    CONFIG: "config",
    DOCS: "docs",
  },

  // ===========================================
  // CHEMINS ABSOLUS (générés automatiquement)
  // ===========================================

  get COMPONENTS() {
    return `${this.ROOT}\\${this.FOLDER_NAMES.COMPONENTS}`;
  },
  get PAGES() {
    return `${this.ROOT}\\${this.FOLDER_NAMES.PAGES}`;
  },
  get ENTITIES() {
    return `${this.ROOT}\\${this.FOLDER_NAMES.ENTITIES}`;
  },
  get ASSETS() {
    return `${this.ROOT}\\${this.FOLDER_NAMES.ASSETS}`;
  },
  get CONFIG() {
    return `${this.ROOT}\\${this.FOLDER_NAMES.CONFIG}`;
  },

  // Sous-dossiers Components
  get COMPONENTS_BIENS() {
    return `${this.COMPONENTS}\\Biens`;
  },
  get COMPONENTS_CHAMBRES() {
    return `${this.COMPONENTS}\\Chambres`;
  },
  get COMPONENTS_LOCATAIRES() {
    return `${this.COMPONENTS}\\Locataires`;
  },
  get COMPONENTS_DASHBOARD() {
    return `${this.COMPONENTS}\\Dashboard`;
  },
  get COMPONENTS_UI() {
    return `${this.COMPONENTS}\\ui`;
  },

  // Fichiers principaux
  get LAYOUT() {
    return `${this.ROOT}\\Layout.js`;
  },
  get DEMO() {
    return `${this.ROOT}\\demo.html`;
  },
  get PACKAGE_JSON() {
    return `${this.ROOT}\\package.json`;
  },
  get VITE_CONFIG() {
    return `${this.ROOT}\\vite.config.js`;
  },

  // ===========================================
  // CHEMINS RELATIFS POUR IMPORTS
  // ===========================================

  RELATIVE: {
    // Depuis Pages vers autres dossiers
    PAGES_TO_COMPONENTS: "../Components",
    PAGES_TO_ENTITIES: "../Entities",
    PAGES_TO_ROOT: "..",

    // Depuis Pages vers sous-dossiers Components
    PAGES_TO_COMPONENTS_BIENS: "../Components/Biens",
    PAGES_TO_COMPONENTS_CHAMBRES: "../Components/Chambres",
    PAGES_TO_COMPONENTS_LOCATAIRES: "../Components/Locataires",
    PAGES_TO_COMPONENTS_DASHBOARD: "../Components/Dashboard",
    PAGES_TO_COMPONENTS_UI: "../Components/ui",

    // Depuis Components vers autres dossiers
    COMPONENTS_TO_ENTITIES: "../Entities",
    COMPONENTS_TO_PAGES: "../Pages",
    COMPONENTS_TO_ROOT: "..",

    // Entre sous-dossiers Components
    COMPONENTS_BIENS_TO_UI: "../ui",
    COMPONENTS_CHAMBRES_TO_UI: "../ui",
    COMPONENTS_LOCATAIRES_TO_UI: "../ui",
    COMPONENTS_DASHBOARD_TO_UI: "../ui",

    // Alias pour bundlers (Vite, Webpack, etc.)
    ALIAS: {
      COMPONENTS: "@/components",
      ENTITIES: "@/entities",
      UTILS: "@/utils",
      UI: "@/components/ui",
      PAGES: "@/pages",
      ASSETS: "@/assets",
      CONFIG: "@/config",
    },
  },

  // ===========================================
  // EXTENSIONS DE FICHIERS
  // ===========================================

  EXTENSIONS: {
    REACT: [".js", ".jsx", ".ts", ".tsx"],
    STYLES: [".css", ".scss", ".sass"],
    CONFIG: [".json", ".js", ".ts"],
    ASSETS: [".png", ".jpg", ".jpeg", ".svg", ".ico"],
  },
};

// ===========================================
// UTILITAIRES POUR MANIPULATION DES CHEMINS
// ===========================================

export const PathUtils = {
  /**
   * Construit un chemin en joignant les segments
   * @param {string} basePath - Chemin de base
   * @param {...string} segments - Segments à ajouter
   * @returns {string} Chemin complet
   */
  buildPath(basePath, ...segments) {
    return [basePath, ...segments].join("\\");
  },

  /**
   * Convertit un chemin Windows en chemin Unix pour les imports
   * @param {string} windowsPath - Chemin Windows
   * @returns {string} Chemin Unix
   */
  toUnixPath(windowsPath) {
    return windowsPath.replace(/\\/g, "/");
  },

  /**
   * Obtient le chemin relatif approprié selon le contexte
   * @param {string} fromContext - Contexte source (ex: "pages", "components")
   * @param {string} toTarget - Cible (ex: "components", "entities")
   * @returns {string} Chemin relatif
   */
  getRelativePath(fromContext, toTarget) {
    const context = fromContext.toLowerCase();
    const target = toTarget.toLowerCase();

    if (context === "pages") {
      switch (target) {
        case "components":
          return PATHS.RELATIVE.PAGES_TO_COMPONENTS;
        case "entities":
          return PATHS.RELATIVE.PAGES_TO_ENTITIES;
        case "components/biens":
          return PATHS.RELATIVE.PAGES_TO_COMPONENTS_BIENS;
        case "components/chambres":
          return PATHS.RELATIVE.PAGES_TO_COMPONENTS_CHAMBRES;
        case "components/locataires":
          return PATHS.RELATIVE.PAGES_TO_COMPONENTS_LOCATAIRES;
        case "components/dashboard":
          return PATHS.RELATIVE.PAGES_TO_COMPONENTS_DASHBOARD;
        case "components/ui":
          return PATHS.RELATIVE.PAGES_TO_COMPONENTS_UI;
        default:
          return target;
      }
    }

    if (context === "components") {
      switch (target) {
        case "entities":
          return PATHS.RELATIVE.COMPONENTS_TO_ENTITIES;
        case "pages":
          return PATHS.RELATIVE.COMPONENTS_TO_PAGES;
        case "ui":
          return PATHS.RELATIVE.COMPONENTS_BIENS_TO_UI; // Depuis n'importe quel sous-dossier
        default:
          return target;
      }
    }

    return target;
  },

  /**
   * Résout un import selon le type de bundler utilisé
   * @param {string} target - Cible de l'import
   * @param {boolean} useAlias - Utiliser les alias (@/) ou les chemins relatifs
   * @returns {string} Chemin d'import résolu
   */
  resolveImport(target, useAlias = true) {
    if (!useAlias) return target;

    switch (target) {
      case "components":
      case "components/ui":
        return PATHS.RELATIVE.ALIAS.UI;
      case "entities":
        return PATHS.RELATIVE.ALIAS.ENTITIES;
      case "utils":
        return PATHS.RELATIVE.ALIAS.UTILS;
      case "pages":
        return PATHS.RELATIVE.ALIAS.PAGES;
      case "assets":
        return PATHS.RELATIVE.ALIAS.ASSETS;
      default:
        return target;
    }
  },

  /**
   * Valide qu'un chemin existe (simulation pour la démo)
   * @param {string} path - Chemin à vérifier
   * @returns {boolean} True si le chemin est valide
   */
  isValidPath(path) {
    // Dans un vrai projet, ceci ferait un check du système de fichiers
    return path && typeof path === "string" && path.length > 0;
  },

  /**
   * Obtient le nom du fichier à partir d'un chemin complet
   * @param {string} fullPath - Chemin complet
   * @returns {string} Nom du fichier
   */
  getFileName(fullPath) {
    return fullPath.split("\\").pop() || fullPath.split("/").pop() || "";
  },

  /**
   * Obtient le dossier parent d'un chemin
   * @param {string} fullPath - Chemin complet
   * @returns {string} Chemin du dossier parent
   */
  getParentDir(fullPath) {
    const parts =
      fullPath.split("\\").length > 1
        ? fullPath.split("\\")
        : fullPath.split("/");
    parts.pop();
    return parts.join("\\");
  },
};

// ===========================================
// EXEMPLES D'UTILISATION
// ===========================================

/* 
// Utilisation basique :
import { PATHS, PathUtils } from './config/paths.js';

// Obtenir un chemin absolu
const componentsPath = PATHS.COMPONENTS;
const biensPath = PATHS.COMPONENTS_BIENS;

// Construire un chemin dynamique
const customPath = PathUtils.buildPath(PATHS.ROOT, 'custom', 'folder');

// Obtenir un chemin relatif pour import
const relativePath = PathUtils.getRelativePath('pages', 'components/ui');

// Import avec alias
const importPath = PathUtils.resolveImport('components/ui');

// Pour changer l'emplacement du projet :
// 1. Modifiez PATHS.ROOT
// 2. Optionnellement, modifiez FOLDER_NAMES si vous renommez les dossiers
// 3. Tous les autres chemins se mettront à jour automatiquement
*/
