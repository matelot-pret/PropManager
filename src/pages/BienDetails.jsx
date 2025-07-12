import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Bien, Chambre, Locataire, ContratBail } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  ArrowLeft,
  BedDouble,
  Building,
  Euro,
  UserCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { createPageUrl } from "@/utils";

import ChambreList from "../components/biens/ChambreList";
import ChambreForm from "../components/biens/ChambreForm";

export default function BienDetails() {
  const { id } = useParams();
  const [bien, setBien] = useState(null);
  const [chambres, setChambres] = useState([]);
  const [chambresDetails, setChambresDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingChambre, setEditingChambre] = useState(null);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const bienData = await Bien.get(id);
      setBien(bienData);

      const chambresData = await Chambre.filter({ bien_id: id });
      setChambres(chambresData);

      // Enrichir les chambres avec les détails des locataires
      const contratsActifs = await ContratBail.filter({ statut: "actif" });
      const locatairesActifs = await Locataire.filter({ statut: "actif" });

      const details = chambresData.map((chambre) => {
        const contrat = contratsActifs.find((c) => c.chambre_id === chambre.id);
        if (contrat) {
          const locataire = locatairesActifs.find(
            (l) => l.id === contrat.locataire_id
          );
          return { ...chambre, locataire: locataire, contrat: contrat };
        }
        return chambre;
      });
      setChambresDetails(details);
    } catch (error) {
      console.error("Erreur lors du chargement des détails du bien:", error);
    }
    setIsLoading(false);
  };

  const handleChambreSubmit = async (chambreData) => {
    if (editingChambre) {
      await Chambre.update(editingChambre.id, chambreData);
    } else {
      await Chambre.create({ ...chambreData, bien_id: id });
    }
    setShowForm(false);
    setEditingChambre(null);
    loadData();
  };

  const handleEditChambre = (chambre) => {
    setEditingChambre(chambre);
    setShowForm(true);
  };

  const handleDeleteChambre = async (chambreId) => {
    await Chambre.delete(chambreId);
    loadData();
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <Skeleton className="h-10 w-1/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    );
  }

  if (!bien) {
    return <div className="p-8 text-center">Bien non trouvé.</div>;
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            to={createPageUrl("Biens")}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la liste des biens
          </Link>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                {bien.nom}
              </h1>
              <p className="text-slate-600 text-lg">{bien.adresse}</p>
            </div>
            <Button
              onClick={() => {
                setEditingChambre(null);
                setShowForm(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Ajouter une chambre
            </Button>
          </div>
        </motion.div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="mb-8"
          >
            <ChambreForm
              chambre={editingChambre}
              onSubmit={handleChambreSubmit}
              onCancel={() => setShowForm(false)}
            />
          </motion.div>
        )}

        <ChambreList
          chambres={chambresDetails}
          isLoading={isLoading}
          onEdit={handleEditChambre}
          onDelete={handleDeleteChambre}
        />
      </div>
    </div>
  );
}
