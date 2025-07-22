"use strict";
// ===========================================
// CONFIGURATION DES CHEMINS D'ACCÈS
// ===========================================

const PATHS = {
  // Chemins racine du projet
  ROOT: "c:\\Users\\samou\\Documents\\projetPerso\\PropManager",

  // Dossiers principaux
  COMPONENTS:
    "c:\\Users\\samou\\Documents\\projetPerso\\PropManager\\Components",
  PAGES: "c:\\Users\\samou\\Documents\\projetPerso\\PropManager\\Pages",
  ENTITIES: "c:\\Users\\samou\\Documents\\projetPerso\\PropManager\\Entities",

  // Sous-dossiers Components
  COMPONENTS_BIENS:
    "c:\\Users\\samou\\Documents\\projetPerso\\PropManager\\Components\\Biens",
  COMPONENTS_CHAMBRES:
    "c:\\Users\\samou\\Documents\\projetPerso\\PropManager\\Components\\Chambres",
  COMPONENTS_LOCATAIRES:
    "c:\\Users\\samou\\Documents\\projetPerso\\PropManager\\Components\\Locataires",
  COMPONENTS_DASHBOARD:
    "c:\\Users\\samou\\Documents\\projetPerso\\PropManager\\Components\\Dashboard",
  COMPONENTS_UI:
    "c:\\Users\\samou\\Documents\\projetPerso\\PropManager\\Components\\ui",

  // Fichiers spécifiques souvent utilisés
  LAYOUT: "c:\\Users\\samou\\Documents\\projetPerso\\PropManager\\Layout.js",

  // Chemins relatifs pour imports (à partir de chaque contexte)
  RELATIVE: {
    // Depuis Pages vers Components
    PAGES_TO_COMPONENTS: "../Components",
    PAGES_TO_COMPONENTS_BIENS: "../Components/Biens",
    PAGES_TO_COMPONENTS_CHAMBRES: "../Components/Chambres",
    PAGES_TO_COMPONENTS_LOCATAIRES: "../Components/Locataires",
    PAGES_TO_COMPONENTS_DASHBOARD: "../Components/Dashboard",

    // Depuis Components vers Entities
    COMPONENTS_TO_ENTITIES: "../Entities",

    // Alias pour imports absolus (quand configuré)
    ALIAS_COMPONENTS: "@/components",
    ALIAS_ENTITIES: "@/entities",
    ALIAS_UTILS: "@/utils",
    ALIAS_UI: "@/components/ui",
  },
};

// ===========================================
// UTILITAIRES POUR CHEMINS
// ===========================================

const PathUtils = {
  // Construit un chemin complet
  buildPath: (basePath, ...segments) => {
    return [basePath, ...segments].join("\\");
  },

  // Convertit un chemin Windows en chemin Unix pour les imports
  toUnixPath: (windowsPath) => {
    return windowsPath.replace(/\\/g, "/");
  },

  // Obtient le chemin relatif depuis un dossier vers un autre
  getRelativePath: (from, to) => {
    // Logique simplifiée pour les cas courants du projet
    if (from.includes("Pages") && to.includes("Components")) {
      return PATHS.RELATIVE.PAGES_TO_COMPONENTS;
    }
    return to;
  },

  // Résout un import selon le contexte
  resolveImport: (from, target) => {
    switch (target) {
      case "components/ui":
        return PATHS.RELATIVE.ALIAS_UI;
      case "entities":
        return PATHS.RELATIVE.ALIAS_ENTITIES;
      case "utils":
        return PATHS.RELATIVE.ALIAS_UTILS;
      default:
        return target;
    }
  },

  // Fonction helper pour modifier facilement l'emplacement du projet
  updateProjectLocation: (newRootPath) => {
    PATHS.ROOT = newRootPath;
    PATHS.COMPONENTS = `${newRootPath}\\Components`;
    PATHS.PAGES = `${newRootPath}\\Pages`;
    PATHS.ENTITIES = `${newRootPath}\\Entities`;
    PATHS.COMPONENTS_BIENS = `${newRootPath}\\Components\\Biens`;
    PATHS.COMPONENTS_CHAMBRES = `${newRootPath}\\Components\\Chambres`;
    PATHS.COMPONENTS_LOCATAIRES = `${newRootPath}\\Components\\Locataires`;
    PATHS.COMPONENTS_DASHBOARD = `${newRootPath}\\Components\\Dashboard`;
    PATHS.COMPONENTS_UI = `${newRootPath}\\Components\\ui`;
    PATHS.LAYOUT = `${newRootPath}\\Layout.js`;

    console.log("✅ Projet déplacé vers:", newRootPath);
    console.log("📁 Nouveaux chemins:", PATHS);
  },
};

// ===========================================
// INSTRUCTIONS POUR CHANGER L'EMPLACEMENT
// ===========================================
/*
      🎯 POUR DÉPLACER VOTRE PROJET :
      
      1. Changez uniquement la ligne PATHS.ROOT ci-dessus (ligne ~31)
      2. Exemple pour déplacer vers le Desktop :
         ROOT: "c:\\Users\\samou\\Desktop\\PropManager",
      
      3. Ou utilisez la fonction helper :
         PathUtils.updateProjectLocation("D:\\MesProjets\\PropManager");
      
      📁 POUR CHANGER LA STRUCTURE DES DOSSIERS :
      
      1. Modifiez les noms dans PATHS :
         COMPONENTS: "c:\\...\\src\\components",  // au lieu de Components
         PAGES: "c:\\...\\src\\pages",           // au lieu de Pages
         ENTITIES: "c:\\...\\src\\entities",     // au lieu de Entities
      
      ⚡ EXEMPLES D'UTILISATION :
      
      - Chemin vers composants: PATHS.COMPONENTS
      - Chemin vers entités: PATHS.ENTITIES  
      - Import relatif: PATHS.RELATIVE.PAGES_TO_COMPONENTS
      - Import avec alias: PATHS.RELATIVE.ALIAS_UI
      
      🔧 TOUS LES CHEMINS UTILISÉS DANS CE FICHIER :
      Les références suivantes utilisent les variables PATHS :
      - Ligne ~XXX : Navigation sidebar
      - Ligne ~XXX : Imports de composants  
      - Ligne ~XXX : Références aux entités
      */

// ===========================================
// DONNÉES DE DÉMONSTRATION
// ===========================================

const mockBiens = [
  {
    id: 1,
    nom: "Maison Anderlecht",
    type: "maison",
    adresse: "Rue des Tournesols 29, 1070 Anderlecht",
    surface: 85,
    nb_pieces: 6,
    loyer_mensuel: 1200,
    charges: 150,
    depot_garantie: 2400,
    statut: "loue",
    description:
      "Maison dans la commune d'Anderlecht avec 4 chambres, 1 cuisine et 1 salon",
  },
  {
    id: 2,
    nom: "Maison Charleroi",
    type: "maison",
    adresse: "Grand'Rue 38, 6100 Montignies-Sur-Sambre",
    surface: 125,
    nb_pieces: 7,
    loyer_mensuel: 800,
    charges: 80,
    depot_garantie: 1600,
    statut: "libre",
    description:
      "Maison nouvellement rénové avec 5 chambres, 1 cuisine, 1 salon dans la commune de Montignies-Sur-Sambre",
  },
];

const mockChambres = [
  {
    id: 1,
    bien_id: 1,
    nom: "Chambre 1",
    surface: 15,
    loyer_mensuel: 600,
    charges_mensuelles: 50,
    type_chambre: "privee",
    statut: "louee",
    description: "Chambre spacieuse avec douche partagée",
  },
  {
    id: 2,
    bien_id: 1,
    nom: "Chambre 2",
    surface: 12,
    loyer_mensuel: 550,
    charges_mensuelles: 50,
    type_chambre: "privee",
    statut: "libre",
    description: "Chambre cosy avec douche partagée",
  },
  {
    id: 3,
    bien_id: 1,
    nom: "Chambre 3",
    surface: 14,
    loyer_mensuel: 580,
    charges_mensuelles: 50,
    type_chambre: "privee",
    statut: "libre",
    description: "Chambre avec douche partagée",
  },
  {
    id: 4,
    bien_id: 1,
    nom: "Chambre Master",
    surface: 20,
    loyer_mensuel: 750,
    charges_mensuelles: 70,
    type_chambre: "privee",
    statut: "louee",
    description: "Grande chambre avec douche privée incluse",
  },
  {
    id: 5,
    bien_id: 2,
    nom: "Chambre A",
    surface: 12,
    loyer_mensuel: 400,
    charges_mensuelles: 40,
    type_chambre: "privee",
    statut: "libre",
    description: "Chambre avec douche partagée",
  },
  {
    id: 6,
    bien_id: 2,
    nom: "Chambre B",
    surface: 13,
    loyer_mensuel: 420,
    charges_mensuelles: 40,
    type_chambre: "privee",
    statut: "libre",
    description: "Chambre avec douche partagée",
  },
  {
    id: 7,
    bien_id: 2,
    nom: "Chambre C",
    surface: 11,
    loyer_mensuel: 380,
    charges_mensuelles: 40,
    type_chambre: "privee",
    statut: "libre",
    description: "Chambre avec douche partagée",
  },
  {
    id: 8,
    bien_id: 2,
    nom: "Chambre D",
    surface: 12,
    loyer_mensuel: 400,
    charges_mensuelles: 40,
    type_chambre: "privee",
    statut: "libre",
    description: "Chambre avec douche partagée",
  },
  {
    id: 9,
    bien_id: 2,
    nom: "Suite Parentale",
    surface: 18,
    loyer_mensuel: 500,
    charges_mensuelles: 50,
    type_chambre: "privee",
    statut: "libre",
    description: "Chambre avec douche privée incluse",
  },
];

const mockLocataires = [
  {
    id: 1,
    prenom: "Marie",
    nom: "Dupont",
    email: "marie.dupont@email.com",
    telephone: "06 12 34 56 78",
    age: 28,
    profession: "Ingénieure",
    sera_seul: false,
    chambre_id: 1,
    statut: "actif",
    co_occupants: [
      {
        nom: "Pierre Martin",
        sexe: "homme",
        age: 30,
        telephone: "06 87 65 43 21",
      },
    ],
  },
  {
    id: 2,
    prenom: "Thomas",
    nom: "Bernard",
    email: "thomas.bernard@email.com",
    telephone: "07 98 76 54 32",
    age: 24,
    profession: "Étudiant",
    sera_seul: true,
    chambre_id: 4,
    statut: "actif",
    co_occupants: [],
  },
  {
    id: 3,
    prenom: "Sophie",
    nom: "Leroy",
    email: "sophie.leroy@email.com",
    telephone: "06 45 67 89 12",
    age: 32,
    profession: "Designer",
    sera_seul: true,
    chambre_id: null,
    statut: "candidat",
    co_occupants: [],
  },
];

const mockLoyers = [
  {
    id: 1,
    chambre_id: 1,
    mois: 7,
    annee: 2025,
    montant_total: 650,
    montant_charges: 50,
    date_echeance: "2025-07-05",
    date_paiement: "2025-07-03",
    mode_paiement: "virement",
    statut: "paye",
  },
  {
    id: 2,
    chambre_id: 1,
    mois: 6,
    annee: 2025,
    montant_total: 650,
    montant_charges: 50,
    date_echeance: "2025-06-05",
    date_paiement: null,
    mode_paiement: null,
    statut: "en_retard",
  },
  {
    id: 3,
    chambre_id: 4,
    mois: 7,
    annee: 2025,
    montant_total: 820,
    montant_charges: 70,
    date_echeance: "2025-07-05",
    date_paiement: "2025-07-04",
    mode_paiement: "virement",
    statut: "paye",
  },
  {
    id: 4,
    chambre_id: 4,
    mois: 6,
    annee: 2025,
    montant_total: 820,
    montant_charges: 70,
    date_echeance: "2025-06-05",
    date_paiement: "2025-06-02",
    mode_paiement: "virement",
    statut: "paye",
  },
  {
    id: 5,
    chambre_id: 1,
    mois: 8,
    annee: 2025,
    montant_total: 650,
    montant_charges: 50,
    date_echeance: "2025-08-05",
    date_paiement: null,
    mode_paiement: null,
    statut: "en_attente",
  },
];

const mockContrats = [
  {
    id: 1,
    chambre_id: 1,
    locataire_id: 1,
    date_debut: "2025-01-01",
    date_fin: "2025-12-31",
    loyer_mensuel: 600,
    charges_mensuelles: 50,
    depot_garantie: 1200,
    type_bail: "meuble",
    statut: "actif",
  },
  {
    id: 2,
    chambre_id: 4,
    locataire_id: 2,
    date_debut: "2025-03-01",
    date_fin: "2026-02-28",
    loyer_mensuel: 750,
    charges_mensuelles: 70,
    depot_garantie: 1500,
    type_bail: "non_meuble",
    statut: "actif",
  },
];

// ===========================================
// DONNÉES ET CONSTANTES
// ===========================================

const moisNoms = [
  "",
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const statutColors = {
  paye: "bg-green-100 text-green-800 border-green-200",
  en_attente: "bg-yellow-100 text-yellow-800 border-yellow-200",
  en_retard: "bg-red-100 text-red-800 border-red-200",
  partiel: "bg-orange-100 text-orange-800 border-orange-200",
};

const statusColors = {
  libre: "bg-green-100 text-green-800 border-green-200",
  louee: "bg-blue-100 text-blue-800 border-blue-200",
  loue: "bg-blue-100 text-blue-800 border-blue-200",
};

// ===========================================
// COMPOSANTS PRINCIPAUX
// ===========================================

// Navigation Sidebar
const Sidebar = ({ currentPage, onPageChange }) => {
  const navigationItems = [
    { title: "Dashboard", icon: "🏠", key: "dashboard" },
    { title: "Mes Biens", icon: "🏢", key: "biens" },
    { title: "Locataires", icon: "👥", key: "locataires" },
    { title: "Chambres", icon: "🛏️", key: "chambres" },
    { title: "Loyers", icon: "💰", key: "loyers" },
  ];

  return React.createElement(
    "div",
    {
      className:
        "w-64 bg-white shadow-xl border-r border-slate-200 h-screen fixed left-0 top-0 flex flex-col",
    },
    [
      // Header
      React.createElement(
        "div",
        {
          key: "header",
          className: "p-6 border-b border-slate-200",
        },
        [
          React.createElement(
            "div",
            {
              key: "logo",
              className: "flex items-center gap-3",
            },
            [
              React.createElement(
                "div",
                {
                  key: "icon",
                  className:
                    "w-10 h-10 luxury-gradient rounded-xl flex items-center justify-center shadow-lg",
                },
                React.createElement(
                  "span",
                  { className: "text-white text-xl" },
                  "🏢"
                )
              ),
              React.createElement("div", { key: "text" }, [
                React.createElement(
                  "h2",
                  {
                    key: "title",
                    className: "font-bold text-slate-900 text-lg",
                  },
                  "Ger'immo"
                ),
                React.createElement(
                  "p",
                  {
                    key: "subtitle",
                    className: "text-xs text-slate-500 font-medium",
                  },
                  "Gestion Locative Premium"
                ),
              ]),
            ]
          ),
        ]
      ),

      // Navigation
      React.createElement(
        "nav",
        {
          key: "nav",
          className: "flex-1 p-4",
        },
        [
          React.createElement(
            "div",
            {
              key: "nav-label",
              className:
                "text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-3",
            },
            "Navigation"
          ),
          React.createElement(
            "div",
            {
              key: "nav-items",
              className: "space-y-1",
            },
            navigationItems.map((item) =>
              React.createElement(
                "button",
                {
                  key: item.key,
                  onClick: () => onPageChange(item.key),
                  className: `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    currentPage === item.key
                      ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm border border-blue-200"
                      : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                  }`,
                },
                [
                  React.createElement(
                    "span",
                    { key: "icon", className: "text-lg" },
                    item.icon
                  ),
                  React.createElement(
                    "span",
                    { key: "title", className: "font-medium" },
                    item.title
                  ),
                ]
              )
            )
          ),
        ]
      ),

      // Stats rapides
      React.createElement(
        "div",
        {
          key: "stats",
          className: "p-4 border-t border-slate-200",
        },
        [
          React.createElement(
            "div",
            {
              key: "stats-label",
              className:
                "text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-3",
            },
            "Aperçu Rapide"
          ),
          React.createElement(
            "div",
            {
              key: "stats-content",
              className: "space-y-4 px-4",
            },
            [
              React.createElement(
                "div",
                {
                  key: "biens",
                  className: "flex items-center justify-between text-sm",
                },
                [
                  React.createElement(
                    "span",
                    { key: "label", className: "text-slate-600" },
                    "Biens Actifs"
                  ),
                  React.createElement(
                    "span",
                    {
                      key: "value",
                      className: "font-bold text-slate-900",
                    },
                    mockBiens.length
                  ),
                ]
              ),
              React.createElement(
                "div",
                {
                  key: "locataires",
                  className: "flex items-center justify-between text-sm",
                },
                [
                  React.createElement(
                    "span",
                    { key: "label", className: "text-slate-600" },
                    "Locataires"
                  ),
                  React.createElement(
                    "span",
                    {
                      key: "value",
                      className: "font-bold text-slate-900",
                    },
                    mockLocataires.filter((l) => l.statut === "actif").length
                  ),
                ]
              ),
              React.createElement(
                "div",
                {
                  key: "revenus",
                  className: "flex items-center justify-between text-sm",
                },
                [
                  React.createElement(
                    "span",
                    { key: "label", className: "text-slate-600" },
                    "Revenus Mensuels"
                  ),
                  React.createElement(
                    "span",
                    {
                      key: "value",
                      className: "font-bold text-green-600",
                    },
                    `${mockChambres
                      .filter((c) => c.statut === "louee")
                      .reduce(
                        (total, c) =>
                          total + c.loyer_mensuel + c.charges_mensuelles,
                        0
                      )} €`
                  ),
                ]
              ),
            ]
          ),
        ]
      ),
    ]
  );
};

// Page Dashboard
const DashboardPage = () => {
  const statsCards = [
    {
      title: "Biens Immobiliers",
      value: mockBiens.length,
      icon: "🏢",
      color: "blue",
    },
    {
      title: "Locataires Actifs",
      value: mockLocataires.filter((l) => l.statut === "actif").length,
      icon: "👥",
      color: "green",
    },
    {
      title: "Revenus Mensuels",
      value: `${mockChambres
        .filter((c) => c.statut === "louee")
        .reduce(
          (total, c) => total + c.loyer_mensuel + c.charges_mensuelles,
          0
        )} €`,
      icon: "💰",
      color: "purple",
    },
    {
      title: "Loyers en Retard",
      value: mockLoyers.filter(
        (l) => l.statut === "en_retard" || l.statut === "en_attente"
      ).length,
      icon: "⚠️",
      color: "red",
    },
  ];

  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-emerald-500 to-emerald-600",
    purple: "from-purple-500 to-purple-600",
    red: "from-red-500 to-red-600",
  };

  return React.createElement(
    "div",
    {
      className: "space-y-8",
    },
    [
      // Header
      React.createElement("div", { key: "header" }, [
        React.createElement(
          "h1",
          {
            key: "title",
            className: "text-4xl font-bold text-slate-900 mb-2",
          },
          "Tableau de Bord"
        ),
        React.createElement(
          "p",
          {
            key: "subtitle",
            className: "text-slate-600 text-lg",
          },
          "Vue d'ensemble de votre patrimoine immobilier"
        ),
      ]),

      // Stats Cards
      React.createElement(
        "div",
        {
          key: "stats",
          className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
        },
        statsCards.map((stat, index) =>
          React.createElement(
            "div",
            {
              key: index,
              className: "bg-white rounded-lg shadow-lg p-6 border-0",
            },
            [
              React.createElement(
                "div",
                {
                  key: "content",
                  className: "flex items-center justify-between",
                },
                [
                  React.createElement("div", { key: "text" }, [
                    React.createElement(
                      "p",
                      {
                        key: "title",
                        className: "text-sm font-medium text-slate-500 mb-1",
                      },
                      stat.title
                    ),
                    React.createElement(
                      "p",
                      {
                        key: "value",
                        className: "text-3xl font-bold text-slate-900",
                      },
                      stat.value
                    ),
                  ]),
                  React.createElement(
                    "div",
                    {
                      key: "icon",
                      className: `w-12 h-12 bg-gradient-to-r ${
                        colorClasses[stat.color]
                      } rounded-lg flex items-center justify-center shadow-lg`,
                    },
                    React.createElement(
                      "span",
                      { className: "text-white text-2xl" },
                      stat.icon
                    )
                  ),
                ]
              ),
            ]
          )
        )
      ),

      // Recent Activity
      React.createElement(
        "div",
        {
          key: "activity",
          className: "grid lg:grid-cols-3 gap-8",
        },
        [
          React.createElement(
            "div",
            {
              key: "main",
              className: "lg:col-span-2",
            },
            [
              React.createElement(
                "div",
                {
                  key: "financial",
                  className: "bg-white rounded-lg shadow-lg p-6 mb-8",
                },
                [
                  React.createElement(
                    "h3",
                    {
                      key: "title",
                      className:
                        "text-xl font-bold text-slate-900 mb-4 flex items-center gap-2",
                    },
                    [
                      React.createElement("span", { key: "icon" }, "💰"),
                      "Résumé Financier",
                    ]
                  ),
                  React.createElement(
                    "div",
                    {
                      key: "content",
                      className: "grid md:grid-cols-3 gap-6",
                    },
                    [
                      React.createElement("div", { key: "revenus" }, [
                        React.createElement(
                          "p",
                          {
                            key: "label",
                            className: "text-sm font-medium text-slate-500",
                          },
                          "Revenus ce Mois"
                        ),
                        React.createElement(
                          "p",
                          {
                            key: "value",
                            className: "text-2xl font-bold text-slate-900",
                          },
                          `${mockChambres
                            .filter((c) => c.statut === "louee")
                            .reduce(
                              (total, c) =>
                                total + c.loyer_mensuel + c.charges_mensuelles,
                              0
                            )} €`
                        ),
                        React.createElement(
                          "div",
                          {
                            key: "trend",
                            className:
                              "flex items-center text-green-600 text-sm",
                          },
                          [
                            React.createElement("span", { key: "arrow" }, "↗"),
                            React.createElement(
                              "span",
                              { key: "text" },
                              "+12%"
                            ),
                          ]
                        ),
                      ]),
                      React.createElement("div", { key: "charges" }, [
                        React.createElement(
                          "p",
                          {
                            key: "label",
                            className: "text-sm font-medium text-slate-500",
                          },
                          "Charges & Frais"
                        ),
                        React.createElement(
                          "p",
                          {
                            key: "value",
                            className: "text-2xl font-bold text-slate-900",
                          },
                          `${mockChambres
                            .filter((c) => c.statut === "louee")
                            .reduce(
                              (total, c) => total + c.charges_mensuelles,
                              0
                            )} €`
                        ),
                        React.createElement(
                          "div",
                          {
                            key: "trend",
                            className:
                              "flex items-center text-orange-600 text-sm",
                          },
                          [
                            React.createElement("span", { key: "arrow" }, "↗"),
                            React.createElement("span", { key: "text" }, "+5%"),
                          ]
                        ),
                      ]),
                      React.createElement("div", { key: "net" }, [
                        React.createElement(
                          "p",
                          {
                            key: "label",
                            className: "text-sm font-medium text-slate-500",
                          },
                          "Bénéfice Net"
                        ),
                        React.createElement(
                          "p",
                          {
                            key: "value",
                            className: "text-2xl font-bold text-green-600",
                          },
                          `${mockChambres
                            .filter((c) => c.statut === "louee")
                            .reduce(
                              (total, c) => total + c.loyer_mensuel,
                              0
                            )} €`
                        ),
                        React.createElement(
                          "div",
                          {
                            key: "trend",
                            className:
                              "flex items-center text-green-600 text-sm",
                          },
                          [
                            React.createElement("span", { key: "arrow" }, "↗"),
                            React.createElement(
                              "span",
                              { key: "text" },
                              "+15%"
                            ),
                          ]
                        ),
                      ]),
                    ]
                  ),
                ]
              ),

              React.createElement(
                "div",
                {
                  key: "loyers-section",
                  className: "bg-white rounded-lg shadow-lg p-6",
                },
                [
                  React.createElement(
                    "h3",
                    {
                      key: "title",
                      className:
                        "text-xl font-bold text-slate-900 mb-4 flex items-center gap-2",
                    },
                    [
                      React.createElement("span", { key: "icon" }, "📋"),
                      "État des Loyers",
                    ]
                  ),
                  React.createElement(
                    "div",
                    {
                      key: "loyers-summary",
                      className: "space-y-4",
                    },
                    [
                      React.createElement(
                        "div",
                        {
                          key: "stats-grid",
                          className: "grid grid-cols-2 gap-4",
                        },
                        [
                          React.createElement(
                            "div",
                            {
                              key: "payes",
                              className:
                                "text-center p-3 bg-green-50 rounded-lg",
                            },
                            [
                              React.createElement(
                                "div",
                                {
                                  key: "number",
                                  className:
                                    "text-2xl font-bold text-green-600",
                                },
                                mockLoyers.filter((l) => l.statut === "paye")
                                  .length
                              ),
                              React.createElement(
                                "div",
                                {
                                  key: "label",
                                  className: "text-sm text-green-800",
                                },
                                "Payés"
                              ),
                            ]
                          ),
                          React.createElement(
                            "div",
                            {
                              key: "en-attente",
                              className:
                                "text-center p-3 bg-yellow-50 rounded-lg",
                            },
                            [
                              React.createElement(
                                "div",
                                {
                                  key: "number",
                                  className:
                                    "text-2xl font-bold text-yellow-600",
                                },
                                mockLoyers.filter(
                                  (l) =>
                                    l.statut === "en_attente" ||
                                    l.statut === "en_retard"
                                ).length
                              ),
                              React.createElement(
                                "div",
                                {
                                  key: "label",
                                  className: "text-sm text-yellow-800",
                                },
                                "En attente/Retard"
                              ),
                            ]
                          ),
                        ]
                      ),
                      React.createElement(
                        "div",
                        {
                          key: "recent-payments",
                          className: "space-y-2",
                        },
                        [
                          React.createElement(
                            "h4",
                            {
                              key: "subtitle",
                              className: "font-semibold text-slate-700 text-sm",
                            },
                            "Derniers paiements"
                          ),
                          ...mockLoyers
                            .filter((l) => l.statut === "paye")
                            .slice(-3)
                            .map((loyer, index) => {
                              const chambre = mockChambres.find(
                                (c) => c.id === loyer.chambre_id
                              );
                              const locataire = mockLocataires.find(
                                (l) => l.chambre_id === loyer.chambre_id
                              );
                              return React.createElement(
                                "div",
                                {
                                  key: `payment-${index}`,
                                  className:
                                    "flex justify-between items-center text-sm bg-slate-50 p-2 rounded",
                                },
                                [
                                  React.createElement(
                                    "span",
                                    { key: "info" },
                                    `${locataire?.prenom} ${locataire?.nom} - ${chambre?.nom}`
                                  ),
                                  React.createElement(
                                    "span",
                                    {
                                      key: "montant",
                                      className: "font-semibold text-green-600",
                                    },
                                    `${loyer.montant_total} €`
                                  ),
                                ]
                              );
                            }),
                        ]
                      ),
                    ]
                  ),
                ]
              ),
            ]
          ),

          React.createElement(
            "div",
            {
              key: "sidebar",
              className: "space-y-6",
            },
            [
              React.createElement(
                "div",
                {
                  key: "overview",
                  className: "bg-white rounded-lg shadow-lg p-6",
                },
                [
                  React.createElement(
                    "h3",
                    {
                      key: "title",
                      className:
                        "text-xl font-bold text-slate-900 mb-4 flex items-center gap-2",
                    },
                    [
                      React.createElement("span", { key: "icon" }, "🏢"),
                      "Aperçu des Biens",
                    ]
                  ),
                  React.createElement(
                    "div",
                    {
                      key: "content",
                      className: "space-y-3",
                    },
                    [
                      React.createElement(
                        "div",
                        {
                          key: "appartements",
                          className:
                            "flex items-center justify-between text-sm",
                        },
                        [
                          React.createElement(
                            "span",
                            {
                              key: "label",
                              className:
                                "flex items-center gap-2 text-slate-600",
                            },
                            [
                              React.createElement(
                                "span",
                                { key: "icon" },
                                "🏠"
                              ),
                              "Appartements",
                            ]
                          ),
                          React.createElement(
                            "span",
                            {
                              key: "value",
                              className: "font-semibold",
                            },
                            mockBiens.filter((b) => b.type === "appartement")
                              .length
                          ),
                        ]
                      ),
                      React.createElement(
                        "div",
                        {
                          key: "studios",
                          className:
                            "flex items-center justify-between text-sm",
                        },
                        [
                          React.createElement(
                            "span",
                            {
                              key: "label",
                              className:
                                "flex items-center gap-2 text-slate-600",
                            },
                            [
                              React.createElement(
                                "span",
                                { key: "icon" },
                                "🏠"
                              ),
                              "Studios",
                            ]
                          ),
                          React.createElement(
                            "span",
                            {
                              key: "value",
                              className: "font-semibold",
                            },
                            mockBiens.filter((b) => b.type === "studio").length
                          ),
                        ]
                      ),
                      React.createElement(
                        "div",
                        {
                          key: "maisons",
                          className:
                            "flex items-center justify-between text-sm",
                        },
                        [
                          React.createElement(
                            "span",
                            {
                              key: "label",
                              className:
                                "flex items-center gap-2 text-slate-600",
                            },
                            [
                              React.createElement(
                                "span",
                                { key: "icon" },
                                "🏘️"
                              ),
                              "Maisons",
                            ]
                          ),
                          React.createElement(
                            "span",
                            {
                              key: "value",
                              className: "font-semibold",
                            },
                            mockBiens.filter((b) => b.type === "maison").length
                          ),
                        ]
                      ),
                      React.createElement(
                        "div",
                        {
                          key: "occupation",
                          className:
                            "flex items-center justify-between text-sm",
                        },
                        [
                          React.createElement(
                            "span",
                            {
                              key: "label",
                              className:
                                "flex items-center gap-2 text-slate-600",
                            },
                            [
                              React.createElement(
                                "span",
                                { key: "icon" },
                                "👥"
                              ),
                              "Taux d'occupation",
                            ]
                          ),
                          React.createElement(
                            "span",
                            {
                              key: "value",
                              className: "font-semibold",
                            },
                            mockChambres.length > 0
                              ? `${Math.round(
                                  (mockChambres.filter(
                                    (c) => c.statut === "louee"
                                  ).length /
                                    mockChambres.length) *
                                    100
                                )}%`
                              : "0%"
                          ),
                        ]
                      ),
                    ]
                  ),
                ]
              ),
            ]
          ),
        ]
      ),
    ]
  );
};

// Page Biens
const BiensPage = ({ onGererChambres }) => {
  return React.createElement(
    "div",
    {
      className: "space-y-8",
    },
    [
      React.createElement(
        "div",
        {
          key: "header",
          className: "flex justify-between items-center",
        },
        [
          React.createElement("div", { key: "title" }, [
            React.createElement(
              "h1",
              {
                key: "h1",
                className: "text-4xl font-bold text-slate-900 mb-2",
              },
              "Mes Biens"
            ),
            React.createElement(
              "p",
              {
                key: "p",
                className: "text-slate-600 text-lg",
              },
              "Gérez votre patrimoine immobilier"
            ),
          ]),
          React.createElement(
            "button",
            {
              key: "button",
              className:
                "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2",
            },
            [
              React.createElement("span", { key: "icon" }, "+"),
              React.createElement("span", { key: "text" }, "Nouveau Bien"),
            ]
          ),
        ]
      ),

      React.createElement(
        "div",
        {
          key: "grid",
          className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6",
        },
        mockBiens.map((bien) =>
          React.createElement(
            "div",
            {
              key: bien.id,
              className:
                "bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border-0",
            },
            [
              React.createElement(
                "div",
                {
                  key: "header",
                  className: "p-6 pb-4",
                },
                [
                  React.createElement(
                    "div",
                    {
                      key: "title-row",
                      className: "flex items-center gap-3",
                    },
                    [
                      React.createElement(
                        "div",
                        {
                          key: "icon",
                          className:
                            "w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg",
                        },
                        React.createElement(
                          "span",
                          { className: "text-white text-2xl" },
                          "🏢"
                        )
                      ),
                      React.createElement("div", { key: "info" }, [
                        React.createElement(
                          "h3",
                          {
                            key: "nom",
                            className: "text-lg font-bold text-slate-900",
                          },
                          bien.nom
                        ),
                        React.createElement(
                          "p",
                          {
                            key: "type",
                            className: "text-sm text-slate-500 capitalize",
                          },
                          bien.type
                        ),
                      ]),
                    ]
                  ),
                ]
              ),

              React.createElement(
                "div",
                {
                  key: "content",
                  className: "p-6 pt-0 space-y-4",
                },
                [
                  React.createElement(
                    "div",
                    {
                      key: "address",
                      className: "flex items-center gap-2 text-slate-600",
                    },
                    [
                      React.createElement("span", { key: "icon" }, "📍"),
                      React.createElement(
                        "p",
                        {
                          key: "text",
                          className: "text-sm truncate",
                        },
                        bien.adresse
                      ),
                    ]
                  ),

                  React.createElement(
                    "div",
                    {
                      key: "details",
                      className: "space-y-3 text-sm",
                    },
                    [
                      React.createElement(
                        "div",
                        {
                          key: "surface",
                          className: "flex items-center gap-2 text-slate-600",
                        },
                        [
                          React.createElement("span", { key: "icon" }, "📐"),
                          React.createElement(
                            "span",
                            { key: "text" },
                            `${bien.surface} m²`
                          ),
                        ]
                      ),
                      React.createElement(
                        "div",
                        {
                          key: "pieces",
                          className: "flex items-center gap-2 text-slate-600",
                        },
                        [
                          React.createElement("span", { key: "icon" }, "🏠"),
                          React.createElement(
                            "span",
                            { key: "text" },
                            `${bien.nb_pieces} pièces`
                          ),
                        ]
                      ),
                      React.createElement(
                        "div",
                        {
                          key: "chambres-stats",
                          className: "flex items-center gap-2 text-slate-600",
                        },
                        [
                          React.createElement("span", { key: "icon" }, "�️"),
                          React.createElement(
                            "span",
                            { key: "text" },
                            `${
                              mockChambres.filter(
                                (c) =>
                                  c.bien_id === bien.id && c.statut === "louee"
                              ).length
                            }/${
                              mockChambres.filter((c) => c.bien_id === bien.id)
                                .length
                            } chambres occupées`
                          ),
                        ]
                      ),
                      React.createElement(
                        "div",
                        {
                          key: "revenus",
                          className:
                            "flex items-center gap-2 text-green-600 font-semibold",
                        },
                        [
                          React.createElement("span", { key: "icon" }, "💰"),
                          React.createElement(
                            "span",
                            { key: "text" },
                            `${mockChambres
                              .filter(
                                (c) =>
                                  c.bien_id === bien.id && c.statut === "louee"
                              )
                              .reduce(
                                (total, c) =>
                                  total +
                                  c.loyer_mensuel +
                                  c.charges_mensuelles,
                                0
                              )} € /mois`
                          ),
                        ]
                      ),
                      React.createElement(
                        "div",
                        {
                          key: "statut",
                          className: "flex items-center gap-2",
                        },
                        [
                          React.createElement(
                            "span",
                            {
                              key: "badge",
                              className: `px-2 py-1 rounded-full text-xs font-medium ${
                                statusColors[bien.statut]
                              }`,
                            },
                            bien.statut === "loue"
                              ? "Partiellement loué"
                              : "Libre"
                          ),
                        ]
                      ),
                    ]
                  ),
                ]
              ),

              React.createElement(
                "div",
                {
                  key: "footer",
                  className: "p-6 pt-0 border-t mt-auto",
                },
                [
                  React.createElement(
                    "div",
                    {
                      key: "actions",
                      className: "flex gap-2 pt-4",
                    },
                    [
                      React.createElement(
                        "button",
                        {
                          key: "modifier",
                          className:
                            "flex-1 border border-slate-300 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 px-3 py-2 rounded text-sm flex items-center justify-center gap-2",
                        },
                        [
                          React.createElement("span", { key: "icon" }, "✏️"),
                          React.createElement(
                            "span",
                            { key: "text" },
                            "Modifier"
                          ),
                        ]
                      ),
                      React.createElement(
                        "button",
                        {
                          key: "supprimer",
                          className:
                            "flex-1 border border-slate-300 hover:bg-red-50 hover:border-red-200 hover:text-red-700 px-3 py-2 rounded text-sm flex items-center justify-center gap-2",
                        },
                        [
                          React.createElement("span", { key: "icon" }, "🗑️"),
                          React.createElement(
                            "span",
                            { key: "text" },
                            "Supprimer"
                          ),
                        ]
                      ),
                    ]
                  ),
                  React.createElement(
                    "button",
                    {
                      key: "chambres",
                      className:
                        "w-full bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded mt-2 flex items-center justify-center gap-2",
                      onClick: () =>
                        onGererChambres && onGererChambres(bien.id),
                    },
                    [
                      React.createElement(
                        "span",
                        { key: "text" },
                        "Gérer les chambres"
                      ),
                      React.createElement("span", { key: "icon" }, "→"),
                    ]
                  ),
                ]
              ),
            ]
          )
        )
      ),
    ]
  );
};

// Page Locataires
const LocatairesPage = () => {
  return React.createElement(
    "div",
    {
      className: "space-y-8",
    },
    [
      React.createElement(
        "div",
        {
          key: "header",
          className: "flex justify-between items-center",
        },
        [
          React.createElement("div", { key: "title" }, [
            React.createElement(
              "h1",
              {
                key: "h1",
                className: "text-4xl font-bold text-slate-900 mb-2",
              },
              "Locataires"
            ),
            React.createElement(
              "p",
              {
                key: "p",
                className: "text-slate-600 text-lg",
              },
              "Gérez vos locataires et candidats"
            ),
          ]),
          React.createElement(
            "button",
            {
              key: "button",
              className:
                "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2",
            },
            [
              React.createElement("span", { key: "icon" }, "+"),
              React.createElement("span", { key: "text" }, "Nouveau Locataire"),
            ]
          ),
        ]
      ),

      React.createElement(
        "div",
        {
          key: "grid",
          className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6",
        },
        mockLocataires.map((locataire) =>
          React.createElement(
            "div",
            {
              key: locataire.id,
              className:
                "bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border-0",
            },
            [
              React.createElement(
                "div",
                {
                  key: "header",
                  className: "p-6",
                },
                [
                  React.createElement(
                    "div",
                    {
                      key: "profile",
                      className: "flex items-center gap-4",
                    },
                    [
                      React.createElement(
                        "div",
                        {
                          key: "avatar",
                          className:
                            "w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center",
                        },
                        React.createElement(
                          "span",
                          { className: "text-slate-600 text-xl" },
                          "👤"
                        )
                      ),
                      React.createElement("div", { key: "info" }, [
                        React.createElement(
                          "h3",
                          {
                            key: "nom",
                            className: "text-lg font-bold text-slate-900",
                          },
                          `${locataire.prenom} ${locataire.nom}`
                        ),
                        React.createElement(
                          "p",
                          {
                            key: "profession",
                            className: "text-sm text-slate-500",
                          },
                          locataire.profession
                        ),
                        React.createElement(
                          "span",
                          {
                            key: "statut",
                            className: `inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                              locataire.statut === "actif"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`,
                          },
                          locataire.statut === "actif" ? "Actif" : "Candidat"
                        ),
                      ]),
                    ]
                  ),
                ]
              ),

              React.createElement(
                "div",
                {
                  key: "content",
                  className: "p-6 pt-0 space-y-3",
                },
                [
                  React.createElement(
                    "div",
                    {
                      key: "email",
                      className:
                        "flex items-center gap-2 text-sm text-slate-600",
                    },
                    [
                      React.createElement("span", { key: "icon" }, "📧"),
                      React.createElement(
                        "span",
                        { key: "text" },
                        locataire.email
                      ),
                    ]
                  ),
                  React.createElement(
                    "div",
                    {
                      key: "phone",
                      className:
                        "flex items-center gap-2 text-sm text-slate-600",
                    },
                    [
                      React.createElement("span", { key: "icon" }, "📞"),
                      React.createElement(
                        "span",
                        { key: "text" },
                        locataire.telephone
                      ),
                    ]
                  ),
                  locataire.chambre_id &&
                    React.createElement(
                      "div",
                      {
                        key: "chambre",
                        className:
                          "flex items-center gap-2 text-sm text-slate-600 pt-2",
                      },
                      [
                        React.createElement(
                          "span",
                          { key: "icon", className: "text-blue-500" },
                          "🛏️"
                        ),
                        React.createElement(
                          "span",
                          {
                            key: "text",
                            className: "font-medium",
                          },
                          "Loue une chambre"
                        ),
                      ]
                    ),
                  !locataire.sera_seul &&
                    locataire.co_occupants &&
                    locataire.co_occupants.length > 0 &&
                    React.createElement(
                      "div",
                      {
                        key: "co-occupants",
                        className: "bg-blue-50 p-3 rounded-lg mt-3",
                      },
                      [
                        React.createElement(
                          "p",
                          {
                            key: "label",
                            className:
                              "text-xs font-semibold text-blue-800 mb-1",
                          },
                          `${locataire.co_occupants.length} Co-occupant(s)`
                        ),
                        ...locataire.co_occupants.map((co, index) =>
                          React.createElement(
                            "p",
                            {
                              key: index,
                              className: "text-sm text-blue-700",
                            },
                            `${co.nom} (${co.age} ans)`
                          )
                        ),
                      ]
                    ),
                ]
              ),

              React.createElement(
                "div",
                {
                  key: "footer",
                  className: "p-6 pt-0 flex gap-2",
                },
                [
                  React.createElement(
                    "button",
                    {
                      key: "modifier",
                      className:
                        "flex-1 border border-slate-300 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 px-3 py-2 rounded text-sm flex items-center justify-center gap-2",
                    },
                    [
                      React.createElement("span", { key: "icon" }, "✏️"),
                      React.createElement("span", { key: "text" }, "Modifier"),
                    ]
                  ),
                  React.createElement(
                    "button",
                    {
                      key: "supprimer",
                      className:
                        "flex-1 border border-slate-300 text-red-600 hover:bg-red-50 hover:border-red-200 hover:text-red-700 px-3 py-2 rounded text-sm flex items-center justify-center gap-2",
                    },
                    [
                      React.createElement("span", { key: "icon" }, "🗑️"),
                      React.createElement("span", { key: "text" }, "Supprimer"),
                    ]
                  ),
                ]
              ),
            ]
          )
        )
      ),
    ]
  );
};

// Page Chambres
const ChambresPage = ({ selectedBienId, onRetourBiens }) => {
  const chambresToShow = selectedBienId
    ? mockChambres.filter((c) => c.bien_id === selectedBienId)
    : mockChambres;

  const selectedBien = selectedBienId
    ? mockBiens.find((b) => b.id === selectedBienId)
    : null;

  return React.createElement(
    "div",
    {
      className: "space-y-8",
    },
    [
      React.createElement(
        "div",
        {
          key: "header",
          className: "flex justify-between items-center",
        },
        [
          React.createElement("div", { key: "title" }, [
            selectedBien &&
              React.createElement(
                "button",
                {
                  key: "back-button",
                  onClick: onRetourBiens,
                  className:
                    "flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 text-sm font-medium",
                },
                [
                  React.createElement("span", { key: "arrow" }, "←"),
                  React.createElement(
                    "span",
                    { key: "text" },
                    "Retour aux biens"
                  ),
                ]
              ),
            React.createElement(
              "h1",
              {
                key: "h1",
                className: "text-4xl font-bold text-slate-900 mb-2",
              },
              selectedBien
                ? `Chambres - ${selectedBien.nom}`
                : "Toutes les Chambres"
            ),
            React.createElement(
              "p",
              {
                key: "p",
                className: "text-slate-600 text-lg",
              },
              selectedBien
                ? `Gérez les ${chambresToShow.length} chambres de ce bien`
                : "Gérez les chambres de vos biens"
            ),
          ]),
          selectedBien &&
            React.createElement(
              "div",
              {
                key: "bien-info",
                className:
                  "bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm",
              },
              [
                React.createElement(
                  "div",
                  {
                    key: "stats",
                    className: "space-y-2",
                  },
                  [
                    React.createElement(
                      "div",
                      {
                        key: "occupation",
                        className: "flex items-center gap-2 text-blue-700",
                      },
                      [
                        React.createElement("span", { key: "icon" }, "👥"),
                        React.createElement(
                          "span",
                          { key: "text" },
                          `${
                            chambresToShow.filter((c) => c.statut === "louee")
                              .length
                          }/${chambresToShow.length} chambres occupées`
                        ),
                      ]
                    ),
                    React.createElement(
                      "div",
                      {
                        key: "revenus",
                        className:
                          "flex items-center gap-2 text-green-700 font-semibold",
                      },
                      [
                        React.createElement("span", { key: "icon" }, "💰"),
                        React.createElement(
                          "span",
                          { key: "text" },
                          `${chambresToShow
                            .filter((c) => c.statut === "louee")
                            .reduce(
                              (total, c) =>
                                total + c.loyer_mensuel + c.charges_mensuelles,
                              0
                            )} € /mois`
                        ),
                      ]
                    ),
                  ]
                ),
              ]
            ),
        ]
      ),

      React.createElement(
        "div",
        {
          key: "grid",
          className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6",
        },
        chambresToShow.length === 0
          ? React.createElement(
              "div",
              {
                key: "no-chambres",
                className:
                  "col-span-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center",
              },
              [
                React.createElement(
                  "div",
                  {
                    key: "icon",
                    className: "text-6xl mb-4",
                  },
                  "🛏️"
                ),
                React.createElement(
                  "h3",
                  {
                    key: "title",
                    className: "text-xl font-semibold text-gray-600 mb-2",
                  },
                  "Aucune chambre trouvée"
                ),
                React.createElement(
                  "p",
                  {
                    key: "message",
                    className: "text-gray-500",
                  },
                  selectedBien
                    ? `Ce bien ne contient aucune chambre pour le moment.`
                    : `Aucune chambre n'a été créée pour le moment.`
                ),
              ]
            )
          : chambresToShow.map((chambre) => {
              const bien = mockBiens.find((b) => b.id === chambre.bien_id);
              const locataire = mockLocataires.find(
                (l) => l.chambre_id === chambre.id
              );

              return React.createElement(
                "div",
                {
                  key: chambre.id,
                  className:
                    "bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border-0",
                },
                [
                  React.createElement(
                    "div",
                    {
                      key: "header",
                      className: "p-6 pb-4",
                    },
                    [
                      React.createElement(
                        "div",
                        {
                          key: "title-row",
                          className: "flex items-start justify-between",
                        },
                        [
                          React.createElement(
                            "div",
                            {
                              key: "title-info",
                              className: "flex items-center gap-3",
                            },
                            [
                              React.createElement(
                                "div",
                                {
                                  key: "icon",
                                  className:
                                    "w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center",
                                },
                                React.createElement(
                                  "span",
                                  { className: "text-slate-600 text-lg" },
                                  "🛏️"
                                )
                              ),
                              React.createElement("div", { key: "info" }, [
                                React.createElement(
                                  "h3",
                                  {
                                    key: "nom",
                                    className:
                                      "text-lg font-bold text-slate-900",
                                  },
                                  chambre.nom
                                ),
                                React.createElement(
                                  "span",
                                  {
                                    key: "statut",
                                    className: `inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                                      statusColors[chambre.statut]
                                    }`,
                                  },
                                  chambre.statut === "louee" ? "Louée" : "Libre"
                                ),
                              ]),
                            ]
                          ),
                        ]
                      ),
                    ]
                  ),

                  React.createElement(
                    "div",
                    {
                      key: "content",
                      className: "p-6 pt-2 space-y-3",
                    },
                    [
                      React.createElement(
                        "div",
                        {
                          key: "bien",
                          className: "text-sm text-slate-600",
                        },
                        [
                          React.createElement("span", { key: "icon" }, "🏢 "),
                          React.createElement(
                            "span",
                            { key: "text" },
                            bien?.nom || "Bien non trouvé"
                          ),
                        ]
                      ),
                      React.createElement(
                        "div",
                        {
                          key: "details",
                          className: "grid grid-cols-2 gap-3 text-sm",
                        },
                        [
                          React.createElement(
                            "div",
                            {
                              key: "surface",
                              className: "flex items-center justify-between",
                            },
                            [
                              React.createElement(
                                "span",
                                {
                                  key: "label",
                                  className: "text-slate-500",
                                },
                                "📐 Surface"
                              ),
                              React.createElement(
                                "span",
                                {
                                  key: "value",
                                  className: "font-medium text-slate-800",
                                },
                                `${chambre.surface || "N/A"} m²`
                              ),
                            ]
                          ),
                          React.createElement(
                            "div",
                            {
                              key: "loyer",
                              className: "flex items-center justify-between",
                            },
                            [
                              React.createElement(
                                "span",
                                {
                                  key: "label",
                                  className: "text-slate-500",
                                },
                                "💰 Loyer"
                              ),
                              React.createElement(
                                "span",
                                {
                                  key: "value",
                                  className: "font-bold text-lg text-green-600",
                                },
                                `${chambre.loyer_mensuel} €`
                              ),
                            ]
                          ),
                          React.createElement(
                            "div",
                            {
                              key: "type",
                              className: "flex items-center justify-between",
                            },
                            [
                              React.createElement(
                                "span",
                                {
                                  key: "label",
                                  className: "text-slate-500",
                                },
                                "🏠 Type"
                              ),
                              React.createElement(
                                "span",
                                {
                                  key: "value",
                                  className:
                                    "font-medium text-slate-800 capitalize",
                                },
                                chambre.type_chambre === "privee"
                                  ? "Privée"
                                  : "Partagée"
                              ),
                            ]
                          ),
                        ]
                      ),

                      chambre.statut === "louee" &&
                        locataire &&
                        React.createElement(
                          "div",
                          {
                            key: "locataire",
                            className:
                              "bg-blue-50 border-l-4 border-blue-400 p-3 rounded-md text-sm",
                          },
                          [
                            React.createElement(
                              "div",
                              {
                                key: "info",
                                className:
                                  "flex items-center gap-2 font-semibold text-blue-800",
                              },
                              [
                                React.createElement(
                                  "span",
                                  { key: "icon" },
                                  "👤"
                                ),
                                React.createElement(
                                  "span",
                                  { key: "text" },
                                  `Loué par ${locataire.prenom} ${locataire.nom}`
                                ),
                              ]
                            ),
                          ]
                        ),
                    ]
                  ),

                  React.createElement(
                    "div",
                    {
                      key: "footer",
                      className: "p-6 pt-0",
                    },
                    [
                      React.createElement(
                        "div",
                        {
                          key: "actions",
                          className: "flex gap-2 mb-2",
                        },
                        [
                          React.createElement(
                            "button",
                            {
                              key: "modifier",
                              className:
                                "flex-1 border border-slate-300 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 px-3 py-2 rounded text-sm flex items-center justify-center gap-2",
                            },
                            [
                              React.createElement(
                                "span",
                                { key: "icon" },
                                "✏️"
                              ),
                              React.createElement(
                                "span",
                                { key: "text" },
                                "Modifier"
                              ),
                            ]
                          ),
                          React.createElement(
                            "button",
                            {
                              key: "supprimer",
                              className:
                                "flex-1 border border-slate-300 text-red-600 hover:bg-red-50 hover:border-red-200 hover:text-red-700 px-3 py-2 rounded text-sm flex items-center justify-center gap-2",
                            },
                            [
                              React.createElement(
                                "span",
                                { key: "icon" },
                                "🗑️"
                              ),
                              React.createElement(
                                "span",
                                { key: "text" },
                                "Supprimer"
                              ),
                            ]
                          ),
                        ]
                      ),
                      React.createElement(
                        "button",
                        {
                          key: "details",
                          className:
                            "w-full bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded text-sm flex items-center justify-center gap-2",
                        },
                        [
                          React.createElement("span", { key: "icon" }, "👁️"),
                          React.createElement(
                            "span",
                            { key: "text" },
                            "Voir les détails"
                          ),
                        ]
                      ),
                    ]
                  ),
                ]
              );
            })
      ),
    ]
  );
};

// Page Loyers
const LoyersPage = () => {
  return React.createElement(
    "div",
    {
      className: "space-y-8",
    },
    [
      React.createElement(
        "div",
        {
          key: "header",
          className: "flex justify-between items-center",
        },
        [
          React.createElement("div", { key: "title" }, [
            React.createElement(
              "h1",
              {
                key: "h1",
                className: "text-4xl font-bold text-slate-900 mb-2",
              },
              "Historique des Loyers"
            ),
            React.createElement(
              "p",
              {
                key: "p",
                className: "text-slate-600 text-lg",
              },
              "Suivi des paiements et échéances"
            ),
          ]),
        ]
      ),

      React.createElement(
        "div",
        {
          key: "card",
          className: "bg-white rounded-lg shadow-lg overflow-hidden",
        },
        [
          React.createElement(
            "div",
            {
              key: "header",
              className: "p-6 border-b border-gray-100",
            },
            [
              React.createElement(
                "h2",
                {
                  key: "card-title",
                  className:
                    "text-xl font-bold text-gray-900 flex items-center gap-2",
                },
                [
                  React.createElement("span", { key: "icon" }, "💰"),
                  "Historique des Loyers",
                ]
              ),
            ]
          ),

          React.createElement(
            "div",
            {
              key: "content",
              className: "overflow-x-auto",
            },
            [
              React.createElement(
                "table",
                {
                  key: "table",
                  className: "w-full",
                },
                [
                  React.createElement(
                    "thead",
                    {
                      key: "thead",
                      className: "bg-gray-50",
                    },
                    [
                      React.createElement("tr", { key: "header-row" }, [
                        React.createElement(
                          "th",
                          {
                            key: "periode",
                            className:
                              "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                          },
                          "Période"
                        ),
                        React.createElement(
                          "th",
                          {
                            key: "bien",
                            className:
                              "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                          },
                          "Bien"
                        ),
                        React.createElement(
                          "th",
                          {
                            key: "chambre",
                            className:
                              "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                          },
                          "Chambre"
                        ),
                        React.createElement(
                          "th",
                          {
                            key: "locataire",
                            className:
                              "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                          },
                          "Locataire"
                        ),
                        React.createElement(
                          "th",
                          {
                            key: "montant",
                            className:
                              "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                          },
                          "Montant"
                        ),
                        React.createElement(
                          "th",
                          {
                            key: "echeance",
                            className:
                              "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                          },
                          "Échéance"
                        ),
                        React.createElement(
                          "th",
                          {
                            key: "paiement",
                            className:
                              "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                          },
                          "Paiement"
                        ),
                        React.createElement(
                          "th",
                          {
                            key: "statut",
                            className:
                              "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                          },
                          "Statut"
                        ),
                      ]),
                    ]
                  ),
                  React.createElement(
                    "tbody",
                    {
                      key: "tbody",
                      className: "bg-white divide-y divide-gray-200",
                    },
                    mockLoyers.map((loyer) => {
                      const chambre = mockChambres.find(
                        (c) => c.id === loyer.chambre_id
                      );
                      const bien = chambre
                        ? mockBiens.find((b) => b.id === chambre.bien_id)
                        : null;
                      const locataire = mockLocataires.find(
                        (l) => l.chambre_id === loyer.chambre_id
                      );

                      return React.createElement(
                        "tr",
                        {
                          key: loyer.id,
                          className: "hover:bg-gray-50",
                        },
                        [
                          React.createElement(
                            "td",
                            {
                              key: "periode",
                              className:
                                "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900",
                            },
                            `${moisNoms[loyer.mois]} ${loyer.annee}`
                          ),

                          React.createElement(
                            "td",
                            {
                              key: "bien",
                              className:
                                "px-6 py-4 whitespace-nowrap text-sm text-gray-900",
                            },
                            [
                              React.createElement(
                                "div",
                                { key: "nom" },
                                bien?.nom || "Bien inconnu"
                              ),
                              React.createElement(
                                "div",
                                {
                                  key: "type",
                                  className: "text-xs text-gray-500 capitalize",
                                },
                                bien?.type || "-"
                              ),
                            ]
                          ),

                          React.createElement(
                            "td",
                            {
                              key: "chambre",
                              className:
                                "px-6 py-4 whitespace-nowrap text-sm text-gray-900",
                            },
                            [
                              React.createElement(
                                "div",
                                { key: "nom" },
                                chambre?.nom || "Chambre inconnue"
                              ),
                              React.createElement(
                                "div",
                                {
                                  key: "surface",
                                  className: "text-xs text-gray-500",
                                },
                                chambre?.surface ? `${chambre.surface} m²` : "-"
                              ),
                            ]
                          ),

                          React.createElement(
                            "td",
                            {
                              key: "locataire",
                              className:
                                "px-6 py-4 whitespace-nowrap text-sm text-gray-900",
                            },
                            locataire
                              ? [
                                  React.createElement(
                                    "div",
                                    { key: "nom" },
                                    `${locataire.prenom} ${locataire.nom}`
                                  ),
                                  React.createElement(
                                    "div",
                                    {
                                      key: "profession",
                                      className: "text-xs text-gray-500",
                                    },
                                    locataire.profession
                                  ),
                                ]
                              : React.createElement(
                                  "span",
                                  {
                                    key: "vide",
                                    className: "text-gray-400 italic",
                                  },
                                  "Aucun locataire"
                                )
                          ),

                          React.createElement(
                            "td",
                            {
                              key: "montant",
                              className: "px-6 py-4 whitespace-nowrap",
                            },
                            [
                              React.createElement(
                                "div",
                                {
                                  key: "total",
                                  className:
                                    "text-sm font-semibold text-green-600",
                                },
                                `${loyer.montant_total.toLocaleString()} €`
                              ),
                              loyer.montant_charges &&
                                React.createElement(
                                  "div",
                                  {
                                    key: "charges",
                                    className: "text-xs text-gray-500",
                                  },
                                  `dont ${loyer.montant_charges.toLocaleString()} € de charges`
                                ),
                            ]
                          ),

                          React.createElement(
                            "td",
                            {
                              key: "echeance",
                              className:
                                "px-6 py-4 whitespace-nowrap text-sm text-gray-900",
                            },
                            loyer.date_echeance
                              ? new Date(
                                  loyer.date_echeance
                                ).toLocaleDateString("fr-FR")
                              : "-"
                          ),

                          React.createElement(
                            "td",
                            {
                              key: "paiement",
                              className:
                                "px-6 py-4 whitespace-nowrap text-sm text-gray-900",
                            },
                            loyer.date_paiement
                              ? [
                                  React.createElement(
                                    "div",
                                    { key: "date" },
                                    new Date(
                                      loyer.date_paiement
                                    ).toLocaleDateString("fr-FR")
                                  ),
                                  loyer.mode_paiement &&
                                    React.createElement(
                                      "div",
                                      {
                                        key: "mode",
                                        className:
                                          "text-xs text-gray-500 capitalize",
                                      },
                                      loyer.mode_paiement.replace("_", " ")
                                    ),
                                ]
                              : "-"
                          ),

                          React.createElement(
                            "td",
                            {
                              key: "statut",
                              className: "px-6 py-4 whitespace-nowrap",
                            },
                            [
                              React.createElement(
                                "span",
                                {
                                  key: "badge",
                                  className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                    statutColors[loyer.statut]
                                  }`,
                                },
                                [
                                  React.createElement(
                                    "span",
                                    { key: "icon", className: "mr-1" },
                                    loyer.statut === "paye"
                                      ? "✓"
                                      : loyer.statut === "en_retard"
                                      ? "⚠️"
                                      : loyer.statut === "en_attente"
                                      ? "⏱️"
                                      : "◐"
                                  ),
                                  loyer.statut === "paye"
                                    ? "Payé"
                                    : loyer.statut === "en_attente"
                                    ? "En attente"
                                    : loyer.statut === "en_retard"
                                    ? "En retard"
                                    : loyer.statut === "partiel"
                                    ? "Partiel"
                                    : loyer.statut,
                                ]
                              ),
                            ]
                          ),
                        ]
                      );
                    })
                  ),
                ]
              ),
            ]
          ),
        ]
      ),
    ]
  );
};

// ===========================================
// APPLICATION PRINCIPALE
// ===========================================

const App = () => {
  const [currentPage, setCurrentPage] = React.useState("dashboard");
  const [selectedBienForChambres, setSelectedBienForChambres] =
    React.useState(null);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return React.createElement(DashboardPage);
      case "biens":
        return React.createElement(BiensPage, {
          onGererChambres: (bienId) => {
            setSelectedBienForChambres(bienId);
            setCurrentPage("chambres");
          },
        });
      case "locataires":
        return React.createElement(LocatairesPage);
      case "chambres":
        return React.createElement(ChambresPage, {
          selectedBienId: selectedBienForChambres,
          onRetourBiens: () => {
            setSelectedBienForChambres(null);
            setCurrentPage("biens");
          },
        });
      case "loyers":
        return React.createElement(LoyersPage);
      default:
        return React.createElement(DashboardPage);
    }
  };

  return React.createElement(
    "div",
    {
      className: "min-h-screen bg-gradient-to-br from-slate-50 to-white flex",
    },
    [
      React.createElement(Sidebar, {
        key: "sidebar",
        currentPage: currentPage,
        onPageChange: setCurrentPage,
      }),
      React.createElement(
        "main",
        {
          key: "main",
          className: "flex-1 ml-64 p-8",
        },
        [
          React.createElement(
            "div",
            {
              key: "content",
              className: "max-w-7xl mx-auto",
            },
            renderCurrentPage()
          ),
        ]
      ),
    ]
  );
};

ReactDOM.render(React.createElement(App), document.getElementById("root"));
