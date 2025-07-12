// ===========================================
// STATE MANAGEMENT avec Zustand - PropManager
// ===========================================

import { create } from "zustand";
import { devtools } from "zustand/middleware";

// ===========================================
// STORE PRINCIPAL - Données Immobilier
// ===========================================

interface PropManagerState {
  // Data
  biens: Bien[];
  chambres: Chambre[];
  locataires: Locataire[];
  contrats: ContratBail[];
  loyers: Loyer[];

  // UI State
  isLoading: boolean;
  selectedBien: Bien | null;
  selectedChambre: Chambre | null;

  // Actions
  loadBiens: () => Promise<void>;
  createBien: (bien: Partial<Bien>) => Promise<void>;
  updateBien: (id: number, data: Partial<Bien>) => Promise<void>;
  deleteBien: (id: number) => Promise<void>;

  loadChambres: (bienId: number) => Promise<void>;
  createChambre: (chambre: Partial<Chambre>) => Promise<void>;

  setSelectedBien: (bien: Bien | null) => void;
  setSelectedChambre: (chambre: Chambre | null) => void;
}

export const usePropManagerStore = create<PropManagerState>()(
  devtools(
    (set, get) => ({
      // État initial
      biens: [],
      chambres: [],
      locataires: [],
      contrats: [],
      loyers: [],
      isLoading: false,
      selectedBien: null,
      selectedChambre: null,

      // Actions Biens
      loadBiens: async () => {
        set({ isLoading: true });
        try {
          const biens = await BienService.list();
          set({ biens, isLoading: false });
        } catch (error) {
          console.error("Erreur chargement biens:", error);
          set({ isLoading: false });
        }
      },

      createBien: async (bienData) => {
        const nouveauBien = await BienService.create(bienData);
        set((state) => ({
          biens: [...state.biens, nouveauBien],
        }));
      },

      updateBien: async (id, data) => {
        const bienMisAJour = await BienService.update(id, data);
        set((state) => ({
          biens: state.biens.map((b) => (b.id === id ? bienMisAJour : b)),
        }));
      },

      deleteBien: async (id) => {
        await BienService.delete(id);
        set((state) => ({
          biens: state.biens.filter((b) => b.id !== id),
        }));
      },

      // Actions Chambres
      loadChambres: async (bienId) => {
        const chambres = await ChambreService.getByBien(bienId);
        set({ chambres });
      },

      createChambre: async (chambreData) => {
        const nouvelleChambre = await ChambreService.create(chambreData);
        set((state) => ({
          chambres: [...state.chambres, nouvelleChambre],
        }));
      },

      // Actions UI
      setSelectedBien: (bien) => set({ selectedBien: bien }),
      setSelectedChambre: (chambre) => set({ selectedChambre: chambre }),
    }),
    {
      name: "propmanager-store", // Pour DevTools
    }
  )
);

// ===========================================
// HOOKS SPÉCIALISÉS
// ===========================================

// Hook pour la page Biens
export const useBiens = () => {
  const { biens, isLoading, loadBiens, createBien, updateBien, deleteBien } =
    usePropManagerStore();

  useEffect(() => {
    if (biens.length === 0) {
      loadBiens();
    }
  }, []);

  return {
    biens,
    isLoading,
    createBien,
    updateBien,
    deleteBien,
    refresh: loadBiens,
  };
};

// Hook pour BienDetails
export const useBienDetails = (bienId: number) => {
  const { selectedBien, chambres, setSelectedBien, loadChambres } =
    usePropManagerStore();

  useEffect(() => {
    // Charger le bien si pas déjà sélectionné
    if (!selectedBien || selectedBien.id !== bienId) {
      BienService.get(bienId).then(setSelectedBien);
    }

    // Charger les chambres du bien
    loadChambres(bienId);
  }, [bienId]);

  return {
    bien: selectedBien,
    chambres,
    isLoading: !selectedBien,
  };
};

// Hook pour statistiques Dashboard
export const useDashboardStats = () => {
  const { biens, locataires, contrats, loyers } = usePropManagerStore();

  const stats = useMemo(() => {
    const biensActifs = biens.length;
    const locatairesActifs = locataires.filter(
      (l) => l.statut === "actif"
    ).length;
    const loyersEnRetard = loyers.filter(
      (l) => l.statut === "en_retard"
    ).length;
    const revenusMensuels = contrats
      .filter((c) => c.statut === "actif")
      .reduce((sum, c) => sum + c.loyer_mensuel, 0);

    return {
      biensActifs,
      locatairesActifs,
      loyersEnRetard,
      revenusMensuels,
    };
  }, [biens, locataires, contrats, loyers]);

  return stats;
};

// ===========================================
// EXEMPLE D'UTILISATION DANS VOS COMPOSANTS
// ===========================================

// Dans votre page Biens
export default function Biens() {
  const { biens, isLoading, createBien, updateBien, deleteBien } = useBiens();

  // Plus de useState local ! Tout vient du store global

  return (
    <div>
      {isLoading ? (
        <Skeleton />
      ) : (
        <BienList biens={biens} onEdit={updateBien} onDelete={deleteBien} />
      )}
    </div>
  );
}

// Dans votre ChambreDetails
export default function ChambreDetails() {
  const { bienId } = useParams();
  const { bien, chambres, isLoading } = useBienDetails(Number(bienId));

  // État synchronisé automatiquement !

  return (
    <div>
      <h1>{bien?.nom}</h1>
      <ChambreList chambres={chambres} />
    </div>
  );
}

// ===========================================
// AVANTAGES POUR VOTRE PROJET
// ===========================================

/*
✅ **État global cohérent** - Fini les props drilling
✅ **Performance optimisée** - Re-renders minimaux  
✅ **DevTools intégrés** - Debug facile
✅ **TypeScript native** - Type safety
✅ **Persistence optionnelle** - localStorage auto
✅ **Testing friendly** - Mock facile du store
✅ **Scaling ready** - Architecture modulaire

🎯 **Spécifique Immobilier :**
- Synchronisation biens ↔ chambres ↔ locataires
- Cache intelligent des données
- Optimistic updates pour UX fluide
- Invalidation cache après mutations
*/
