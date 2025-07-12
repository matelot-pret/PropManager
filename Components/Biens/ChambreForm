import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BedDouble, Save, X } from "lucide-react";

export default function ChambreForm({ chambre, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(
    chambre || {
      nom: "",
      surface: "",
      type_chambre: "privee",
      loyer_mensuel: "",
      description: "",
      statut: "libre",
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      surface: formData.surface ? parseFloat(formData.surface) : null,
      loyer_mensuel: formData.loyer_mensuel
        ? parseFloat(formData.loyer_mensuel)
        : 0,
    });
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="p-6 border-b border-slate-100">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
          <BedDouble className="w-6 h-6 text-blue-600" />
          {chambre ? "Modifier la Chambre" : "Nouvelle Chambre"}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom de la chambre *</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) =>
                  setFormData({ ...formData, nom: e.target.value })
                }
                placeholder="Ex: Chambre Côté Jardin"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loyer_mensuel">Loyer mensuel (€) *</Label>
              <Input
                id="loyer_mensuel"
                type="number"
                step="0.01"
                value={formData.loyer_mensuel}
                onChange={(e) =>
                  setFormData({ ...formData, loyer_mensuel: e.target.value })
                }
                placeholder="Montant du loyer"
                required
              />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="surface">Surface (m²)</Label>
              <Input
                id="surface"
                type="number"
                step="0.1"
                value={formData.surface}
                onChange={(e) =>
                  setFormData({ ...formData, surface: e.target.value })
                }
                placeholder="Surface"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type_chambre">Type</Label>
              <Select
                value={formData.type_chambre}
                onValueChange={(value) =>
                  setFormData({ ...formData, type_chambre: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="privee">Privée</SelectItem>
                  <SelectItem value="partagee">Partagée</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="statut">Statut</Label>
              <Select
                value={formData.statut}
                onValueChange={(value) =>
                  setFormData({ ...formData, statut: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="libre">Libre</SelectItem>
                  <SelectItem value="louee">Louée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Détails sur la chambre..."
              className="h-24"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 p-6 bg-slate-50">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Annuler
          </Button>
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {chambre ? "Enregistrer les modifications" : "Ajouter la chambre"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
