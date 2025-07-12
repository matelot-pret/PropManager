import { Locataire } from "./Locataire";
import { ContratBail } from "./ContratBail";

export interface Chambre {
  id: string;
  bien_id: string;
  nom: string;
  description?: string;
  surface?: number;
  type_chambre: "privee" | "partagee";
  loyer_mensuel: number;
  statut: "libre" | "louee";
  locataire?: Locataire;
  contrat?: ContratBail;
}
