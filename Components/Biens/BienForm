import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Building2, Save, X } from "lucide-react";

export default function BienForm({ bien, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(
    bien || {
      nom: "",
      adresse: "",
      type: "",
      surface: "",
      nb_pieces: "",
      loyer_mensuel: "",
      charges: "",
      depot_garantie: "",
      statut: "libre",
      description: "",
      date_acquisition: "",
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      surface: formData.surface ? parseFloat(formData.surface) : null,
      nb_pieces: formData.nb_pieces ? parseInt(formData.nb_pieces) : null,
      loyer_mensuel: formData.loyer_mensuel
        ? parseFloat(formData.loyer_mensuel)
        : 0,
      charges: formData.charges ? parseFloat(formData.charges) : null,
      depot_garantie: formData.depot_garantie
        ? parseFloat(formData.depot_garantie)
        : null,
    });
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="p-6 border-b border-slate-100">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
          <Building2 className="w-6 h-6 text-blue-600" />
          {bien ? "Modifier le Bien" : "Nouveau Bien"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom du bien *</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) =>
                  setFormData({ ...formData, nom: e.target.value })
                }
                placeholder="Ex: Appartement Centre-ville"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type de bien *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="appartement">Appartement</SelectItem>
                  <SelectItem value="maison">Maison</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="bureau">Bureau</SelectItem>
                  <SelectItem value="local_commercial">
                    Local Commercial
                  </SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adresse">Adresse complète *</Label>
            <Input
              id="adresse"
              value={formData.adresse}
              onChange={(e) =>
                setFormData({ ...formData, adresse: e.target.value })
              }
              placeholder="Adresse complète du bien"
              required
            />
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
              <Label htmlFor="nb_pieces">Nombre de pièces</Label>
              <Input
                id="nb_pieces"
                type="number"
                value={formData.nb_pieces}
                onChange={(e) =>
                  setFormData({ ...formData, nb_pieces: e.target.value })
                }
                placeholder="Nombre"
              />
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
                  <SelectItem value="loue">Loué</SelectItem>
                  <SelectItem value="en_travaux">En Travaux</SelectItem>
                  <SelectItem value="hors_service">Hors Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
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
                placeholder="Montant"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="charges">Charges (€)</Label>
              <Input
                id="charges"
                type="number"
                step="0.01"
                value={formData.charges}
                onChange={(e) =>
                  setFormData({ ...formData, charges: e.target.value })
                }
                placeholder="Montant"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="depot_garantie">Dépôt de garantie (€)</Label>
              <Input
                id="depot_garantie"
                type="number"
                step="0.01"
                value={formData.depot_garantie}
                onChange={(e) =>
                  setFormData({ ...formData, depot_garantie: e.target.value })
                }
                placeholder="Montant"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_acquisition">Date d'acquisition</Label>
            <Input
              id="date_acquisition"
              type="date"
              value={formData.date_acquisition}
              onChange={(e) =>
                setFormData({ ...formData, date_acquisition: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Description détaillée du bien..."
              className="h-24"
            />
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              <Save className="w-4 h-4 mr-2" />
              {bien ? "Modifier" : "Créer"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
