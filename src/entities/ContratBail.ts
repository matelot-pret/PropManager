export interface ContratBail {
  id: string;
  chambre_id: string;
  locataire_id: string;
  date_debut: string;
  date_fin?: string;
  loyer_mensuel: number;
  charges_mensuelles?: number;
  depot_garantie?: number;
  type_bail?: "habitation" | "commercial" | "meuble" | "non_meuble";
  duree_mois?: number;
  statut?: string;
}
