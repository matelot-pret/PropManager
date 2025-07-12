# 📂 Guide de Configuration des Chemins d'Accès - PropManager

## 🎯 Objectif

Ce système permet de centraliser tous les chemins d'accès du projet dans un seul fichier de configuration. Pour déplacer le projet ou changer la structure des dossiers, vous n'avez qu'à modifier le fichier `config/paths.js`.

## 🚀 Comment Changer l'Emplacement du Projet

### 1. **Déplacer tout le projet**

```javascript
// Dans config/paths.js, ligne 9 :
ROOT: "c:\\Users\\samou\\Documents\\projetPerso\\PropManager",

// Changez vers :
ROOT: "D:\\MesProjets\\PropManager",
// ou
ROOT: "c:\\Users\\samou\\Desktop\\PropManager",
```

### 2. **Renommer les dossiers principaux**

```javascript
// Dans config/paths.js, lignes 12-19 :
FOLDER_NAMES: {
  COMPONENTS: "Components",     // Changez en "src/components"
  PAGES: "Pages",              // Changez en "src/pages"
  ENTITIES: "Entities",        // Changez en "src/entities"
  ASSETS: "assets",
  CONFIG: "config",
  DOCS: "docs"
}
```

### 3. **Changer vers une structure src/**

```javascript
// Pour adopter la structure recommandée :
ROOT: "c:\\Users\\samou\\Documents\\projetPerso\\PropManager",
FOLDER_NAMES: {
  COMPONENTS: "src/components",
  PAGES: "src/pages",
  ENTITIES: "src/entities",
  ASSETS: "src/assets",
  CONFIG: "src/config",
  DOCS: "docs"
}
```

## 📁 Exemples de Structures Supportées

### Structure Actuelle

```
PropManager/
├── Components/
├── Pages/
├── Entities/
├── Layout.js
└── demo.html
```

### Structure Recommandée (après modification)

```
PropManager/
├── src/
│   ├── components/
│   ├── pages/
│   ├── entities/
│   ├── utils/
│   └── config/
├── public/
├── package.json
└── vite.config.js
```

### Structure Alternative

```
PropManager/
├── app/
│   ├── components/
│   ├── pages/
│   └── models/     # au lieu d'entities
├── assets/
└── config/
```

## 🔧 Comment Utiliser dans Vos Fichiers

### Dans un composant React :

```javascript
// Au lieu de :
import BienForm from "../components/biens/BienForm";
import { Bien } from "@/entities/Bien";

// Utilisez :
import { PathUtils } from "../config/paths.js";
import BienForm from `${PathUtils.getRelativePath('pages', 'components/biens')}/BienForm`;
import { Bien } from `${PathUtils.resolveImport('entities')}/Bien`;
```

### Avec des helpers :

```javascript
import {
  generateImportPath,
  getContextPaths,
} from "../config/example-usage.js";

// Obtenir tous les chemins pour une page :
const paths = getContextPaths("pages");
// paths.toComponents = "../Components"
// paths.toEntities = "../Entities"
// paths.toUI = "../Components/ui"

// Générer un import spécifique :
const biensPath = generateImportPath("components", "biens/BienForm");
```

## ⚡ Migration Automatique

### Script PowerShell pour migration :

```powershell
# Remplacer tous les imports en dur
Get-ChildItem -Path '.' -Recurse -Filter '*.js' | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $content = $content -replace 'from "../components/', 'from "${PathUtils.getRelativePath(''pages'', ''components'')}/'
    $content = $content -replace 'from "@/entities/', 'from "${PathUtils.resolveImport(''entities'')}/'
    Set-Content $_.FullName $content
}
```

### Avec VSCode (Rechercher/Remplacer) :

1. **Ctrl+Shift+H** pour ouvrir Rechercher/Remplacer
2. **Rechercher :** `from "../components/`
3. **Remplacer :** `from "${PathUtils.getRelativePath('pages', 'components')}/`
4. **Dans :** `*.js,*.jsx,*.ts,*.tsx`

## 📋 Checklist de Migration

- [ ] 1. Déplacer physiquement les dossiers si nécessaire
- [ ] 2. Modifier `PATHS.ROOT` dans `config/paths.js`
- [ ] 3. Modifier `FOLDER_NAMES` si vous renommez les dossiers
- [ ] 4. Mettre à jour les imports dans vos fichiers
- [ ] 5. Tester que tout fonctionne
- [ ] 6. Mettre à jour `vite.config.js` si vous utilisez des alias

## 🎯 Avantages de Cette Approche

✅ **Un seul point de modification** pour tous les chemins  
✅ **Migration facile** vers une nouvelle structure  
✅ **Compatibilité** avec différents bundlers (Vite, Webpack)  
✅ **Évite les erreurs** de chemins cassés  
✅ **Documentation** automatique de la structure

## 🚨 Points d'Attention

⚠️ **Imports dynamiques** : Les template literals dans les imports ne fonctionnent qu'avec certains bundlers  
⚠️ **Performance** : Préférez les imports statiques en production  
⚠️ **Compatibilité** : Vérifiez que votre bundler supporte les imports dynamiques

## 💡 Conseils

1. **Testez d'abord** avec un petit nombre de fichiers
2. **Sauvegardez** avant la migration
3. **Utilisez Git** pour pouvoir revenir en arrière
4. **Migrez progressivement** par dossier
