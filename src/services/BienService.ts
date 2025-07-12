import { Bien } from "../types/models";

export interface IBienService {
  list: () => Promise<Bien[]>;
  create: (bien: Partial<Bien>) => Promise<Bien>;
  update: (id: string, data: Partial<Bien>) => Promise<Bien>;
  delete: (id: string) => Promise<void>;
  get: (id: string) => Promise<Bien>;
}

export const BienService: IBienService = {
  list: async () => [],
  create: async (b) => ({
    id: "mock",
    nom: b.nom || "Bien mock",
    adresse: b.adresse || "Adresse mock",
    type: b.type || "appartement",
    surface: b.surface ?? 0,
    nb_pieces: b.nb_pieces ?? 0,
    description: b.description,
    date_acquisition: b.date_acquisition,
  }),
  update: async (id, d) => ({
    id,
    nom: d.nom || "Bien mock",
    adresse: d.adresse || "Adresse mock",
    type: d.type || "appartement",
    surface: d.surface ?? 0,
    nb_pieces: d.nb_pieces ?? 0,
    description: d.description,
    date_acquisition: d.date_acquisition,
  }),
  delete: async (id) => {},
  get: async (id) => ({
    id,
    nom: "Bien mock",
    adresse: "Adresse mock",
    type: "appartement",
    surface: 0,
    nb_pieces: 0,
    description: "",
    date_acquisition: "",
  }),
};
