// ===========================================
// EXEMPLE D'UTILISATION DES CHEMINS CONFIGURÉS
// ===========================================
// Ce fichier montre comment utiliser les variables de chemins
// dans vos composants React

import React, { useState, useEffect } from "react";
import { PATHS, PathUtils } from "../config/paths.js";

// ===========================================
// IMPORTS AVEC VARIABLES DE CHEMINS
// ===========================================

// AVANT (chemins en dur) :
// import { Bien } from "@/entities/Bien";
// import { Button } from "@/components/ui/button";
// import BienForm from "../components/biens/BienForm";

// APRÈS (avec variables) :
import { Bien } from `${PathUtils.resolveImport('entities')}/Bien`;
import { Button } from `${PathUtils.resolveImport('components/ui')}/button`;
import BienForm from `${PathUtils.getRelativePath('pages', 'components/biens')}/BienForm`;

// Alternative avec fonction helper :
const importPath = (target, file = '') => {
  const basePath = PathUtils.resolveImport(target);
  return file ? `${basePath}/${file}` : basePath;
};

// Utilisation :
// import { Bien } from importPath('entities', 'Bien');
// import { Button } from importPath('components/ui', 'button');

// ===========================================
// COMPOSANT EXEMPLE
// ===========================================

export default function ExamplePageWithPaths() {
  const [data, setData] = useState([]);
  
  // Utilisation des chemins pour des références
  const componentInfo = {
    currentPath: PATHS.PAGES,
    componentsPath: PATHS.COMPONENTS,
    entitiesPath: PATHS.ENTITIES
  };

  useEffect(() => {
    console.log('Chemins de configuration:', componentInfo);
    console.log('Chemin relatif vers components:', 
      PathUtils.getRelativePath('pages', 'components'));
  }, []);

  return (
    <div className="p-6">
      <h1>Exemple avec Chemins Configurés</h1>
      
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h2>Configuration des chemins :</h2>
        <ul className="mt-2 space-y-1">
          <li><strong>Pages:</strong> {PATHS.PAGES}</li>
          <li><strong>Components:</strong> {PATHS.COMPONENTS}</li>
          <li><strong>Entities:</strong> {PATHS.ENTITIES}</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-blue-100 rounded">
        <h2>Imports générés :</h2>
        <ul className="mt-2 space-y-1">
          <li><strong>UI Components:</strong> {PathUtils.resolveImport('components/ui')}</li>
          <li><strong>Entities:</strong> {PathUtils.resolveImport('entities')}</li>
          <li><strong>Utils:</strong> {PathUtils.resolveImport('utils')}</li>
        </ul>
      </div>
    </div>
  );
}

// ===========================================
// FONCTIONS UTILITAIRES POUR IMPORTS
// ===========================================

/**
 * Helper pour générer des imports dynamiques
 * @param {string} baseType - Type de base (components, entities, etc.)
 * @param {string} specificPath - Chemin spécifique
 * @returns {string} Chemin d'import complet
 */
export function generateImportPath(baseType, specificPath = '') {
  const basePath = PathUtils.resolveImport(baseType);
  return specificPath ? `${basePath}/${specificPath}` : basePath;
}

/**
 * Helper pour obtenir tous les chemins utiles d'un contexte
 * @param {string} context - Contexte actuel (pages, components, etc.)
 * @returns {object} Objet avec tous les chemins relatifs utiles
 */
export function getContextPaths(context) {
  return {
    toComponents: PathUtils.getRelativePath(context, 'components'),
    toEntities: PathUtils.getRelativePath(context, 'entities'),
    toUI: PathUtils.getRelativePath(context, 'components/ui'),
    toBiens: PathUtils.getRelativePath(context, 'components/biens'),
    toChambres: PathUtils.getRelativePath(context, 'components/chambres'),
    toLocataires: PathUtils.getRelativePath(context, 'components/locataires'),
    toDashboard: PathUtils.getRelativePath(context, 'components/dashboard'),
  };
}

// ===========================================
// CONFIGURATION POUR DIFFÉRENTS ENVIRONNEMENTS
// ===========================================

/**
 * Adapte les chemins selon l'environnement de développement
 * @param {string} env - Environnement (dev, prod, test)
 * @returns {object} Configuration adaptée
 */
export function getEnvironmentPaths(env = 'dev') {
  const basePaths = { ...PATHS };
  
  switch(env) {
    case 'prod':
      // En production, utiliser des chemins relatifs
      return {
        ...basePaths,
        useAlias: false,
        ROOT: './dist'
      };
      
    case 'test':
      // En test, utiliser des chemins de test
      return {
        ...basePaths,
        ROOT: './test-fixtures'
      };
      
    default:
      // Développement
      return basePaths;
  }
}
