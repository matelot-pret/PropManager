import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Chambre, Bien, Locataire, ContratBail, Loyer } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  BedDouble,
  User,
  Euro,
  Calendar,
  Phone,
  Mail,
  Users,
  Edit,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import fr from "date-fns/locale/fr";

import ChambreInfoCard from "../components/chambres/ChambreInfoCard";
import LocataireInfoCard from "../components/chambres/LocataireInfoCard";
import ContratInfoCard from "../components/chambres/ContratInfoCard";
import LooyersHistorique from "../components/chambres/LooyersHistorique";

export default function ChambreDetails() {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const chambreId = urlParams.get("id");
  const bienId = urlParams.get("bien_id");

  const [chambre, setChambre] = useState(null);
  const [bien, setBien] = useState(null);
  const [locataire, setLocataire] = useState(null);
  const [contrat, setContrat] = useState(null);
  const [loyers, setLoyers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (chambreId) {
      loadChambreDetails();
    }
  }, [chambreId]);

  const loadChambreDetails = async () => {
    setIsLoading(true);
    try {
      // Charger la chambre
      const chambreData = await Chambre.get(chambreId);
      setChambre(chambreData);

      // Charger le bien
      const bienData = await Bien.get(chambreData.bien_id);
      setBien(bienData);

      // Charger le contrat actif pour cette chambre
      const contratsActifs = await ContratBail.filter({
        chambre_id: chambreId,
        statut: "actif",
      });

      if (contratsActifs.length > 0) {
        const contratActif = contratsActifs[0];
        setContrat(contratActif);

        // Charger le locataire
        const locataireData = await Locataire.get(contratActif.locataire_id);
        setLocataire(locataireData);

        // Charger l'historique des loyers
        const loyersData = await Loyer.filter(
          { chambre_id: chambreId },
          "-annee,-mois"
        );
        setLoyers(loyersData);
      }
    } catch (error) {
      console.error(
        "Erreur lors du chargement des détails de la chambre:",
        error
      );
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <Skeleton className="h-8 w-1/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <div className="grid lg:grid-cols-3 gap-6">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    );
  }

  if (!chambre) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          Chambre non trouvée
        </h1>
        <Link to={createPageUrl("Biens")}>
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux biens
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            to={createPageUrl(`BienDetails?id=${bien?.id}`)}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux chambres de {bien?.nom}
          </Link>

          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                <BedDouble className="w-10 h-10 text-blue-600" />
                {chambre.nom}
              </h1>
              <p className="text-slate-600 text-lg">
                {bien?.nom} • {bien?.adresse}
              </p>
            </div>
            <div className="flex gap-3">
              <Badge
                className={`text-sm px-3 py-1 ${
                  chambre.statut === "louee"
                    ? "bg-blue-100 text-blue-800 border-blue-200"
                    : "bg-green-100 text-green-800 border-green-200"
                }`}
              >
                {chambre.statut === "louee" ? "Occupée" : "Libre"}
              </Badge>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            <ChambreInfoCard chambre={chambre} />

            {contrat && locataire && <ContratInfoCard contrat={contrat} />}

            {loyers.length > 0 && <LooyersHistorique loyers={loyers} />}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {locataire ? (
              <LocataireInfoCard locataire={locataire} contrat={contrat} />
            ) : (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    Chambre libre
                  </h3>
                  <p className="text-slate-500 text-sm mb-4">
                    Cette chambre est disponible à la location
                  </p>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700">
                    Ajouter un locataire
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Actions rapides */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="p-6 border-b border-slate-100">
                <CardTitle className="text-lg font-bold text-slate-900">
                  Actions Rapides
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Générer un contrat
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Euro className="w-4 h-4 mr-2" />
                  Enregistrer un paiement
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Planifier une visite
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
