export interface IBien {
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

// Classe Bien avec méthodes statiques mockées pour compatibilité
export class Bien {
  static async list(orderBy?: string): Promise<IBien[]> {
    // Remplacer par l'appel réel à l'API ou au service
    return [];
  }
  static async get(id: string): Promise<IBien | null> {
    return null;
  }
  static async create(data: Partial<IBien>): Promise<IBien> {
    return { ...data, id: "mock" } as IBien;
  }
  static async update(id: string, data: Partial<IBien>): Promise<IBien> {
    return { ...data, id } as IBien;
  }
  static async delete(id: string): Promise<void> {
    return;
  }
}
