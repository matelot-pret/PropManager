// Types explicites pour les modèles
export type Bien = {
  id: string;
  nom: string;
  adresse: string;
  type: string;
  surface: number;
  nb_pieces: number;
  description?: string;
  date_acquisition?: string;
};

export type Chambre = {
  id: string;
  bien_id: string;
  nom: string;
  surface: number;
  loyer_mensuel: number;
  charges_mensuelles?: number;
  type_chambre: string;
  statut: string;
  description?: string;
};

export type Locataire = {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  age: number;
  profession: string;
  sera_seul: boolean;
  chambre_id: string | null;
  statut: string;
  co_occupants?: Array<{
    nom: string;
    sexe: string;
    age: number;
    telephone: string;
  }>;
};

export type Loyer = {
  id: string;
  chambre_id: string;
  mois: number;
  annee: number;
  montant_total: number;
  montant_charges: number;
  date_echeance: string;
  date_paiement?: string | null;
  mode_paiement?: string | null;
  statut: string;
};

export type ContratBail = {
  id: string;
  chambre_id: string;
  locataire_id: string;
  date_debut: string;
  date_fin: string;
  loyer_mensuel: number;
  charges_mensuelles: number;
  depot_garantie: number;
  type_bail: string;
  statut: string;
};
