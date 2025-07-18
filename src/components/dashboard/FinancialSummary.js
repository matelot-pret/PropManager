import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
export default function FinancialSummary() {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="p-6 border-b border-slate-100">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
          <DollarSign className="w-6 h-6 text-green-600" />
          Résumé Financier
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-500">
              Revenus ce Mois
            </p>
            <p className="text-2xl font-bold text-slate-900">0 €</p>
            <div className="flex items-center text-green-600 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+0% vs mois dernier</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-500">
              Dépenses ce Mois
            </p>
            <p className="text-2xl font-bold text-slate-900">0 €</p>
            <div className="flex items-center text-red-500 text-sm">
              <TrendingDown className="w-4 h-4 mr-1" />
              <span>+0% vs mois dernier</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-500">Bénéfice Net</p>
            <p className="text-2xl font-bold text-green-600">0 €</p>
            <div className="flex items-center text-green-600 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>Excellent</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
