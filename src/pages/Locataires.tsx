import React, { useState, useEffect } from "react";
import { Locataire, Chambre } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import LocataireForm from "../components/locataires/LocataireForm";
import LocataireList from "../components/locataires/LocataireList";

export default function Locataires() {
  const [locataires, setLocataires] = useState([]);
  const [chambresDisponibles, setChambresDisponibles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingLocataire, setEditingLocataire] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const locatairesData = await Locataire.list("-created_date");
      setLocataires(locatairesData);
      const chambresData = await Chambre.filter({ statut: "libre" });
      setChambresDisponibles(chambresData);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (locataireData) => {
    if (editingLocataire) {
      await Locataire.update(editingLocataire.id, locataireData);
    } else {
      await Locataire.create(locataireData);
      // Mettre à jour le statut de la chambre
      await Chambre.update(locataireData.chambre_id, { statut: "louee" });
    }
    setShowForm(false);
    setEditingLocataire(null);
    loadData();
  };

  const handleEdit = (locataire) => {
    setEditingLocataire(locataire);
    setShowForm(true);
  };

  const handleDelete = async (locataire) => {
    await Locataire.delete(locataire.id);
    // Libérer la chambre
    if (locataire.chambre_id) {
      await Chambre.update(locataire.chambre_id, { statut: "libre" });
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
