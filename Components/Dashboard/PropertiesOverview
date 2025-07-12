import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, MapPin, Users } from "lucide-react";

export default function PropertyOverview() {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="p-6 border-b border-slate-100">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
          <Building2 className="w-6 h-6 text-indigo-600" />
          Aperçu des Biens
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Building2 className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">
            Aucun bien enregistré
          </h3>
          <p className="text-slate-500 text-sm mb-4">
            Commencez par ajouter vos premiers biens immobiliers
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-4 h-4" />
                Appartements
              </span>
              <span className="font-semibold">0</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-slate-600">
                <Building2 className="w-4 h-4" />
                Maisons
              </span>
              <span className="font-semibold">0</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-slate-600">
                <Users className="w-4 h-4" />
                Taux d'occupation
              </span>
              <span className="font-semibold">0%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
