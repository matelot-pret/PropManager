// ===========================================
// UTILITAIRES DE VALIDATION
// ===========================================

/**
 * Valide un email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valide un numéro de téléphone français
 */
export function isValidPhoneFR(phone: string): boolean {
  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

/**
 * Valide un montant monétaire (positif)
 */
export function isValidAmount(amount: number): boolean {
  return amount >= 0 && Number.isFinite(amount);
}

/**
 * Valide une surface (positive)
 */
export function isValidSurface(surface: number): boolean {
  return surface > 0 && Number.isFinite(surface);
}

/**
 * Valide un âge (entre 16 et 120 ans)
 */
export function isValidAge(age: number): boolean {
  return age >= 16 && age <= 120 && Number.isInteger(age);
}

/**
 * Valide une date (pas dans le futur pour une date de naissance)
 */
export function isValidBirthDate(dateString: string): boolean {
  const birthDate = new Date(dateString);
  const today = new Date();
  return birthDate < today && birthDate > new Date("1900-01-01");
}

// ===========================================
// UTILITAIRES DE FORMATAGE
// ===========================================

/**
 * Formate un montant en euros
 */
export function formatCurrency(amount: number, currency = "EUR"): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Formate un nombre avec séparateurs de milliers
 */
export function formatNumber(number: number): string {
  return new Intl.NumberFormat("fr-FR").format(number);
}

/**
 * Formate une date au format français
 */
export function formatDateFR(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fr-FR").format(date);
}

/**
 * Formate une date pour les inputs HTML
 */
export function formatDateForInput(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
}

/**
 * Formate un numéro de téléphone français
 */
export function formatPhoneFR(phone: string): string {
  const cleaned = phone.replace(/\s+/g, "");
  const match = cleaned.match(/^(?:\+33|0033|0)([1-9](?:\d{8}))$/);

  if (match) {
    const number = match[1];
    return `0${number.slice(0, 1)} ${number.slice(1, 3)} ${number.slice(
      3,
      5
    )} ${number.slice(5, 7)} ${number.slice(7, 9)}`;
  }

  return phone; // Retourne le numéro original si le format n'est pas reconnu
}

/**
 * Formate une surface avec unité
 */
export function formatSurface(surface: number): string {
  return `${formatNumber(surface)} m²`;
}

/**
 * Formate un pourcentage
 */
export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)} %`;
}

// ===========================================
// UTILITAIRES DE CALCUL
// ===========================================

/**
 * Calcule l'âge à partir d'une date de naissance
 */
export function calculateAge(birthDateString: string): number {
  const birthDate = new Date(birthDateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

/**
 * Calcule le rendement locatif annuel
 */
export function calculateRendement(
  revenuAnnuel: number,
  prixAchat: number
): number {
  if (prixAchat === 0) return 0;
  return (revenuAnnuel / prixAchat) * 100;
}

/**
 * Calcule le taux d'occupation
 */
export function calculateTauxOccupation(
  chambresLouees: number,
  totalChambres: number
): number {
  if (totalChambres === 0) return 0;
  return (chambresLouees / totalChambres) * 100;
}

/**
 * Calcule le loyer total (loyer + charges)
 */
export function calculateLoyerTotal(
  loyer: number,
  charges: number = 0
): number {
  return loyer + charges;
}

// ===========================================
// UTILITAIRES DE MANIPULATION DE DONNÉES
// ===========================================

/**
 * Nettoie et normalise une chaîne de caractères
 */
export function cleanString(str: string): string {
  return str.trim().replace(/\s+/g, " ");
}

/**
 * Capitalise la première lettre de chaque mot
 */
export function capitalize(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Génère un ID unique
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Extrait les initiales d'un nom complet
 */
export function getInitials(prenom: string, nom: string): string {
  const prenomInitial = prenom.charAt(0).toUpperCase();
  const nomInitial = nom.charAt(0).toUpperCase();
  return `${prenomInitial}${nomInitial}`;
}

/**
 * Tronque un texte avec des points de suspension
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength - 3)}...`;
}

// ===========================================
// UTILITAIRES DE CONVERSION
// ===========================================

/**
 * Convertit une chaîne en slug (URL-friendly)
 */
export function stringToSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Retire les accents
    .replace(/[^a-z0-9 -]/g, "") // Garde seulement les lettres, chiffres, espaces et tirets
    .replace(/\s+/g, "-") // Remplace les espaces par des tirets
    .replace(/-+/g, "-") // Élimine les tirets multiples
    .trim();
}

/**
 * Convertit un objet en paramètres d'URL
 */
export function objectToQueryString(obj: Record<string, any>): string {
  const params = new URLSearchParams();

  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });

  return params.toString();
}

/**
 * Parse une chaîne de paramètres d'URL en objet
 */
export function queryStringToObject(
  queryString: string
): Record<string, string> {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};

  params.forEach((value, key) => {
    result[key] = value;
  });

  return result;
}

// ===========================================
// UTILITAIRES DE COMPARAISON ET RECHERCHE
// ===========================================

/**
 * Recherche de texte insensible à la casse et aux accents
 */
export function searchText(text: string, query: string): boolean {
  if (!query.trim()) return true;

  const normalizedText = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const normalizedQuery = query
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return normalizedText.includes(normalizedQuery);
}

/**
 * Trie un tableau d'objets par propriété
 */
export function sortByProperty<T>(
  array: T[],
  property: keyof T,
  direction: "asc" | "desc" = "asc"
): T[] {
  return [...array].sort((a, b) => {
    const aValue = a[property];
    const bValue = b[property];

    if (aValue < bValue) return direction === "asc" ? -1 : 1;
    if (aValue > bValue) return direction === "asc" ? 1 : -1;
    return 0;
  });
}

/**
 * Filtre un tableau d'objets par une recherche textuelle
 */
export function filterBySearch<T extends Record<string, any>>(
  array: T[],
  query: string,
  searchFields: (keyof T)[]
): T[] {
  if (!query.trim()) return array;

  return array.filter((item) =>
    searchFields.some((field) => {
      const value = item[field];
      if (typeof value === "string") {
        return searchText(value, query);
      }
      return false;
    })
  );
}

// ===========================================
// UTILITAIRES D'ÉTAT ET DE GESTION
// ===========================================

/**
 * Déboune une fonction
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle une fonction
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Copie profonde d'un objet
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj) as unknown as T;
  if (obj instanceof Array) return obj.map(deepClone) as unknown as T;
  if (typeof obj === "object") {
    const cloned: Record<string, any> = {};
    Object.keys(obj).forEach((key) => {
      cloned[key] = deepClone((obj as Record<string, any>)[key]);
    });
    return cloned as T;
  }
  return obj;
}
