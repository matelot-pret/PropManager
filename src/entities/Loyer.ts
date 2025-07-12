export interface Loyer {
  id: string;
  contrat_id: string;
  chambre_id: string;
  locataire_id: string;
  mois: number;
  annee: number;
  montant_loyer: number;
  montant_charges?: number;
  montant_total?: number;
  date_echeance?: string;
  statut?: string;
}
