import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Euro,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import fr from "date-fns/locale/fr"; // This import is no longer strictly needed for the new format, but keeping it doesn't harm.

const statutColors = {
  paye: "bg-green-100 text-green-800 border-green-200",
  en_attente: "bg-yellow-100 text-yellow-800 border-yellow-200",
  en_retard: "bg-red-100 text-red-800 border-red-200",
  partiel: "bg-orange-100 text-orange-800 border-orange-200",
};

const statutIcons = {
  paye: CheckCircle,
  en_attente: Clock,
  en_retard: AlertCircle,
  partiel: XCircle,
};

const moisNoms = [
  "",
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

export default function LooyersHistorique({ loyers }) {
  const loyersRecents = loyers.slice(0, 12); // Afficher les 12 derniers loyers

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="p-6 border-b border-slate-100">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
          <Euro className="w-6 h-6 text-green-600" />
          Historique des Loyers
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {loyersRecents.length === 0 ? (
          <div className="p-8 text-center">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-semibold text-slate-900 mb-2">
              Aucun historique
            </h3>
            <p className="text-slate-500">
              Aucun loyer enregistré pour cette chambre.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>Période</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Échéance</TableHead>
                  <TableHead>Paiement</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loyersRecents.map((loyer) => {
                  const StatutIcon = statutIcons[loyer.statut] || Clock;
                  return (
                    <TableRow key={loyer.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium">
                        {moisNoms[loyer.mois]} {loyer.annee}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-semibold text-green-600">
                            {loyer.montant_total.toLocaleString()} €
                          </div>
                          {loyer.montant_charges && (
                            <div className="text-xs text-slate-500">
                              dont {loyer.montant_charges.toLocaleString()} € de
                              charges
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {loyer.date_echeance
                          ? format(new Date(loyer.date_echeance), "dd/MM/yyyy")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {loyer.date_paiement ? (
                          <div>
                            <div className="text-sm">
                              {format(
                                new Date(loyer.date_paiement),
                                "dd/MM/yyyy"
                              )}
                            </div>
                            {loyer.mode_paiement && (
                              <div className="text-xs text-slate-500 capitalize">
                                {loyer.mode_paiement.replace("_", " ")}
                              </div>
                            )}
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            statutColors[loyer.statut]
                          } border flex items-center gap-1 w-fit`}
                        >
                          <StatutIcon className="w-3 h-3" />
                          {loyer.statut === "paye"
                            ? "Payé"
                            : loyer.statut === "en_attente"
                            ? "En attente"
                            : loyer.statut === "en_retard"
                            ? "En retard"
                            : loyer.statut === "partiel"
                            ? "Partiel"
                            : loyer.statut}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
