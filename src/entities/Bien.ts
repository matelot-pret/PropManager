export interface Bien {
  id: string;
  nom: string;
  adresse: string;
  type:
    | "appartement"
    | "maison"
    | "studio"
    | "bureau"
    | "local_commercial"
    | "autre";
  surface?: number;
  nb_pieces?: number;
  description?: string;
  date_acquisition?: string;
}
