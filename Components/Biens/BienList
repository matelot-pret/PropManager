import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, MapPin, Edit, Trash2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const typeIcons = {
  appartement: Building2,
  maison: Building2,
  studio: Building2,
  bureau: Building2,
  local_commercial: Building2,
  autre: Building2,
};

export default function BienList({ biens, isLoading, onEdit, onDelete }) {
  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Card key={i} className="border-0 shadow-lg">
              <CardHeader className="p-6">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
      </div>
    );
  }

  if (biens.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Building2 className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Aucun bien enregistré
          </h3>
          <p className="text-slate-500 mb-6">
            Commencez par ajouter votre premier bien immobilier
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {biens.map((bien) => {
          const TypeIcon = typeIcons[bien.type] || Building2;
          return (
            <motion.div
              key={bien.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              layout
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white flex flex-col h-full">
                <CardHeader className="p-6 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <TypeIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-900">
                        {bien.nom}
                      </CardTitle>
                      <p className="text-sm text-slate-500 capitalize">
                        {bien.type?.replace(/_/g, " ")}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6 pt-0 space-y-4 flex-grow">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-4 h-4" />
                    <p className="text-sm truncate">{bien.adresse}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {bien.surface && (
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        <span>{bien.surface} m²</span>
                      </div>
                    )}
                    {bien.nb_pieces && (
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        <span>{bien.nb_pieces} pièces</span>
                      </div>
                    )}
                  </div>
                </CardContent>

                <div className="p-6 pt-0 border-t mt-auto">
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(bien)}
                      className="flex-1 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(bien.id)}
                      className="flex-1 hover:bg-red-50 hover:border-red-200 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer
                    </Button>
                  </div>
                  <Link
                    to={createPageUrl(`BienDetails?id=${bien.id}`)}
                    className="mt-2"
                  >
                    <Button className="w-full bg-slate-800 hover:bg-slate-900">
                      Gérer les chambres
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
