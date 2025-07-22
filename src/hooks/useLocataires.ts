import { useState, useEffect, useCallback } from "react";
import { Locataire, LocataireFilters, PaginatedResponse } from "@/types/models";
import { locataireService } from "@/services";

// ===========================================
// HOOK PRINCIPAL POUR LES LOCATAIRES
// ===========================================

export function useLocataires(filters?: LocataireFilters) {
  const [locataires, setLocataires] = useState<Locataire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    hasNext: false,
    hasPrev: false,
  });

  const fetchLocataires = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await locataireService.getAll(filters);

      if (response.success && response.data) {
        setLocataires(response.data);

        // Si c'est une réponse paginée
        if ("meta" in response) {
          const paginatedResponse = response as PaginatedResponse<Locataire>;
          setPagination({
            page: paginatedResponse.meta.page,
            totalPages: paginatedResponse.meta.pages,
            total: paginatedResponse.meta.total,
            hasNext: paginatedResponse.meta.page < paginatedResponse.meta.pages,
            hasPrev: paginatedResponse.meta.page > 1,
          });
        }
      } else {
        setError(response.error || "Erreur lors du chargement des locataires");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLocataires();
  }, [fetchLocataires]);

  return {
    locataires,
    loading,
    error,
    pagination,
    refetch: fetchLocataires,
  };
}

// ===========================================
// HOOK POUR UN LOCATAIRE SPÉCIFIQUE
// ===========================================

export function useLocataire(id: string | null) {
  const [locataire, setLocataire] = useState<Locataire | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocataire = useCallback(async () => {
    if (!id) {
      setLocataire(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await locataireService.getById(id);

      if (response.success && response.data) {
        setLocataire(response.data);
      } else {
        setError(response.error || "Erreur lors du chargement du locataire");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchLocataire();
  }, [fetchLocataire]);

  return {
    locataire,
    loading,
    error,
    refetch: fetchLocataire,
  };
}

// ===========================================
// HOOK POUR LES STATISTIQUES DES LOCATAIRES
// ===========================================

export function useLocatairesStats() {
  const [stats, setStats] = useState<{
    total: number;
    actifs: number;
    inactifs: number;
    nouveaux_ce_mois: number;
    age_moyen: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await locataireService.getStatistiques();

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
// HOOK POUR LES ACTIONS SUR LES LOCATAIRES
// ===========================================

export function useLocatairesActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createLocataire = useCallback(async (data: any) => {
    try {
      setLoading(true);
      setError(null);

      const validation = locataireService.validateLocataireData(data);
      if (!validation.valid) {
        setError(validation.errors.join(", "));
        throw new Error(validation.errors.join(", "));
      }

      const response = await locataireService.create(data);

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

  const updateLocataire = useCallback(async (id: string, data: any) => {
    try {
      setLoading(true);
      setError(null);

      const validation = locataireService.validateLocataireData(data);
      if (!validation.valid) {
        setError(validation.errors.join(", "));
        throw new Error(validation.errors.join(", "));
      }

      const response = await locataireService.update(id, data);

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

  const deleteLocataire = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await locataireService.delete(id);

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
    async (id: string, statut: Locataire["statut"]) => {
      try {
        setLoading(true);
        setError(null);

        const response = await locataireService.updateStatut(id, statut);

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

  const updateContact = useCallback(
    async (
      id: string,
      contact: Partial<Pick<Locataire, "telephone" | "email">>
    ) => {
      try {
        setLoading(true);
        setError(null);

        const response = await locataireService.updateContact(id, contact);

        if (response.success) {
          return response.data;
        } else {
          setError(
            response.error || "Erreur lors de la mise à jour du contact"
          );
          throw new Error(
            response.error || "Erreur lors de la mise à jour du contact"
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
    createLocataire,
    updateLocataire,
    deleteLocataire,
    updateStatut,
    updateContact,
  };
}

// ===========================================
// HOOK POUR LES LOCATAIRES PAR STATUT
// ===========================================

export function useLocatairesParStatut() {
  const [locatairesActifs, setLocatairesActifs] = useState<Locataire[]>([]);
  const [locatairesInactifs, setLocatairesInactifs] = useState<Locataire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocatairesParStatut = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [actifsResponse, inactifsResponse] = await Promise.all([
        locataireService.getActifs(),
        locataireService.getInactifs(),
      ]);

      if (actifsResponse.success && actifsResponse.data) {
        setLocatairesActifs(actifsResponse.data);
      }

      if (inactifsResponse.success && inactifsResponse.data) {
        setLocatairesInactifs(inactifsResponse.data);
      }

      if (!actifsResponse.success || !inactifsResponse.success) {
        setError("Erreur lors du chargement des locataires par statut");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocatairesParStatut();
  }, [fetchLocatairesParStatut]);

  return {
    locatairesActifs,
    locatairesInactifs,
    loading,
    error,
    refetch: fetchLocatairesParStatut,
  };
}

// ===========================================
// HOOK POUR LA RECHERCHE DE LOCATAIRES
// ===========================================

export function useLocatairesSearch() {
  const [results, setResults] = useState<Locataire[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (terme: string) => {
    if (!terme.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await locataireService.rechercher(terme);

      if (response.success && response.data) {
        setResults(response.data);
      } else {
        setError(response.error || "Erreur lors de la recherche");
        setResults([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    search,
    clearResults,
  };
}
