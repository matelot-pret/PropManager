import { useState, useEffect, useCallback } from 'react';
import { propManagerService } from '@/services';

// ===========================================
// TYPES POUR LE DASHBOARD
// ===========================================

interface DashboardStats {
  biens?: {
    total: number;
    actifs: number;
    inactifs: number;
    revenu_total: number;
    taux_occupation_moyen: number;
    nombre_chambres_total: number;
  };
  chambres?: {
    total: number;
    libres: number;
    louees: number;
    travaux: number;
    revenus_mensuels: number;
    taux_occupation: number;
  };
  locataires?: {
    total: number;
    actifs: number;
    inactifs: number;
    nouveaux_ce_mois: number;
    age_moyen: number;
  };
  resume: {
    total_chambres: number;
    total_locataires: number;
    revenus_mensuels: number;
    taux_occupation_global: number;
  };
}

interface RechercheGlobaleResult {
  biens?: any[];
  locataires?: any[];
  total: number;
}

// ===========================================
// HOOK PRINCIPAL POUR LE DASHBOARD
// ===========================================

export function useDashboard() {
  const [dashboard, setDashboard] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await propManagerService.getDashboard();
      
      if (response.success && response.data) {
        setDashboard(response.data);
      } else {
        setError(response.error || 'Erreur lors du chargement du dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    dashboard,
    loading,
    error,
    refetch: fetchDashboard,
  };
}

// ===========================================
// HOOK POUR LA RECHERCHE GLOBALE
// ===========================================

export function useGlobalSearch() {
  const [results, setResults] = useState<RechercheGlobaleResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (terme: string) => {
    if (!terme.trim()) {
      setResults(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await propManagerService.rechercheGlobale(terme);
      
      if (response.success && response.data) {
        setResults(response.data);
      } else {
        setError(response.error || 'Erreur lors de la recherche');
        setResults(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults(null);
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

// ===========================================
// HOOK POUR LA SYNCHRONISATION DES DONNÉES
// ===========================================

export function useDataSync() {
  const [syncStatus, setSyncStatus] = useState<{
    incoherences: string[];
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const synchronize = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await propManagerService.synchroniserDonnees();
      
      if (response.success && response.data) {
        setSyncStatus(response.data);
      } else {
        setError(response.error || 'Erreur lors de la synchronisation');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    syncStatus,
    loading,
    error,
    synchronize,
  };
}

// ===========================================
// HOOK POUR LA CONNECTIVITÉ
// ===========================================

export function useConnectivity() {
  const [connectivity, setConnectivity] = useState<{
    success: boolean;
    services: Record<string, boolean>;
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkConnectivity = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await propManagerService.verifierConnectivite();
      setConnectivity(result);
      
      if (!result.success) {
        setError(result.message);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
      setConnectivity({
        success: false,
        services: {},
        message,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Vérification automatique au montage du composant
  useEffect(() => {
    checkConnectivity();
  }, [checkConnectivity]);

  return {
    connectivity,
    loading,
    error,
    checkConnectivity,
  };
}

// ===========================================
// HOOK POUR LES RAPPORTS D'ACTIVITÉ
// ===========================================

export function useActivityReport() {
  const [report, setReport] = useState<{
    periode: { debut: string; fin: string };
    nouveaux_locataires: number;
    nouvelles_chambres: number;
    revenus_periode: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReport = useCallback(async (dateDebut: string, dateFin: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await propManagerService.genererRapportActivite(dateDebut, dateFin);
      
      if (response.success && response.data) {
        setReport(response.data);
      } else {
        setError(response.error || 'Erreur lors de la génération du rapport');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    report,
    loading,
    error,
    generateReport,
  };
}

// ===========================================
// HOOK COMBINÉ POUR L'APPLICATION
// ===========================================

export function usePropManager() {
  const dashboard = useDashboard();
  const globalSearch = useGlobalSearch();
  const dataSync = useDataSync();
  const connectivity = useConnectivity();
  const activityReport = useActivityReport();

  const clearCache = useCallback(() => {
    propManagerService.clearCache();
  }, []);

  const configure = useCallback((options: {
    baseUrl?: string;
    timeout?: number;
    retries?: number;
  }) => {
    propManagerService.configure(options);
  }, []);

  return {
    // Modules individuels
    dashboard,
    globalSearch,
    dataSync,
    connectivity,
    activityReport,
    
    // Actions globales
    clearCache,
    configure,
    
    // État global
    isLoading: dashboard.loading || globalSearch.loading || dataSync.loading || connectivity.loading || activityReport.loading,
    hasErrors: !!(dashboard.error || globalSearch.error || dataSync.error || connectivity.error || activityReport.error),
    errors: [
      dashboard.error,
      globalSearch.error,
      dataSync.error,
      connectivity.error,
      activityReport.error,
    ].filter(Boolean) as string[],
  };
}
