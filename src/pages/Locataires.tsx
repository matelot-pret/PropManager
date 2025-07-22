import { useState, useEffect } from "react";
import type { Locataire } from "@/types/models";
import type { Chambre } from "@/types/models";
import Button from "../components/ui/button";
import locataireService from "@/services/LocataireService";
import chambreService from "@/services/ChambreService";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import LocataireForm from "../components/locataires/LocataireForm";
import LocataireList from "../components/locataires/LocataireList";

export default function Locataires() {
  const [locataires, setLocataires] = useState<Locataire[]>([]);
  const [chambresDisponibles, setChambresDisponibles] = useState<Chambre[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingLocataire, setEditingLocataire] = useState<Locataire | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const locatairesRes = await locataireService.getAll({ statut: "actif" });
      setLocataires(locatairesRes.data || []);
      const chambresRes = await chambreService.getAll({ statut: "libre" });
      setChambresDisponibles(chambresRes.data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (locataireData: any) => {
    if (editingLocataire) {
      await locataireService.update(editingLocataire.id, locataireData);
    } else {
      // S'assurer que le statut est défini pour la création
      const dataToCreate = {
        ...locataireData,
        statut: locataireData.statut || "actif",
      };
      await locataireService.create(dataToCreate);
      if (locataireData.chambre_id) {
        await chambreService.update(locataireData.chambre_id, {
          statut: "louee",
        });
      }
    }
    setShowForm(false);
    setEditingLocataire(null);
    loadData();
  };

  const handleEdit = (locataire: Locataire) => {
    setEditingLocataire(locataire);
    setShowForm(true);
  };

  const handleDelete = async (locataire: Locataire) => {
    await locataireService.delete(locataire.id);
    // Libérer la chambre
    if (locataire.chambre_id) {
      await chambreService.update(locataire.chambre_id, { statut: "libre" });
    }
    loadData();
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Locataires
            </h1>
            <p className="text-slate-600 text-lg">
              Gérez vos locataires et candidats
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingLocataire(null);
              setShowForm(true);
            }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouveau Locataire
          </Button>
        </motion.div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="mb-8"
            >
              <LocataireForm
                locataire={editingLocataire}
                chambresDisponibles={chambresDisponibles}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingLocataire(null);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <LocataireList
          locataires={locataires}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
