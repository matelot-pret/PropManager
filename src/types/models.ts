// ===========================================
// TYPES POUR LES ENTITÉS PRINCIPALES
// ===========================================

export interface Bien {
  id: string;
  nom: string;
  type: "maison" | "appartement" | "studio" | "local_commercial";
  adresse: string;
  surface: number;
  nb_pieces: number;
  loyer_mensuel: number;
  charges: number;
  depot_garantie: number;
  statut: "libre" | "loue" | "travaux" | "vente";
  description?: string;
  date_creation: string;
  date_modification: string;
}

export interface Chambre {
  id: string;
  bien_id: string;
  nom: string;
  surface: number;
  loyer_mensuel: number;
  charges_mensuelles: number;
  type_chambre: "privee" | "partagee" | "studio" | "suite";
  statut: "libre" | "louee" | "travaux" | "reserve";
  description?: string;
  equipements?: string[];
  date_creation: string;
  date_modification: string;
}

export interface Locataire {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  age: number;
  profession: string;
  sera_seul: boolean;
  chambre_id?: string;
  statut: "actif" | "candidat" | "ancien" | "suspendu";
  co_occupants: CoOccupant[];
  date_creation: string;
  date_modification: string;
}

export interface CoOccupant {
  nom: string;
  sexe: "homme" | "femme" | "autre";
  age: number;
  telephone?: string;
  profession?: string;
}

export interface ContratBail {
  id: string;
  chambre_id: string;
  locataire_id: string;
  date_debut: string;
  date_fin: string;
  loyer_mensuel: number;
  charges_mensuelles: number;
  depot_garantie: number;
  type_bail: "meuble" | "non_meuble" | "mixte";
  statut: "actif" | "expire" | "resilie" | "suspendu";
  clauses_specifiques?: string[];
  date_creation: string;
  date_modification: string;
}

export interface Loyer {
  id: string;
  chambre_id: string;
  contrat_id: string;
  mois: number;
  annee: number;
  montant_loyer: number;
  montant_charges: number;
  montant_total: number;
  date_echeance: string;
  date_paiement?: string;
  mode_paiement?: "virement" | "cheque" | "especes" | "carte";
  statut: "en_attente" | "paye" | "en_retard" | "partiel" | "annule";
  montant_paye?: number;
  commentaire?: string;
  date_creation: string;
  date_modification: string;
}

export interface Facture {
  id: string;
  bien_id: string;
  type:
    | "electricite"
    | "gaz"
    | "eau"
    | "internet"
    | "assurance"
    | "taxe"
    | "reparation"
    | "entretien"
    | "autre";
  fournisseur: string;
  montant: number;
  date_facture: string;
  date_echeance: string;
  date_paiement?: string;
  statut: "en_attente" | "payee" | "en_retard" | "contestee";
  numero_facture?: string;
  description?: string;
  fichier_url?: string;
  date_creation: string;
  date_modification: string;
}

export interface Travaux {
  id: string;
  bien_id: string;
  chambre_id?: string;
  titre: string;
  description: string;
  type: "reparation" | "amelioration" | "entretien" | "urgent" | "preventif";
  priorite: "basse" | "normale" | "haute" | "critique";
  statut: "planifie" | "en_cours" | "termine" | "annule" | "reporte";
  cout_estime: number;
  cout_reel?: number;
  date_prevue: string;
  date_debut?: string;
  date_fin?: string;
  entrepreneur?: string;
  contact_entrepreneur?: string;
  garantie_mois?: number;
  photos_avant?: string[];
  photos_apres?: string[];
  factures?: string[];
  date_creation: string;
  date_modification: string;
}

// ===========================================
// TYPES POUR LES RÉPONSES API
// ===========================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    pages?: number;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// ===========================================
// TYPES POUR LES FORMULAIRES
// ===========================================

export type CreateBienDto = Omit<
  Bien,
  "id" | "date_creation" | "date_modification"
>;
export type UpdateBienDto = Partial<CreateBienDto>;

export type CreateChambreDto = Omit<
  Chambre,
  "id" | "date_creation" | "date_modification"
>;
export type UpdateChambreDto = Partial<CreateChambreDto>;

export type CreateLocataireDto = Omit<
  Locataire,
  "id" | "date_creation" | "date_modification"
>;
export type UpdateLocataireDto = Partial<CreateLocataireDto>;

export type CreateContratDto = Omit<
  ContratBail,
  "id" | "date_creation" | "date_modification"
>;
export type UpdateContratDto = Partial<CreateContratDto>;

export type CreateLoyerDto = Omit<
  Loyer,
  "id" | "date_creation" | "date_modification"
>;
export type UpdateLoyerDto = Partial<CreateLoyerDto>;

// ===========================================
// TYPES POUR LES FILTRES ET RECHERCHES
// ===========================================

export interface BienFilters {
  type?: Bien["type"];
  statut?: Bien["statut"];
  surface_min?: number;
  surface_max?: number;
  loyer_min?: number;
  loyer_max?: number;
  ville?: string;
}

export interface ChambreFilters {
  bien_id?: string;
  statut?: Chambre["statut"];
  type_chambre?: Chambre["type_chambre"];
  surface_min?: number;
  surface_max?: number;
  loyer_min?: number;
  loyer_max?: number;
}

export interface LocataireFilters {
  statut?: Locataire["statut"];
  age_min?: number;
  age_max?: number;
  profession?: string;
  chambre_id?: string;
}

export interface LoyerFilters {
  chambre_id?: string;
  contrat_id?: string;
  statut?: Loyer["statut"];
  mois?: number;
  annee?: number;
  date_debut?: string;
  date_fin?: string;
}

// ===========================================
// TYPES POUR LES HOOKS ET CONTEXTES
// ===========================================

export interface UseEntityHookReturn<T> {
  entities: T[];
  loading: boolean;
  error: string | null;
  create: (data: any) => Promise<void>;
  update: (id: string, data: any) => Promise<void>;
  remove: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface SortState {
  field: string;
  direction: "asc" | "desc";
}

export interface TableState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
  sort: SortState;
  filters: Record<string, any>;
}
