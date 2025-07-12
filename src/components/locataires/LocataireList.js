import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Edit, Trash2, Phone, Mail, BedDouble } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LocataireList({
  locataires,
  isLoading,
  onEdit,
  onDelete,
}) {
  if (isLoading) {
    return (
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
    );
  }

  if (!locataires || locataires.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-12 text-center">
          <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900">
            Aucun locataire
          </h3>
          <p className="text-slate-500">Ajoutez votre premier locataire.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {locataires.map((locataire) => (
          <motion.div
            key={locataire.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col">
              <CardHeader className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-900">
                      {locataire.prenom} {locataire.nom}
                    </CardTitle>
                    <p className="text-sm text-slate-500">
                      {locataire.profession}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-3 flex-grow">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail className="w-4 h-4" />
                  <span>{locataire.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone className="w-4 h-4" />
                  <span>{locataire.telephone}</span>
                </div>
                {locataire.chambre_id && (
                  <div className="flex items-center gap-2 text-sm text-slate-600 pt-2">
                    <BedDouble className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">Loue une chambre</span>
                  </div>
                )}
              </CardContent>
              <div className="p-6 pt-0 flex gap-2 mt-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(locataire)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(locataire)}
                  className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
