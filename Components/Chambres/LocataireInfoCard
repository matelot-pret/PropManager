import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User,
  Phone,
  Mail,
  Briefcase,
  Calendar,
  Users,
  Edit,
} from "lucide-react";
import { format } from "date-fns";

export default function LocataireInfoCard({ locataire, contrat }) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
            <User className="w-6 h-6 text-green-600" />
            Locataire Actuel
          </CardTitle>
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Modifier
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="text-center pb-4 border-b border-slate-100">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            {locataire.prenom} {locataire.nom}
          </h3>
          <Badge className="bg-green-100 text-green-800 border-green-200 mt-2">
            Locataire actif
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-600">{locataire.email}</span>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-600">
              {locataire.telephone}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Briefcase className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-600">
              {locataire.profession}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-600">{locataire.age} ans</span>
          </div>
        </div>

        {!locataire.sera_seul &&
          locataire.co_occupants &&
          locataire.co_occupants.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Co-occupants ({locataire.co_occupants.length})
              </h4>
              <div className="space-y-2">
                {locataire.co_occupants.map((co, index) => (
                  <div key={index} className="bg-slate-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-900">
                        {co.nom}
                      </span>
                      <Badge variant="outline" className="text-xs capitalize">
                        {co.sexe}
                      </Badge>
                    </div>
                    <div className="text-sm text-slate-500 mt-1">
                      {co.age} ans {co.telephone && `• ${co.telephone}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {contrat && (
          <div className="pt-4 border-t border-slate-100">
            <h4 className="font-semibold text-slate-900 mb-2">Bail en cours</h4>
            <p className="text-sm text-slate-600">
              Du {format(new Date(contrat.date_debut), "dd/MM/yyyy")}
              {contrat.date_fin &&
                ` au ${format(new Date(contrat.date_fin), "dd/MM/yyyy")}`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
