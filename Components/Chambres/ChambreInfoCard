import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BedDouble, Ruler, Euro, ShieldCheck, ShieldOff } from "lucide-react";

export default function ChambreInfoCard({ chambre }) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="p-6 border-b border-slate-100">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
          <BedDouble className="w-6 h-6 text-blue-600" />
          Informations de la Chambre
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 flex items-center gap-2">
                <Ruler className="w-4 h-4" />
                Surface
              </span>
              <span className="font-semibold text-slate-900">
                {chambre.surface ? `${chambre.surface} m²` : "Non spécifiée"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600 flex items-center gap-2">
                <Euro className="w-4 h-4" />
                Loyer mensuel
              </span>
              <span className="font-bold text-green-600 text-lg">
                {chambre.loyer_mensuel.toLocaleString()} €
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600 flex items-center gap-2">
                {chambre.type_chambre === "partagee" ? (
                  <ShieldOff className="w-4 h-4" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
                Type de chambre
              </span>
              <Badge variant="outline" className="capitalize">
                {chambre.type_chambre === "partagee" ? "Partagée" : "Privée"}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Description</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                {chambre.description || "Aucune description disponible."}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
