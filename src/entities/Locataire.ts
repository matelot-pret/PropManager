export interface Locataire {
  id: string;
  prenom: string;
  nom: string;
  email?: string;
  telephone?: string;
  age?: number;
  profession?: string;
  sera_seul?: boolean;
  co_occupants?: Array<{ nom: string; prenom: string; age?: number }>;
  statut?: string;
}
