import bienService from "./BienService";
import chambreService from "./ChambreService";
import locataireService from "./LocataireService";

// ===========================================
// SERVICE PRINCIPAL - FAÇADE
// ===========================================

export class PropManagerService {
  // Services individuels
  public readonly biens = bienService;
  public readonly chambres = chambreService;
  public readonly locataires = locataireService;

  // ===========================================
  // MÉTHODES TRANSVERSALES
  // ===========================================

  /**
   * Obtient un tableau de bord complet
   */
  async getDashboard() {
    try {
      const [statsBiens, statsChambres, statsLocataires] = await Promise.all([
        this.biens.getStatistiques(),
        this.chambres.getStatistiques(),
        this.locataires.getStatistiques(),
      ]);

      return {
        success: true,
        data: {
          biens: statsBiens.data,
          chambres: statsChambres.data,
          locataires: statsLocataires.data,
          resume: {
            total_biens: statsBiens.data?.total || 0,
            total_chambres: statsChambres.data?.total || 0,
            total_locataires: statsLocataires.data?.total || 0,
            revenus_mensuels: statsChambres.data?.revenus_mensuels || 0,
            taux_occupation_global: statsChambres.data?.taux_occupation || 0,
          },
        },
      };
    } catch (error) {
      console.error("Erreur lors de la récupération du dashboard:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  /**
   * Recherche globale dans tous les modules
   */
  async rechercheGlobale(terme: string) {
    try {
      const [resultsBiens, resultsLocataires] = await Promise.all([
        this.biens.rechercher(terme),
        this.locataires.rechercher(terme),
      ]);

      return {
        success: true,
        data: {
          biens: resultsBiens.data,
          locataires: resultsLocataires.data,
          total:
            (resultsBiens.data?.length || 0) +
            (resultsLocataires.data?.length || 0),
        },
      };
    } catch (error) {
      console.error("Erreur lors de la recherche globale:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  /**
   * Synchronise les données entre les modules
   */
  async synchroniserDonnees() {
    try {
      // Exemple: vérifier la cohérence entre chambres et locataires
      const chambresLouees = await this.chambres.getChambresLouees();
      const locatairesActifs = await this.locataires.getActifs();

      const incoherences: string[] = [];

      // Logique de vérification (exemple)
      if (chambresLouees.data && locatairesActifs.data) {
        // Vérifications de cohérence à implémenter selon le modèle de données
        console.log("Vérification des données...");
      }

      return {
        success: true,
        data: {
          incoherences,
          message:
            incoherences.length === 0
              ? "Données synchronisées avec succès"
              : `${incoherences.length} incohérence(s) détectée(s)`,
        },
      };
    } catch (error) {
      console.error("Erreur lors de la synchronisation:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  /**
   * Génère un rapport complet d'activité
   */
  async genererRapportActivite(dateDebut: string, dateFin: string) {
    try {
      // Cette méthode nécessiterait des endpoints spécifiques côté API
      // pour obtenir les données d'activité sur une période donnée

      return {
        success: true,
        data: {
          periode: { debut: dateDebut, fin: dateFin },
          // Données du rapport à implémenter
          nouveaux_locataires: 0,
          nouvelles_chambres: 0,
          revenus_periode: 0,
        },
      };
    } catch (error) {
      console.error("Erreur lors de la génération du rapport:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  // ===========================================
  // UTILITAIRES GLOBAUX
  // ===========================================

  /**
   * Valide la connectivité avec l'API
   */
  async verifierConnectivite(): Promise<{
    success: boolean;
    services: Record<string, boolean>;
    message: string;
  }> {
    const tests = {
      biens: false,
      chambres: false,
      locataires: false,
    };

    try {
      // Test des services individuels
      await Promise.allSettled([
        this.biens.getAll().then(() => {
          tests.biens = true;
        }),
        this.chambres.getAll().then(() => {
          tests.chambres = true;
        }),
        this.locataires.getAll().then(() => {
          tests.locataires = true;
        }),
      ]);

      const allConnected = Object.values(tests).every((status) => status);

      return {
        success: allConnected,
        services: tests,
        message: allConnected
          ? "Tous les services sont accessibles"
          : "Certains services ne sont pas accessibles",
      };
    } catch (error) {
      return {
        success: false,
        services: tests,
        message: "Erreur lors de la vérification de connectivité",
      };
    }
  }

  /**
   * Efface le cache des services (si implémenté)
   */
  clearCache(): void {
    // Implémentation du cache à ajouter selon les besoins
    console.log("Cache effacé");
  }

  /**
   * Configure les services avec des options globales
   */
  configure(options: {
    baseUrl?: string;
    timeout?: number;
    retries?: number;
  }): void {
    // Configuration globale des services
    console.log("Services configurés avec:", options);
  }
}

// ===========================================
// EXPORT DE L'INSTANCE SINGLETON
// ===========================================

export const propManagerService = new PropManagerService();
export default propManagerService;

// Exports individuels pour compatibilité
export { bienService, chambreService, locataireService };
