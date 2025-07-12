# PropManager

Gestion locative moderne, performante et typée.

## Fonctionnalités principales
- Gestion des biens, chambres, locataires, loyers, contrats et factures
- Tableaux de bord financiers et statistiques
- Historique des loyers et activités
- Virtualisation des listes pour performance
- Validation et sécurité côté frontend et backend
- Architecture modulaire avec services, hooks et context typés

## Stack technique
- **React 18** + **TypeScript**
- **Vite** (build rapide)
- **Zustand** (state management)
- **Tailwind CSS** (UI moderne)
- **React-window** (virtualisation)
- **React-query** (caching, mutations)
- **Express** (API backend)

## Installation

`bash
# Clonez le repo
$ git clone https://github.com/matelot-pret/PropManager.git
$ cd PropManager

# Installez les dépendances
$ npm install

# Lancez le projet
$ npm run dev
`

## Documentation
- [Guide de bonnes pratiques](./best-practice.md)
- [Roadmap](./roadmap.md)

## Contribuer

### Prérequis
- Node.js ≥ 18, npm ≥ 9
- Connaissances React, TypeScript

### Étapes
1. Forkez le projet
2. Créez une branche : git checkout -b feat/nom-fonctionnalite
3. Développez avec 
pm run dev
4. Testez : 
pm run test et 
pm run lint
5. Commit : eat: description claire
6. Pull Request avec description détaillée

### Bonnes pratiques
- Types explicites TypeScript obligatoires
- Hooks personnalisés pour la logique métier
- Séparez UI et logique métier
- Suivez le [guide de bonnes pratiques](./best-practice.md)

---

**PropManager** - Gestion locative moderne et typée 🚀
