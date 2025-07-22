import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Euro, Shield } from "lucide-react";
import { format } from "date-fns";
import fr from "date-fns/locale/fr"; // Keep locale import for potential future use or if other date formats still need it

const statutColors = {
  actif: "bg-green-100 text-green-800 border-green-200",
  expire: "bg-red-100 text-red-800 border-red-200",
  resilie: "bg-orange-100 text-orange-800 border-orange-200",
  en_cours: "bg-blue-100 text-blue-800 border-blue-200",
};

export default function ContratInfoCard({ contrat }) {
  const isExpiringSoon = () => {
    if (!contrat.date_fin) return false;
    const today = new Date();
    const finBail = new Date(contrat.date_fin);
    const diffTime = finBail - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="p-6 border-b border-slate-100">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
          <FileText className="w-6 h-6 text-purple-600" />
          Contrat de Bail
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Statut du contrat</span>
              <div className="flex items-center gap-2">
                <Badge className={`${statutColors[contrat.statut]} border`}>
                  {contrat.statut === "actif"
                    ? "Actif"
                    : contrat.statut === "expire"
                    ? "Expiré"
                    : contrat.statut === "resilie"
                    ? "Résilié"
                    : "En cours"}
                </Badge>
                {isExpiringSoon() && (
                  <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                    Expire bientôt
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date de début
              </span>
              <span className="font-semibold text-slate-900">
                {format(new Date(contrat.date_debut), "dd/MM/yyyy")}
              </span>
            </div>

            {contrat.date_fin && (
              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date de fin
                </span>
                <span className="font-semibold text-slate-900">
                  {format(new Date(contrat.date_fin), "dd/MM/yyyy")}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-slate-600">Durée</span>
              <span className="font-semibold text-slate-900">
                {contrat.duree_mois
                  ? `${contrat.duree_mois} mois`
                  : "Non spécifiée"}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 flex items-center gap-2">
                <Euro className="w-4 h-4" />
                Loyer mensuel
              </span>
              <span className="font-bold text-green-600 text-lg">
                {contrat.loyer_mensuel.toLocaleString()} €
              </span>
            </div>

            {contrat.charges_mensuelles && (
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Charges</span>
                <span className="font-semibold text-slate-900">
                  {contrat.charges_mensuelles.toLocaleString()} €
                </span>
              </div>
            )}

            {contrat.depot_garantie && (
              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Dépôt de garantie
                </span>
                <span className="font-semibold text-slate-900">
                  {contrat.depot_garantie.toLocaleString()} €
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-slate-600">Type de bail</span>
              <Badge variant="outline" className="capitalize">
                {contrat.type_bail?.replace(/_/g, " ")}
              </Badge>
            </div>
          </div>
        </div>

        {contrat.conditions_particulieres && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h4 className="font-semibold text-slate-900 mb-2">
              Conditions particulières
            </h4>
            <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
              {contrat.conditions_particulieres}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
