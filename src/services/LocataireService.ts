import { Locataire, CreateLocataireDto, UpdateLocataireDto, LocataireFilters, ApiResponse, PaginatedResponse } from '@/types/models';

// ===========================================
// INTERFACE DU SERVICE LOCATAIRE
// ===========================================

export interface LocataireServiceInterface {
  // CRUD Operations
  getAll(filters?: LocataireFilters): Promise<PaginatedResponse<Locataire>>;
  getById(id: string): Promise<ApiResponse<Locataire>>;
  create(data: CreateLocataireDto): Promise<ApiResponse<Locataire>>;
  update(id: string, data: UpdateLocataireDto): Promise<ApiResponse<Locataire>>;
  delete(id: string): Promise<ApiResponse<void>>;
  
  // Business Operations
  updateStatut(id: string, statut: Locataire['statut']): Promise<ApiResponse<Locataire>>;
  getActifs(): Promise<ApiResponse<Locataire[]>>;
  getInactifs(): Promise<ApiResponse<Locataire[]>>;
  rechercher(terme: string): Promise<ApiResponse<Locataire[]>>;
  
  // Documents et Contacts
  uploadDocument(id: string, document: File, type: string): Promise<ApiResponse<void>>;
  getDocuments(id: string): Promise<ApiResponse<any[]>>;
  updateContact(id: string, contact: Partial<Pick<Locataire, 'telephone' | 'email'>>): Promise<ApiResponse<Locataire>>;
  
  // Analytics
  getStatistiques(): Promise<ApiResponse<{
    total: number;
    actifs: number;
    inactifs: number;
    nouveaux_ce_mois: number;
    age_moyen: number;
  }>>;
}

// ===========================================
// IMPLÉMENTATION DU SERVICE
// ===========================================

class LocataireService implements LocataireServiceInterface {
  private baseUrl = '/api/locataires';

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

  async getAll(filters?: LocataireFilters): Promise<PaginatedResponse<Locataire>> {
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
    
    return this.request<PaginatedResponse<Locataire>>(endpoint);
  }

  async getById(id: string): Promise<ApiResponse<Locataire>> {
    return this.request<ApiResponse<Locataire>>(`/${id}`);
  }

  async create(data: CreateLocataireDto): Promise<ApiResponse<Locataire>> {
    return this.request<ApiResponse<Locataire>>('', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async update(id: string, data: UpdateLocataireDto): Promise<ApiResponse<Locataire>> {
    return this.request<ApiResponse<Locataire>>(`/${id}`, {
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

  async updateStatut(id: string, statut: Locataire['statut']): Promise<ApiResponse<Locataire>> {
    return this.request<ApiResponse<Locataire>>(`/${id}/statut`, {
      method: 'PATCH',
      body: JSON.stringify({ statut }),
    });
  }

  async getActifs(): Promise<ApiResponse<Locataire[]>> {
    return this.request<ApiResponse<Locataire[]>>('/actifs');
  }

  async getInactifs(): Promise<ApiResponse<Locataire[]>> {
    return this.request<ApiResponse<Locataire[]>>('/inactifs');
  }

  async rechercher(terme: string): Promise<ApiResponse<Locataire[]>> {
    const params = new URLSearchParams({ q: terme });
    return this.request<ApiResponse<Locataire[]>>(`/rechercher?${params.toString()}`);
  }

  // ===========================================
  // DOCUMENTS ET CONTACTS
  // ===========================================

  async uploadDocument(id: string, document: File, type: string): Promise<ApiResponse<void>> {
    const formData = new FormData();
    formData.append('document', document);
    formData.append('type', type);

    const response = await fetch(`${this.baseUrl}/${id}/documents`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async getDocuments(id: string): Promise<ApiResponse<any[]>> {
    return this.request<ApiResponse<any[]>>(`/${id}/documents`);
  }

  async updateContact(
    id: string, 
    contact: Partial<Pick<Locataire, 'telephone' | 'email'>>
  ): Promise<ApiResponse<Locataire>> {
    return this.request<ApiResponse<Locataire>>(`/${id}/contact`, {
      method: 'PATCH',
      body: JSON.stringify(contact),
    });
  }

  // ===========================================
  // ANALYTICS
  // ===========================================

  async getStatistiques(): Promise<ApiResponse<{
    total: number;
    actifs: number;
    inactifs: number;
    nouveaux_ce_mois: number;
    age_moyen: number;
  }>> {
    return this.request<ApiResponse<{
      total: number;
      actifs: number;
      inactifs: number;
      nouveaux_ce_mois: number;
      age_moyen: number;
    }>>('/statistiques');
  }

  // ===========================================
  // MÉTHODES UTILITAIRES
  // ===========================================

  /**
   * Valide les données d'un locataire avant création/mise à jour
   */
  validateLocataireData(data: CreateLocataireDto | UpdateLocataireDto): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if ('nom' in data && (!data.nom || data.nom.trim().length === 0)) {
      errors.push('Le nom est requis');
    }

    if ('prenom' in data && (!data.prenom || data.prenom.trim().length === 0)) {
      errors.push('Le prénom est requis');
    }

    if ('email' in data && data.email && !this.isValidEmail(data.email)) {
      errors.push('L\'email n\'est pas valide');
    }

    if ('telephone' in data && data.telephone && !this.isValidPhone(data.telephone)) {
      errors.push('Le téléphone n\'est pas valide');
    }

    // Validation de l'âge si fourni (propriété optionnelle)
    // Note: date_naissance n'est pas dans l'interface Locataire actuelle
    // Cette validation sera activée quand la propriété sera ajoutée

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Valide un email
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valide un numéro de téléphone
   */
  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  /**
   * Calcule l'âge d'un locataire
   */
  calculateAge(dateNaissance: string): number {
    const birthDate = new Date(dateNaissance);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Formate le nom complet d'un locataire
   */
  formatNomComplet(locataire: Locataire): string {
    return `${locataire.prenom} ${locataire.nom}`;
  }

  /**
   * Formate l'affichage d'un locataire avec statut
   */
  formatLocataireDisplay(locataire: Locataire): string {
    const nomComplet = this.formatNomComplet(locataire);
    const statutDisplay = locataire.statut === 'actif' ? '✓' : '✗';
    return `${nomComplet} ${statutDisplay}`;
  }

  /**
   * Génère un rapport de contact pour un locataire
   */
  generateContactReport(locataire: Locataire): {
    nom_complet: string;
    contacts: string[];
  } {
    return {
      nom_complet: this.formatNomComplet(locataire),
      contacts: [
        locataire.email,
        locataire.telephone,
      ].filter(Boolean) as string[],
    };
  }
}

// ===========================================
// EXPORT ET INSTANCE SINGLETON
// ===========================================

export const locataireService = new LocataireService();
export default locataireService;
