import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BedDouble,
  Edit,
  Trash2,
  Euro,
  Ruler,
  User,
  ShieldCheck,
  ShieldOff,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const statusColors = {
  libre: "bg-green-100 text-green-800 border-green-200",
  louee: "bg-blue-100 text-blue-800 border-blue-200",
};

export default function ChambreList({ chambres, isLoading, onEdit, onDelete }) {
  if (isLoading) return <p>Chargement des chambres...</p>;

  if (!chambres || chambres.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <BedDouble className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Aucune chambre enregistrée
          </h3>
          <p className="text-slate-500 mb-6">
            Ajoutez la première chambre pour ce bien.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {chambres.map((chambre) => (
          <motion.div
            key={chambre.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white flex flex-col h-full">
              <CardHeader className="p-6 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <BedDouble className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-900">
                        {chambre.nom}
                      </CardTitle>
                      <Badge
                        className={`${
                          statusColors[chambre.statut]
                        } border mt-1`}
                      >
                        {chambre.statut}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-2 flex-grow flex flex-col justify-between">
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-500">
                      <Ruler className="w-4 h-4" /> Surface
                    </span>
                    <span className="font-medium text-slate-800">
                      {chambre.surface || "N/A"} m²
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-500">
                      <Euro className="w-4 h-4" /> Loyer
                    </span>
                    <span className="font-bold text-lg text-green-600">
                      {chambre.loyer_mensuel} €
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-500">
                      {chambre.type_chambre === "partagee" ? (
                        <ShieldOff className="w-4 h-4" />
                      ) : (
                        <ShieldCheck className="w-4 h-4" />
                      )}{" "}
                      Type
                    </span>
                    <span className="font-medium text-slate-800 capitalize">
                      {chambre.type_chambre}
                    </span>
                  </div>
                </div>

                {chambre.statut === "louee" && chambre.locataire && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-md mb-4 text-sm">
                    <div className="flex items-center gap-2 font-semibold text-blue-800">
                      <User className="w-4 h-4" /> Loué par{" "}
                      {chambre.locataire.prenom} {chambre.locataire.nom}
                    </div>
                    {chambre.contrat && chambre.contrat.date_fin && (
                      <p className="text-blue-700 mt-1">
                        Contrat jusqu'au{" "}
                        {format(
                          new Date(chambre.contrat.date_fin),
                          "dd/MM/yyyy"
                        )}
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-2 mt-auto">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(chambre)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-2" /> Modifier
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(chambre.id)}
                      className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                    </Button>
                  </div>
                  <Link
                    to={createPageUrl(
                      `ChambreDetails?id=${chambre.id}&bien_id=${chambre.bien_id}`
                    )}
                    className="block"
                  >
                    <Button className="w-full bg-slate-800 hover:bg-slate-900">
                      <Eye className="w-4 h-4 mr-2" />
                      Voir les détails
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
