import React, { useState, useEffect } from "react";
import { Bien } from "@/entities/Bien";
import { Button } from "@/components/ui/button";
import { Plus, Building2 } from "lucide-react";
import { motion } from "framer-motion";

import BienForm from "../components/biens/BienForm";
import BienList from "../components/biens/BienList";

export default function Biens() {
  const [biens, setBiens] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBien, setEditingBien] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBiens();
  }, []);

  const loadBiens = async () => {
    setIsLoading(true);
    const data = await Bien.list("-created_date");
    setBiens(data);
    setIsLoading(false);
  };

  const handleSubmit = async (bienData) => {
    if (editingBien) {
      await Bien.update(editingBien.id, bienData);
    } else {
      await Bien.create(bienData);
    }
    setShowForm(false);
    setEditingBien(null);
    loadBiens();
  };

  const handleEdit = (bien) => {
    setEditingBien(bien);
    setShowForm(true);
  };

  const handleDelete = async (bienId) => {
    await Bien.delete(bienId);
    loadBiens();
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
              Mes Biens
            </h1>
            <p className="text-slate-600 text-lg">
              Gérez votre patrimoine immobilier
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouveau Bien
          </Button>
        </motion.div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8"
          >
            <BienForm
              bien={editingBien}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingBien(null);
              }}
            />
          </motion.div>
        )}

        <BienList
          biens={biens}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
