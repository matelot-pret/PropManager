import { useState, useEffect, useCallback } from 'react';
import { Bien, BienFilters, PaginatedResponse } from '@/types/models';
import { bienService } from '@/services';

// ===========================================
// HOOK PRINCIPAL POUR LES BIENS
// ===========================================

export function useBiens(filters?: BienFilters) {
  const [biens, setBiens] = useState<Bien[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    hasNext: false,
    hasPrev: false,
  });

  const fetchBiens = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await bienService.getAll(filters);
      
      if (response.success && response.data) {
        setBiens(response.data);
        
        // Si c'est une réponse paginée
        if ('meta' in response) {
          const paginatedResponse = response as PaginatedResponse<Bien>;
          setPagination({
            page: paginatedResponse.meta.page,
            totalPages: paginatedResponse.meta.pages,
            total: paginatedResponse.meta.total,
            hasNext: paginatedResponse.meta.page < paginatedResponse.meta.pages,
            hasPrev: paginatedResponse.meta.page > 1,
          });
        }
      } else {
        setError(response.error || 'Erreur lors du chargement des biens');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchBiens();
  }, [fetchBiens]);

  return {
    biens,
    loading,
    error,
    pagination,
    refetch: fetchBiens,
  };
}

// ===========================================
// HOOK POUR UN BIEN SPÉCIFIQUE
// ===========================================

export function useBien(id: string | null) {
  const [bien, setBien] = useState<Bien | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBien = useCallback(async () => {
    if (!id) {
      setBien(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await bienService.getById(id);
      
      if (response.success && response.data) {
        setBien(response.data);
      } else {
        setError(response.error || 'Erreur lors du chargement du bien');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBien();
  }, [fetchBien]);

  return {
    bien,
    loading,
    error,
    refetch: fetchBien,
  };
}

// ===========================================
// HOOK POUR LES STATISTIQUES DES BIENS
// ===========================================

export function useBiensStats() {
  const [stats, setStats] = useState<{
    total: number;
    actifs: number;
    inactifs: number;
    revenu_total: number;
    taux_occupation_moyen: number;
    nombre_chambres_total: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await bienService.getStatistiques();
      
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError(response.error || 'Erreur lors du chargement des statistiques');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
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
// HOOK POUR LES ACTIONS SUR LES BIENS
// ===========================================

export function useBiensActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBien = useCallback(async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const validation = bienService.validateBienData(data);
      if (!validation.valid) {
        setError(validation.errors.join(', '));
        throw new Error(validation.errors.join(', '));
      }
      
      const response = await bienService.create(data);
      
      if (response.success) {
        return response.data;
      } else {
        setError(response.error || 'Erreur lors de la création');
        throw new Error(response.error || 'Erreur lors de la création');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBien = useCallback(async (id: string, data: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const validation = bienService.validateBienData(data);
      if (!validation.valid) {
        setError(validation.errors.join(', '));
        throw new Error(validation.errors.join(', '));
      }
      
      const response = await bienService.update(id, data);
      
      if (response.success) {
        return response.data;
      } else {
        setError(response.error || 'Erreur lors de la mise à jour');
        throw new Error(response.error || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteBien = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await bienService.delete(id);
      
      if (!response.success) {
        setError(response.error || 'Erreur lors de la suppression');
        throw new Error(response.error || 'Erreur lors de la suppression');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatut = useCallback(async (id: string, statut: Bien['statut']) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await bienService.updateStatut(id, statut);
      
      if (response.success) {
        return response.data;
      } else {
        setError(response.error || 'Erreur lors de la mise à jour du statut');
        throw new Error(response.error || 'Erreur lors de la mise à jour du statut');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createBien,
    updateBien,
    deleteBien,
    updateStatut,
  };
}

// ===========================================
// HOOK POUR LA RECHERCHE DE BIENS
// ===========================================

export function useBiensSearch() {
  const [results, setResults] = useState<Bien[]>([]);
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
      
      const response = await bienService.rechercher(terme);
      
      if (response.success && response.data) {
        setResults(response.data);
      } else {
        setError(response.error || 'Erreur lors de la recherche');
        setResults([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
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
