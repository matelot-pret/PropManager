import { Bien, CreateBienDto, UpdateBienDto, BienFilters, ApiResponse, PaginatedResponse } from '@/types/models';

// ===========================================
// INTERFACE DU SERVICE BIEN
// ===========================================

export interface BienServiceInterface {
  // CRUD Operations
  getAll(filters?: BienFilters): Promise<PaginatedResponse<Bien>>;
  getById(id: string): Promise<ApiResponse<Bien>>;
  create(data: CreateBienDto): Promise<ApiResponse<Bien>>;
  update(id: string, data: UpdateBienDto): Promise<ApiResponse<Bien>>;
  delete(id: string): Promise<ApiResponse<void>>;
  
  // Business Operations
  getWithChambres(id: string): Promise<ApiResponse<Bien & { chambres: any[] }>>;
  updateStatut(id: string, statut: Bien['statut']): Promise<ApiResponse<Bien>>;
  getRevenuMensuel(id: string): Promise<ApiResponse<{ revenu: number }>>;
  getTauxOccupation(id: string): Promise<ApiResponse<{ taux: number }>>;
  
  // Analytics
  getStatistiques(): Promise<ApiResponse<{
    total: number;
    actifs: number;
    inactifs: number;
    revenu_total: number;
    taux_occupation_moyen: number;
    nombre_chambres_total: number;
  }>>;
  
  // Utilitaires
  rechercher(terme: string): Promise<ApiResponse<Bien[]>>;
  getByProximite(latitude: number, longitude: number, rayon: number): Promise<ApiResponse<Bien[]>>;
}

// ===========================================
// IMPLÉMENTATION DU SERVICE
// ===========================================

class BienService implements BienServiceInterface {
  private baseUrl = '/api/biens';

  // Utilitaire pour les requêtes HTTP
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erreur lors de la requête ${endpoint}:`, error);
      throw error;
    }
  }

  // ===========================================
  // MÉTHODES CRUD
  // ===========================================

  async getAll(filters?: BienFilters): Promise<PaginatedResponse<Bien>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    
    const queryString = params.toString();
    const endpoint = queryString ? `?${queryString}` : '';
    
    return this.request<PaginatedResponse<Bien>>(endpoint);
  }

  async getById(id: string): Promise<ApiResponse<Bien>> {
    return this.request<ApiResponse<Bien>>(`/${id}`);
  }

  async create(data: CreateBienDto): Promise<ApiResponse<Bien>> {
    return this.request<ApiResponse<Bien>>('', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async update(id: string, data: UpdateBienDto): Promise<ApiResponse<Bien>> {
    return this.request<ApiResponse<Bien>>(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>(`/${id}`, {
      method: 'DELETE',
    });
  }

  // ===========================================
  // MÉTHODES MÉTIER
  // ===========================================

  async getWithChambres(id: string): Promise<ApiResponse<Bien & { chambres: any[] }>> {
    return this.request<ApiResponse<Bien & { chambres: any[] }>>(`/${id}/chambres`);
  }

  async updateStatut(id: string, statut: Bien['statut']): Promise<ApiResponse<Bien>> {
    return this.request<ApiResponse<Bien>>(`/${id}/statut`, {
      method: 'PATCH',
      body: JSON.stringify({ statut }),
    });
  }

  async getRevenuMensuel(id: string): Promise<ApiResponse<{ revenu: number }>> {
    return this.request<ApiResponse<{ revenu: number }>>(`/${id}/revenu`);
  }

  async getTauxOccupation(id: string): Promise<ApiResponse<{ taux: number }>> {
    return this.request<ApiResponse<{ taux: number }>>(`/${id}/occupation`);
  }

  async getStatistiques(): Promise<ApiResponse<{
    total: number;
    actifs: number;
    inactifs: number;
    revenu_total: number;
    taux_occupation_moyen: number;
    nombre_chambres_total: number;
  }>> {
    return this.request<ApiResponse<{
      total: number;
      actifs: number;
      inactifs: number;
      revenu_total: number;
      taux_occupation_moyen: number;
      nombre_chambres_total: number;
    }>>('/statistiques');
  }

  async rechercher(terme: string): Promise<ApiResponse<Bien[]>> {
    const params = new URLSearchParams({ q: terme });
    return this.request<ApiResponse<Bien[]>>(`/rechercher?${params.toString()}`);
  }

  async getByProximite(
    latitude: number, 
    longitude: number, 
    rayon: number
  ): Promise<ApiResponse<Bien[]>> {
    const params = new URLSearchParams({
      lat: latitude.toString(),
      lng: longitude.toString(),
      rayon: rayon.toString(),
    });
    return this.request<ApiResponse<Bien[]>>(`/proximite?${params.toString()}`);
  }

  // ===========================================
  // MÉTHODES UTILITAIRES
  // ===========================================

  /**
   * Valide les données d'un bien avant création/mise à jour
   */
  validateBienData(data: CreateBienDto | UpdateBienDto): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if ('nom' in data && (!data.nom || data.nom.trim().length === 0)) {
      errors.push('Le nom du bien est requis');
    }

    if ('adresse' in data && (!data.adresse || data.adresse.trim().length === 0)) {
      errors.push('L\'adresse est requise');
    }

    if ('type' in data && data.type && !this.isValidBienType(data.type)) {
      errors.push('Le type de bien n\'est pas valide');
    }

    if ('surface' in data && data.surface !== undefined && data.surface <= 0) {
      errors.push('La surface doit être supérieure à 0');
    }

    if ('nb_pieces' in data && data.nb_pieces !== undefined && data.nb_pieces < 0) {
      errors.push('Le nombre de pièces ne peut pas être négatif');
    }

    if ('loyer_mensuel' in data && data.loyer_mensuel !== undefined && data.loyer_mensuel < 0) {
      errors.push('Le loyer mensuel ne peut pas être négatif');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Valide le type de bien
   */
  private isValidBienType(type: string): boolean {
    const validTypes = ['maison', 'appartement', 'studio', 'local_commercial'];
    return validTypes.includes(type);
  }

  /**
   * Calcule le rendement locatif d'un bien
   */
  calculateRendementLocatif(bien: Bien): number {
    if (!bien.depot_garantie || bien.depot_garantie === 0) {
      return 0;
    }
    
    const revenuAnnuel = bien.loyer_mensuel * 12;
    return (revenuAnnuel / bien.depot_garantie) * 100;
  }

  /**
   * Formate l'affichage d'un bien
   */
  formatBienDisplay(bien: Bien): string {
    const pieces = bien.nb_pieces ? ` - ${bien.nb_pieces} pièces` : '';
    const surface = bien.surface ? ` - ${bien.surface}m²` : '';
    return `${bien.nom}${pieces}${surface}`;
  }

  /**
   * Génère un résumé financier pour un bien
   */
  generateResumeFinancier(bien: Bien): {
    bien_nom: string;
    loyer_mensuel: number;
    charges: number;
    depot_garantie: number;
    revenu_annuel_brut: number;
    rendement: number;
  } {
    const revenuAnnuelBrut = bien.loyer_mensuel * 12;
    const rendement = this.calculateRendementLocatif(bien);

    return {
      bien_nom: bien.nom,
      loyer_mensuel: bien.loyer_mensuel,
      charges: bien.charges,
      depot_garantie: bien.depot_garantie,
      revenu_annuel_brut: revenuAnnuelBrut,
      rendement: rendement,
    };
  }

  /**
   * Valide une adresse (format basique)
   */
  validateAdresse(adresse: string): boolean {
    return adresse.trim().length >= 10 && /\d/.test(adresse);
  }

  /**
   * Génère des recommandations pour un bien
   */
  generateRecommandations(bien: Bien): string[] {
    const recommandations: string[] = [];

    if (!bien.depot_garantie) {
      recommandations.push('Renseigner le dépôt de garantie pour calculer le rendement');
    }

    if (!bien.surface) {
      recommandations.push('Indiquer la surface pour une meilleure valorisation');
    }

    if (!bien.nb_pieces || bien.nb_pieces === 0) {
      recommandations.push('Préciser le nombre de pièces');
    }

    if (bien.statut === 'travaux') {
      recommandations.push('Finaliser les travaux pour remettre en location');
    }

    if (bien.loyer_mensuel === 0) {
      recommandations.push('Définir le loyer mensuel');
    }

    return recommandations;
  }
}

// ===========================================
// EXPORT ET INSTANCE SINGLETON
// ===========================================

export const bienService = new BienService();
export default bienService;
