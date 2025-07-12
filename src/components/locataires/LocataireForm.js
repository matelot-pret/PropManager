import React, { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Users, Save, X, Trash2, Plus } from "lucide-react";
import { Bien } from "@/entities/Bien";

export default function LocataireForm({
  locataire,
  chambresDisponibles,
  onSubmit,
  onCancel,
}) {
  const [formData, setFormData] = useState(
    locataire || {
      prenom: "",
      nom: "",
      email: "",
      telephone: "",
      age: "",
      profession: "",
      sera_seul: true,
      chambre_id: "",
      co_occupants: [],
    }
  );
  const [biens, setBiens] = useState([]);

  useEffect(() => {
    const fetchBiens = async () => {
      const allBiens = await Bien.list();
      setBiens(allBiens);
    };
    fetchBiens();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      age: formData.age ? parseInt(formData.age) : null,
      co_occupants: formData.co_occupants.map((co) => ({
        ...co,
        age: co.age ? parseInt(co.age) : null,
      })),
    });
  };

  const handleCoOccupantChange = (index, field, value) => {
    const newCoOccupants = [...formData.co_occupants];
    newCoOccupants[index][field] = value;
    setFormData({ ...formData, co_occupants: newCoOccupants });
  };

  const addCoOccupant = () => {
    setFormData({
      ...formData,
      co_occupants: [
        ...formData.co_occupants,
        { nom: "", sexe: "", age: "", telephone: "" },
      ],
    });
  };

  const removeCoOccupant = (index) => {
    const newCoOccupants = formData.co_occupants.filter((_, i) => i !== index);
    setFormData({ ...formData, co_occupants: newCoOccupants });
  };

  const getBienFromChambre = (chambreId) => {
    const chambre = chambresDisponibles.find((c) => c.id === chambreId);
    if (!chambre) return null;
    return biens.find((b) => b.id === chambre.bien_id);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="p-6 border-b border-slate-100">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
          <Users className="w-6 h-6 text-blue-600" />
          {locataire ? "Modifier le Locataire" : "Nouveau Locataire"}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="p-6 space-y-6">
          <div className="text-center bg-slate-50 p-4 rounded-lg">
            <h3 className="font-semibold text-slate-800">
              Locataire Principal
            </h3>
            <p className="text-sm text-slate-500">
              Cette personne est responsable du paiement du loyer et du contrat.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom *</Label>
              <Input
                id="prenom"
                value={formData.prenom}
                onChange={(e) =>
                  setFormData({ ...formData, prenom: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nom">Nom *</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) =>
                  setFormData({ ...formData, nom: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone *</Label>
              <Input
                id="telephone"
                value={formData.telephone}
                onChange={(e) =>
                  setFormData({ ...formData, telephone: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Âge *</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profession">Profession *</Label>
              <Input
                id="profession"
                value={formData.profession}
                onChange={(e) =>
                  setFormData({ ...formData, profession: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="chambre_id">Chambre à louer *</Label>
            <Select
              value={formData.chambre_id}
              onValueChange={(value) =>
                setFormData({ ...formData, chambre_id: value })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une chambre disponible" />
              </SelectTrigger>
              <SelectContent>
                {chambresDisponibles.map((chambre) => {
                  const bien = getBienFromChambre(chambre.id);
                  return (
                    <SelectItem key={chambre.id} value={chambre.id}>
                      {chambre.nom} ({bien ? bien.nom : "Bien inconnu"}) -{" "}
                      {chambre.loyer_mensuel}€
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 pt-4">
            <Switch
              id="sera_seul"
              checked={formData.sera_seul}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, sera_seul: checked })
              }
            />
            <Label htmlFor="sera_seul">
              Le locataire sera seul dans le logement
            </Label>
          </div>

          {!formData.sera_seul && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold text-slate-800">Co-occupants</h3>
              {formData.co_occupants.map((co, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg relative"
                >
                  <Input
                    placeholder="Nom complet *"
                    value={co.nom}
                    onChange={(e) =>
                      handleCoOccupantChange(index, "nom", e.target.value)
                    }
                    required
                  />
                  <Select
                    value={co.sexe}
                    onValueChange={(value) =>
                      handleCoOccupantChange(index, "sexe", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sexe *" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="homme">Homme</SelectItem>
                      <SelectItem value="femme">Femme</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Âge *"
                    type="number"
                    value={co.age}
                    onChange={(e) =>
                      handleCoOccupantChange(index, "age", e.target.value)
                    }
                    required
                  />
                  <Input
                    placeholder="Téléphone"
                    value={co.telephone}
                    onChange={(e) =>
                      handleCoOccupantChange(index, "telephone", e.target.value)
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-1 right-1"
                    onClick={() => removeCoOccupant(index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addCoOccupant}>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un co-occupant
              </Button>
            </div>
          )}
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
            {locataire ? "Enregistrer" : "Créer le Locataire"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
