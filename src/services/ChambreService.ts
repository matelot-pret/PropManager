import { Chambre, CreateChambreDto, UpdateChambreDto, ChambreFilters, ApiResponse, PaginatedResponse } from '@/types/models';

// ===========================================
// INTERFACE DU SERVICE CHAMBRE
// ===========================================

export interface ChambreServiceInterface {
  // CRUD Operations
  getAll(filters?: ChambreFilters): Promise<PaginatedResponse<Chambre>>;
  getById(id: string): Promise<ApiResponse<Chambre>>;
  getByBienId(bienId: string): Promise<ApiResponse<Chambre[]>>;
  create(data: CreateChambreDto): Promise<ApiResponse<Chambre>>;
  update(id: string, data: UpdateChambreDto): Promise<ApiResponse<Chambre>>;
  delete(id: string): Promise<ApiResponse<void>>;
  
  // Business Operations
  updateStatut(id: string, statut: Chambre['statut']): Promise<ApiResponse<Chambre>>;
  updateLoyer(id: string, loyer: number, charges?: number): Promise<ApiResponse<Chambre>>;
  getChambresLibres(bienId?: string): Promise<ApiResponse<Chambre[]>>;
  getChambresLouees(bienId?: string): Promise<ApiResponse<Chambre[]>>;
  
  // Analytics
  getStatistiques(): Promise<ApiResponse<{
    total: number;
    libres: number;
    louees: number;
    travaux: number;
    revenus_mensuels: number;
    taux_occupation: number;
  }>>;
}

// ===========================================
// IMPLÉMENTATION DU SERVICE
// ===========================================

class ChambreService implements ChambreServiceInterface {
  private baseUrl = '/api/chambres';

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

  async getAll(filters?: ChambreFilters): Promise<PaginatedResponse<Chambre>> {
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
    
    return this.request<PaginatedResponse<Chambre>>(endpoint);
  }

  async getById(id: string): Promise<ApiResponse<Chambre>> {
    return this.request<ApiResponse<Chambre>>(`/${id}`);
  }

  async getByBienId(bienId: string): Promise<ApiResponse<Chambre[]>> {
    return this.request<ApiResponse<Chambre[]>>(`/bien/${bienId}`);
  }

  async create(data: CreateChambreDto): Promise<ApiResponse<Chambre>> {
    return this.request<ApiResponse<Chambre>>('', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async update(id: string, data: UpdateChambreDto): Promise<ApiResponse<Chambre>> {
    return this.request<ApiResponse<Chambre>>(`/${id}`, {
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

  async updateStatut(id: string, statut: Chambre['statut']): Promise<ApiResponse<Chambre>> {
    return this.request<ApiResponse<Chambre>>(`/${id}/statut`, {
      method: 'PATCH',
      body: JSON.stringify({ statut }),
    });
  }

  async updateLoyer(id: string, loyer: number, charges?: number): Promise<ApiResponse<Chambre>> {
    const data: Partial<Chambre> = { loyer_mensuel: loyer };
    if (charges !== undefined) {
      data.charges_mensuelles = charges;
    }

    return this.request<ApiResponse<Chambre>>(`/${id}/loyer`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async getChambresLibres(bienId?: string): Promise<ApiResponse<Chambre[]>> {
    const params = new URLSearchParams({ statut: 'libre' });
    if (bienId) {
      params.append('bien_id', bienId);
    }
    
    return this.request<ApiResponse<Chambre[]>>(`/libres?${params.toString()}`);
  }

  async getChambresLouees(bienId?: string): Promise<ApiResponse<Chambre[]>> {
    const params = new URLSearchParams({ statut: 'louee' });
    if (bienId) {
      params.append('bien_id', bienId);
    }
    
    return this.request<ApiResponse<Chambre[]>>(`/louees?${params.toString()}`);
  }

  async getStatistiques(): Promise<ApiResponse<{
    total: number;
    libres: number;
    louees: number;
    travaux: number;
    revenus_mensuels: number;
    taux_occupation: number;
  }>> {
    return this.request<ApiResponse<{
      total: number;
      libres: number;
      louees: number;
      travaux: number;
      revenus_mensuels: number;
      taux_occupation: number;
    }>>('/statistiques');
  }

  // ===========================================
  // MÉTHODES UTILITAIRES
  // ===========================================

  /**
   * Valide les données d'une chambre avant création/mise à jour
   */
  validateChambreData(data: CreateChambreDto | UpdateChambreDto): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if ('nom' in data && (!data.nom || data.nom.trim().length === 0)) {
      errors.push('Le nom de la chambre est requis');
    }

    if ('surface' in data && (data.surface === undefined || data.surface <= 0)) {
      errors.push('La surface doit être supérieure à 0');
    }

    if ('loyer_mensuel' in data && (data.loyer_mensuel === undefined || data.loyer_mensuel < 0)) {
      errors.push('Le loyer mensuel ne peut pas être négatif');
    }

    if ('charges_mensuelles' in data && data.charges_mensuelles !== undefined && data.charges_mensuelles < 0) {
      errors.push('Les charges mensuelles ne peuvent pas être négatives');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Calcule le loyer total (loyer + charges)
   */
  calculateLoyerTotal(chambre: Chambre): number {
    return chambre.loyer_mensuel + (chambre.charges_mensuelles || 0);
  }

  /**
   * Formate l'affichage d'une chambre
   */
  formatChambreDisplay(chambre: Chambre): string {
    const loyerTotal = this.calculateLoyerTotal(chambre);
    return `${chambre.nom} - ${chambre.surface}m² - ${loyerTotal}€/mois`;
  }
}

// ===========================================
// EXPORT ET INSTANCE SINGLETON
// ===========================================

export const chambreService = new ChambreService();
export default chambreService;
