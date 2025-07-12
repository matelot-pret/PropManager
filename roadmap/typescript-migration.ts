// ===========================================
// DÉMONSTRATION : Pourquoi TypeScript est ESSENTIEL
// ===========================================

// ❌ Version JavaScript actuelle (dangereuse)
function calculateLoyer(chambre, locataire) {
  // Bugs silencieux possibles :
  return chambre.loyer_mensuel * locataire.nb_mois; // undefined * undefined = NaN
}

// ✅ Version TypeScript (sécurisée)
interface Chambre {
  id: number;
  nom: string;
  loyer_mensuel: number;
  statut: 'libre' | 'louee';
  bien_id: number;
}

interface Locataire {
  id: number;
  nom: string;
  prenom: string;
  chambre_id?: number;
  statut: 'actif' | 'candidat' | 'ancien';
}

interface ContratBail {
  id: number;
  chambre_id: number;
  locataire_id: number;
  loyer_mensuel: number;
  date_debut: string;
  date_fin: string;
  statut: 'actif' | 'expire' | 'resilie';
}

function calculateLoyer(chambre: Chambre, contrat: ContratBail): number {
  // Type safety garantie !
  return contrat.loyer_mensuel; // Le compilateur valide tout
}

// ===========================================
// BÉNÉFICES IMMÉDIATS POUR VOTRE PROJET
// ===========================================

// 1. Détection d'erreurs à la compilation
const chambre: Chambre = {
  id: 1,
  nom: "Chambre 1",
  loyer_mensuel: 500,
  statut: "libre", // TS valide que c'est 'libre' | 'louee'
  bien_id: 1
};

// 2. IntelliSense parfait
chambre. // TS affiche : id, nom, loyer_mensuel, statut, bien_id

// 3. Refactoring sécurisé
// Si vous renommez 'loyer_mensuel' → 'montant_loyer'
// TS vous montre TOUS les endroits à modifier

// 4. Documentation auto-générée
/**
 * Calcule le loyer total avec charges
 * @param chambre - Informations de la chambre
 * @param charges - Charges mensuelles
 * @returns Montant total mensuel
 */
function calculerLoyerTotal(
  chambre: Chambre, 
  charges: number = 0
): number {
  return chambre.loyer_mensuel + charges;
}

// ===========================================
// PLAN DE MIGRATION (2-3 jours max)
// ===========================================

// Jour 1 : Entities
// Convertir tous vos JSON schemas en interfaces TS

// Jour 2 : Components
// Typer les props de vos composants React

// Jour 3 : API calls  
// Typer les retours d'API

// ===========================================
// EXEMPLE CONCRET POUR VOTRE ChambreDetails
// ===========================================

interface ChambreDetailsProps {
  chambreId: string;
  bienId?: string;
}

interface ChambreDetailsState {
  chambre: Chambre | null;
  bien: Bien | null;
  locataire: Locataire | null;
  contrat: ContratBail | null;
  loyers: Loyer[];
  isLoading: boolean;
}

export default function ChambreDetails({ 
  chambreId, 
  bienId 
}: ChambreDetailsProps) {
  const [state, setState] = useState<ChambreDetailsState>({
    chambre: null,
    bien: null,
    locataire: null,
    contrat: null,
    loyers: [],
    isLoading: true
  });
  
  // TypeScript garantit que vous ne pouvez pas faire :
  // state.chambre.loyer_mensuel si chambre est null
  
  return (
    <div>
      {state.chambre && (
        <h1>{state.chambre.nom}</h1> // ✅ Type-safe
      )}
    </div>
  );
}

// ===========================================
// POURQUOI C'EST CRUCIAL POUR L'IMMOBILIER
// ===========================================

// L'immobilier = domaine complexe avec beaucoup de calculs
// • Loyers, charges, taxes
// • Dates de contrats, échéances
// • Surfaces, prix au m²
// • Statuts juridiques

// UNE SEULE erreur de type peut coûter des milliers d'euros !
// TypeScript = assurance qualité GRATUITE
