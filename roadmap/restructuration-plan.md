# 🏗️ Plan de Restructuration - PropManager

## 🎯 Objectif : Structure Standard + Alias Cohérents

### **Structure Actuelle (Problématique)**

```
PropManager/
├── Components/     ← Alias @/ ne fonctionne pas
├── Pages/          ← Imports cassés
├── Entities/       ← Confusion avec src/
├── Layout.js
└── vite.config.js  ← Alias @/ → ./src (inexistant)
```

### **Structure Cible (Recommandée)**

```
PropManager/
├── src/
│   ├── components/    ← @/components
│   ├── pages/         ← @/pages
│   ├── entities/      ← @/entities
│   ├── hooks/         ← @/hooks
│   ├── services/      ← @/services
│   ├── utils/         ← @/utils
│   ├── types/         ← @/types (TypeScript)
│   └── constants/     ← @/constants
├── public/
├── docs/
└── config/
```

## 🚀 Migration Step-by-Step

### **Étape 1 : Préparation (5 min)**

```bash
# Créer la nouvelle structure
mkdir src
mkdir src/components src/pages src/entities src/utils src/services
```

### **Étape 2 : Migration Files (15 min)**

```bash
# Déplacer les dossiers
mv Components src/components
mv Pages src/pages
mv Entities src/entities
mv Layout.js src/Layout.js

# Créer utils manquant
echo "export * from './navigation.js';" > src/utils/index.js
```

### **Étape 3 : Fix Imports (Auto avec VSCode)**

```javascript
// Avant (cassé)
import { Bien } from "@/entities/Bien";

// Après (fonctionne)
import { Bien } from "@/entities/Bien"; // Même import !
```

### **Étape 4 : Validation**

- [ ] `npm run dev` fonctionne
- [ ] Tous les imports résolus
- [ ] Pas d'erreurs console

## 💡 Bénéfices Immédiats

✅ **Imports cohérents** partout  
✅ **Auto-completion** VSCode parfaite  
✅ **Standard industrie** respecté  
✅ **Scaling** préparé  
✅ **Onboarding** équipe facilité

## ⚠️ Points d'Attention

1. **Git** : Faire commit avant migration
2. **demo.html** : Adapter les chemins mock
3. **config-simple.js** : Mettre à jour FOLDER_NAMES
4. **Tests** : Vérifier après migration

## 🎯 Timeline Recommandée

- **Maintenant** : Structure src/
- **Cette semaine** : TypeScript
- **Semaine prochaine** : Backend API
- **Mois prochain** : Tests + déploiement
