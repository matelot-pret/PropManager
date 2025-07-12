// ===========================================
// UTILITAIRES DE NAVIGATION - PropManager
// ===========================================

/**
 * Génère une URL de page pour le système de navigation
 * @param {string} pageName - Nom de la page (ex: "Dashboard", "Biens")
 * @param {Object} params - Paramètres URL optionnels
 * @returns {string} URL formatée
 */
export function createPageUrl(pageName, params = {}) {
  // Base URL pour le mode SPA
  const baseUrl = "/";

  // Convertir les paramètres en query string
  const queryString =
    Object.keys(params).length > 0
      ? "?" + new URLSearchParams(params).toString()
      : "";

  // Format : /pageName ou /pageName?params
  return `${baseUrl}${pageName}${queryString}`;
}

/**
 * Génère une URL avec des paramètres de recherche
 * @param {string} pageName - Nom de la page
 * @param {Object} searchParams - Paramètres de recherche
 * @returns {string} URL avec paramètres
 */
export function createPageUrlWithSearch(pageName, searchParams = {}) {
  const params = new URLSearchParams(searchParams);
  return `/${pageName}?${params.toString()}`;
}

/**
 * Utilitaires pour navigation spécifique métier
 */
export const NavigationUtils = {
  // Navigation vers détails d'un bien
  toBienDetails: (bienId) => createPageUrl("BienDetails", { id: bienId }),

  // Navigation vers détails d'une chambre
  toChambreDetails: (chambreId, bienId) =>
    createPageUrl("ChambreDetails", { id: chambreId, bien_id: bienId }),

  // Navigation vers liste avec filtres
  toListWithFilters: (pageName, filters) => createPageUrl(pageName, filters),

  // Navigation retour
  back: () => window.history.back(),

  // Navigation avec remplacement (pas d'historique)
  replace: (pageName, params = {}) => {
    const url = createPageUrl(pageName, params);
    window.history.replaceState(null, "", url);
  },
};

/**
 * Hook personnalisé pour la navigation (si vous utilisez React Router)
 */
export function useNavigation() {
  const navigate = useNavigate?.(); // Optionnel si React Router

  return {
    goTo: (pageName, params = {}) => {
      const url = createPageUrl(pageName, params);
      if (navigate) {
        navigate(url);
      } else {
        window.location.href = url;
      }
    },

    goBack: () => window.history.back(),

    replace: (pageName, params = {}) => {
      const url = createPageUrl(pageName, params);
      if (navigate) {
        navigate(url, { replace: true });
      } else {
        window.location.replace(url);
      }
    },
  };
}

// Export par défaut pour compatibilité
export default createPageUrl;
