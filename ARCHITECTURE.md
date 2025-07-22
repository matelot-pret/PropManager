# 📋 Guide Architecture TypeScript PropManager

## 🏗️ Vue d'ensemble de l'architecture

Cette architecture TypeScript moderne suit les meilleures pratiques pour une application React de gestion immobilière. Elle est organisée en couches distinctes avec une séparation claire des responsabilités.

## 📁 Structure des dossiers

```
src/
├── types/           # Définitions TypeScript centralisées
├── services/        # Services d'accès aux données et logique métier
├── hooks/          # Hooks React personnalisés
├── utils/          # Utilitaires et fonctions pures
├── components/     # Composants React (à migrer)
├── pages/          # Pages de l'application (à migrer)
└── context/        # Contextes React (à créer)
```

## 🎯 Types et Modèles (`src/types/models.ts`)

### Entités principales

- **Bien**: Propriétés immobilières avec gestion de statut
- **Chambre**: Unités locatives avec tarification et équipements
- **Locataire**: Informations des locataires et contacts
- **ContratBail**: Contrats de location et conditions
- **Loyer**: Paiements et historique des loyers
- **Facture**: Facturation et comptabilité
- **Travaux**: Maintenance et améliorations

### Types utilitaires

- **DTOs**: Types pour formulaires (Create/Update)
- **Filters**: Types pour la filtration et recherche
- **API Responses**: Formats standardisés pour l'API
- **Hook Returns**: Types de retour pour les hooks

## 🔧 Services (`src/services/`)

### Architecture des services

Chaque service suit le pattern **Repository** avec:

- Interface TypeScript définissant le contrat
- Implémentation avec gestion d'erreurs
- Méthodes CRUD standardisées
- Opérations métier spécialisées
- Validation des données

### Services disponibles

#### `ChambreService`

```typescript
// CRUD Operations
getAll(filters?: ChambreFilters): Promise<PaginatedResponse<Chambre>>
getById(id: string): Promise<ApiResponse<Chambre>>
create(data: CreateChambreDto): Promise<ApiResponse<Chambre>>
update(id: string, data: UpdateChambreDto): Promise<ApiResponse<Chambre>>
delete(id: string): Promise<ApiResponse<void>>

// Business Operations
updateStatut(id: string, statut: Chambre['statut']): Promise<ApiResponse<Chambre>>
getChambresLibres(): Promise<ApiResponse<Chambre[]>>
getStatistiques(): Promise<ApiResponse<Stats>>
```

#### `LocataireService`

```typescript
// CRUD + Business
getAll, getById, create, update, delete
getActifs(), getInactifs(), rechercher(terme: string)
updateContact(id: string, contact: ContactData)
uploadDocument(id: string, document: File, type: string)
```

#### `PropManagerService` (Façade)

```typescript
// Opérations transversales
getDashboard(): Promise<DashboardData>
rechercheGlobale(terme: string): Promise<SearchResults>
synchroniserDonnees(): Promise<SyncStatus>
verifierConnectivite(): Promise<ConnectivityStatus>
```

## 🪝 Hooks React (`src/hooks/`)

### Hooks d'entités

#### `useChambres(filters?)`

```typescript
const {
  chambres, // Chambre[]
  loading, // boolean
  error, // string | null
  pagination, // { page, totalPages, total, hasNext, hasPrev }
  refetch, // () => Promise<void>
} = useChambres({ statut: "libre" });
```

#### `useChambresActions()`

```typescript
const {
  loading,
  error,
  createChambre, // (data) => Promise<Chambre>
  updateChambre, // (id, data) => Promise<Chambre>
  deleteChambre, // (id) => Promise<void>
  updateStatut, // (id, statut) => Promise<Chambre>
} = useChambresActions();
```

### Hooks globaux

#### `usePropManager()`

```typescript
const {
  dashboard, // Hook pour tableau de bord
  globalSearch, // Hook pour recherche globale
  dataSync, // Hook pour synchronisation
  connectivity, // Hook pour vérification connectivité
  isLoading, // État global de chargement
  hasErrors, // Indicateur d'erreurs
  errors, // Liste des erreurs
} = usePropManager();
```

### Hooks utilitaires

#### `useAsyncState<T>()`

```typescript
const { data, loading, error, execute, reset } = useAsyncState<User>();

// Utilisation
const handleSubmit = () => {
  execute(() => api.createUser(userData));
};
```

#### `useFormState<T>(initialValues, validator?)`

```typescript
const {
  values, // Valeurs du formulaire
  errors, // Erreurs de validation
  touched, // Champs touchés
  setValue, // Mettre à jour une valeur
  setTouched, // Marquer un champ comme touché
  validate, // Valider le formulaire
  reset, // Réinitialiser
  isValid, // Formulaire valide?
} = useFormState({ nom: "", email: "" }, validateUser);
```

#### `useNotifications()`

```typescript
const {
  notifications, // Liste des notifications
  success, // (message, duration?) => void
  error, // (message, duration?) => void
  warning, // (message, duration?) => void
  info, // (message, duration?) => void
  removeNotification,
  clearAll,
} = useNotifications();
```

## 🛠️ Utilitaires (`src/utils/index.ts`)

### Validation

```typescript
isValidEmail(email: string): boolean
isValidPhoneFR(phone: string): boolean
isValidAmount(amount: number): boolean
isValidAge(age: number): boolean
isValidBirthDate(dateString: string): boolean
```

### Formatage

```typescript
formatCurrency(amount: number): string           // "1 234,56 €"
formatDateFR(dateString: string): string         // "15/03/2024"
formatPhoneFR(phone: string): string             // "01 23 45 67 89"
formatPercentage(value: number): string          // "85.5 %"
```

### Calculs métier

```typescript
calculateAge(birthDateString: string): number
calculateRendement(revenuAnnuel: number, prixAchat: number): number
calculateTauxOccupation(chambresLouees: number, total: number): number
calculateLoyerTotal(loyer: number, charges: number): number
```

### Manipulation de données

```typescript
searchText(text: string, query: string): boolean    // Recherche insensible casse/accents
sortByProperty<T>(array: T[], property: keyof T, direction?: 'asc'|'desc'): T[]
filterBySearch<T>(array: T[], query: string, searchFields: (keyof T)[]): T[]
debounce<T>(func: T, wait: number): T                // Optimisation performance
```

## 📘 Exemples d'utilisation

### 1. Affichage d'une liste de chambres avec filtres

```typescript
import React from "react";
import { useChambres } from "@/hooks";
import { formatCurrency } from "@/utils";

const ChambresList: React.FC = () => {
  const { chambres, loading, error, pagination } = useChambres({
    statut: "libre",
    page: 1,
    limit: 10,
  });

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      {chambres.map((chambre) => (
        <div key={chambre.id}>
          <h3>{chambre.nom}</h3>
          <p>{formatCurrency(chambre.loyer_mensuel)}/mois</p>
          <span className={`statut-${chambre.statut}`}>{chambre.statut}</span>
        </div>
      ))}

      <div>
        Page {pagination.page} sur {pagination.totalPages}
        Total: {pagination.total} chambres
      </div>
    </div>
  );
};
```

### 2. Formulaire de création de locataire

```typescript
import React from "react";
import { useLocatairesActions, useFormState, useNotifications } from "@/hooks";
import { isValidEmail } from "@/utils";

const CreateLocataireForm: React.FC = () => {
  const { createLocataire, loading } = useLocatairesActions();
  const { success, error } = useNotifications();

  const { values, errors, setValue, validate } = useFormState(
    { nom: "", prenom: "", email: "", telephone: "" },
    (data) => {
      const errors: Record<string, string> = {};
      if (!data.nom) errors.nom = "Le nom est requis";
      if (!data.prenom) errors.prenom = "Le prénom est requis";
      if (data.email && !isValidEmail(data.email)) {
        errors.email = "Email invalide";
      }
      return errors;
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createLocataire(values);
      success("Locataire créé avec succès");
    } catch (err) {
      error("Erreur lors de la création");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={values.nom}
        onChange={(e) => setValue("nom", e.target.value)}
        placeholder="Nom"
      />
      {errors.nom && <span className="error">{errors.nom}</span>}

      <input
        value={values.prenom}
        onChange={(e) => setValue("prenom", e.target.value)}
        placeholder="Prénom"
      />
      {errors.prenom && <span className="error">{errors.prenom}</span>}

      <button type="submit" disabled={loading}>
        {loading ? "Création..." : "Créer"}
      </button>
    </form>
  );
};
```

### 3. Dashboard avec statistiques

```typescript
import React from "react";
import { useDashboard } from "@/hooks";
import { formatCurrency, formatPercentage } from "@/utils";

const Dashboard: React.FC = () => {
  const { dashboard, loading, error, refetch } = useDashboard();

  if (loading) return <div>Chargement du dashboard...</div>;
  if (error) return <div>Erreur: {error}</div>;
  if (!dashboard) return null;

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Chambres</h3>
          <p className="stat-value">{dashboard.chambres?.total || 0}</p>
          <p className="stat-detail">
            {dashboard.chambres?.libres || 0} libres
          </p>
        </div>

        <div className="stat-card">
          <h3>Locataires</h3>
          <p className="stat-value">{dashboard.locataires?.total || 0}</p>
          <p className="stat-detail">
            {dashboard.locataires?.actifs || 0} actifs
          </p>
        </div>

        <div className="stat-card">
          <h3>Revenus mensuels</h3>
          <p className="stat-value">
            {formatCurrency(dashboard.resume.revenus_mensuels)}
          </p>
        </div>

        <div className="stat-card">
          <h3>Taux d'occupation</h3>
          <p className="stat-value">
            {formatPercentage(dashboard.resume.taux_occupation_global)}
          </p>
        </div>
      </div>

      <button onClick={refetch}>Actualiser</button>
    </div>
  );
};
```

## 🚀 Prochaines étapes

### 1. Migration des composants existants

- [ ] Convertir les composants JavaScript en TypeScript
- [ ] Ajouter les props types et interfaces
- [ ] Utiliser les nouveaux hooks au lieu des anciens services

### 2. Intégration des services

- [ ] Connecter les composants aux nouveaux services
- [ ] Remplacer les appels API directs par les services
- [ ] Implémenter la gestion d'erreurs globale

### 3. Améliorations

- [ ] Ajouter des tests unitaires pour les services et hooks
- [ ] Implémenter un système de cache pour les données
- [ ] Ajouter la gestion de l'authentification
- [ ] Optimiser les performances avec React.memo et useMemo

### 4. Fonctionnalités avancées

- [ ] Système de notifications en temps réel
- [ ] Export/import de données
- [ ] Rapports et analytics avancés
- [ ] Mode hors ligne avec synchronisation

## 🎯 Avantages de cette architecture

1. **Type Safety**: Prévention des erreurs à la compilation
2. **Maintenabilité**: Code organisé et documentation automatique
3. **Réutilisabilité**: Hooks et services modulaires
4. **Performance**: Optimisations intégrées (debounce, memoization)
5. **Développement**: IntelliSense et autocomplétion
6. **Qualité**: Validation automatique et gestion d'erreurs

Cette architecture TypeScript constitue une base solide pour développer une application React moderne, maintenable et performante pour la gestion immobilière.
