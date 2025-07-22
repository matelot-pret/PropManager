import { useState, useEffect, useCallback } from "react";
import {
  Chambre,
  ChambreFilters,
  ApiResponse,
  PaginatedResponse,
} from "@/types/models";
import { chambreService } from "@/services";

// ===========================================
// HOOK PRINCIPAL POUR LES CHAMBRES
// ===========================================

export function useChambres(filters?: ChambreFilters) {
  const [chambres, setChambres] = useState<Chambre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    hasNext: false,
    hasPrev: false,
  });

  const fetchChambres = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await chambreService.getAll(filters);

      if (response.success && response.data) {
        setChambres(response.data);

        // Si c'est une réponse paginée
        if ("meta" in response) {
          const paginatedResponse = response as PaginatedResponse<Chambre>;
          setPagination({
            page: paginatedResponse.meta.page,
            totalPages: paginatedResponse.meta.pages,
            total: paginatedResponse.meta.total,
            hasNext: paginatedResponse.meta.page < paginatedResponse.meta.pages,
            hasPrev: paginatedResponse.meta.page > 1,
          });
        }
      } else {
        setError(response.error || "Erreur lors du chargement des chambres");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchChambres();
  }, [fetchChambres]);

  return {
    chambres,
    loading,
    error,
    pagination,
    refetch: fetchChambres,
  };
}

// ===========================================
// HOOK POUR UNE CHAMBRE SPÉCIFIQUE
// ===========================================

export function useChambre(id: string | null) {
  const [chambre, setChambre] = useState<Chambre | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChambre = useCallback(async () => {
    if (!id) {
      setChambre(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await chambreService.getById(id);

      if (response.success && response.data) {
        setChambre(response.data);
      } else {
        setError(response.error || "Erreur lors du chargement de la chambre");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchChambre();
  }, [fetchChambre]);

  return {
    chambre,
    loading,
    error,
    refetch: fetchChambre,
  };
}

// ===========================================
// HOOK POUR LES STATISTIQUES DES CHAMBRES
// ===========================================

export function useChambresStats() {
  const [stats, setStats] = useState<{
    total: number;
    libres: number;
    louees: number;
    travaux: number;
    revenus_mensuels: number;
    taux_occupation: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await chambreService.getStatistiques();

      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError(
          response.error || "Erreur lors du chargement des statistiques"
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}

// ===========================================
// HOOK POUR LES ACTIONS SUR LES CHAMBRES
// ===========================================

export function useChambresActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createChambre = useCallback(async (data: any) => {
    try {
      setLoading(true);
      setError(null);

      const response = await chambreService.create(data);

      if (response.success) {
        return response.data;
      } else {
        setError(response.error || "Erreur lors de la création");
        throw new Error(response.error || "Erreur lors de la création");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateChambre = useCallback(async (id: string, data: any) => {
    try {
      setLoading(true);
      setError(null);

      const response = await chambreService.update(id, data);

      if (response.success) {
        return response.data;
      } else {
        setError(response.error || "Erreur lors de la mise à jour");
        throw new Error(response.error || "Erreur lors de la mise à jour");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteChambre = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await chambreService.delete(id);

      if (!response.success) {
        setError(response.error || "Erreur lors de la suppression");
        throw new Error(response.error || "Erreur lors de la suppression");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatut = useCallback(
    async (id: string, statut: Chambre["statut"]) => {
      try {
        setLoading(true);
        setError(null);

        const response = await chambreService.updateStatut(id, statut);

        if (response.success) {
          return response.data;
        } else {
          setError(response.error || "Erreur lors de la mise à jour du statut");
          throw new Error(
            response.error || "Erreur lors de la mise à jour du statut"
          );
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erreur inconnue";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    createChambre,
    updateChambre,
    deleteChambre,
    updateStatut,
  };
}

// ===========================================
// HOOK POUR LES CHAMBRES PAR STATUT
// ===========================================

export function useChambresParStatut() {
  const [chambresLibres, setChambresLibres] = useState<Chambre[]>([]);
  const [chambresLouees, setChambresLouees] = useState<Chambre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChambresParStatut = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [libresResponse, loueesResponse] = await Promise.all([
        chambreService.getChambresLibres(),
        chambreService.getChambresLouees(),
      ]);

      if (libresResponse.success && libresResponse.data) {
        setChambresLibres(libresResponse.data);
      }

      if (loueesResponse.success && loueesResponse.data) {
        setChambresLouees(loueesResponse.data);
      }

      if (!libresResponse.success || !loueesResponse.success) {
        setError("Erreur lors du chargement des chambres par statut");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChambresParStatut();
  }, [fetchChambresParStatut]);

  return {
    chambresLibres,
    chambresLouees,
    loading,
    error,
    refetch: fetchChambresParStatut,
  };
}
