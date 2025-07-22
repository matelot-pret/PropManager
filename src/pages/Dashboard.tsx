import { useState, useEffect } from "react";
import bienService from "../services/BienService";
import locataireService from "../services/LocataireService";
import contratBailService from "../services/ContratBailService";
import loyerService from "../services/LoyerService";
// Les services Travaux et Facture sont à créer si besoin, sinon remplacer par des mocks
import {
  Building2,
  Users,
  Euro,
  TrendingUp,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";

import StatsCards from "../components/dashboard/StatsCards";
import RecentActivity from "../components/dashboard/RecentActivity";
import FinancialSummary from "../components/dashboard/FinancialSummary";
import PropertiesOverview from "../components/dashboard/PropertiesOverview";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBiens: 0,
    totalLocataires: 0,
    revenusMensuels: 0,
    loyersEnRetard: 0,
    travauxUrgents: 0,
    facturesEnAttente: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Remplacer par les méthodes de service correctes
      const [biensRes, locatairesRes, contratsRes, loyersRes] =
        await Promise.all([
          bienService.getAll(),
          locataireService.getAll(),
          contratBailService.filter({ statut: "actif" }),
          loyerService.getAll(),
        ]);
      const biens = biensRes.data || [];
      const locataires = locatairesRes.data || [];
      const contrats = contratsRes || [];
      const loyers = loyersRes.data || [];
      // Pour travaux et factures, utiliser des tableaux vides ou créer les services
      const travaux: any[] = [];
      const factures: any[] = [];

      const loyersEnRetard = loyers.filter(
        (l) => l.statut === "en_retard"
      ).length;
      const travauxUrgents = travaux.filter(
        (t) => t.priorite === "urgente" && t.statut !== "termine"
      ).length;
      const facturesEnAttente = factures.filter(
        (f) => f.statut === "en_attente"
      ).length;
      const revenusMensuels = contrats.reduce(
        (sum, c) => sum + (c.loyer_mensuel || 0),
        0
      );

      setStats({
        totalBiens: biens.length,
        totalLocataires: locataires.filter((l) => l.statut === "actif").length,
        revenusMensuels,
        loyersEnRetard,
        travauxUrgents,
        facturesEnAttente,
      });
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Tableau de Bord
          </h1>
          <p className="text-slate-600 text-lg">
            Vue d'ensemble de votre patrimoine immobilier
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatsCards
            title="Biens Immobiliers"
            value={stats.totalBiens}
            icon={Building2}
            color="blue"
            isLoading={isLoading}
            alert={false}
          />
          <StatsCards
            title="Locataires Actifs"
            value={stats.totalLocataires}
            icon={Users}
            color="green"
            isLoading={isLoading}
            alert={false}
          />
          <StatsCards
            title="Revenus Mensuels"
            value={`${stats.revenusMensuels.toLocaleString()} €`}
            icon={Euro}
            color="purple"
            isLoading={isLoading}
            alert={false}
          />
          <StatsCards
            title="Loyers en Retard"
            value={stats.loyersEnRetard}
            icon={AlertTriangle}
            color="red"
            isLoading={isLoading}
            alert={stats.loyersEnRetard > 0}
          />
          <StatsCards
            title="Travaux Urgents"
            value={stats.travauxUrgents}
            icon={TrendingUp}
            color="orange"
            isLoading={isLoading}
            alert={stats.travauxUrgents > 0}
          />
          <StatsCards
            title="Factures en Attente"
            value={stats.facturesEnAttente}
            icon={Calendar}
            color="indigo"
            isLoading={isLoading}
            alert={false}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <FinancialSummary />
            <RecentActivity />
          </div>

          <div className="space-y-8">
            <PropertiesOverview />
          </div>
        </div>
      </div>
    </div>
  );
}
