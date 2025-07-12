# 🏗️ Stratégie Backend - PropManager

## 🎯 Recommandation : Architecture Progressive

### **Phase 1 : API Layer (Immédiat)**

```javascript
// services/api.js
class ApiService {
  constructor(baseURL = "http://localhost:3001/api") {
    this.baseURL = baseURL;
  }

  // Remplace les mock entities
  async get(endpoint) {
    // Pour l'instant : localStorage
    // Plus tard : vrai API
    return JSON.parse(localStorage.getItem(endpoint) || "[]");
  }

  async post(endpoint, data) {
    const existing = await this.get(endpoint);
    const newItem = { ...data, id: Date.now() };
    existing.push(newItem);
    localStorage.setItem(endpoint, JSON.stringify(existing));
    return newItem;
  }
}

// Adaptation des Entities existantes
export class Bien {
  static api = new ApiService();

  static async list() {
    return await this.api.get("biens");
  }

  static async create(data) {
    return await this.api.post("biens", data);
  }
}
```

### **Phase 2 : Backend Simple (Court terme)**

**Stack recommandée :**

- **Node.js + Express** (familier, rapide)
- **PostgreSQL** (robuste pour immobilier)
- **Prisma ORM** (type-safe, migrations)

### **Phase 3 : Backend Scalable (Long terme)**

**Option Premium :**

- **Next.js API Routes** (full-stack React)
- **Supabase** (PostgreSQL + Auth + Real-time)
- **tRPC** (type-safe API)

## 🚀 Migration Path

1. **Semaine 1** : Créer ApiService + localStorage
2. **Semaine 2** : Mise en place Express + PostgreSQL
3. **Semaine 3** : Migration progressive des entities
4. **Semaine 4** : Authentication + sécurité

## 📊 Schéma DB Recommandé

```sql
-- Structure relationnelle pour immobilier
CREATE TABLE biens (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  adresse TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  surface DECIMAL(8,2),
  nb_pieces INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE chambres (
  id SERIAL PRIMARY KEY,
  bien_id INTEGER REFERENCES biens(id),
  nom VARCHAR(255) NOT NULL,
  surface DECIMAL(8,2),
  loyer_mensuel DECIMAL(10,2),
  statut VARCHAR(20) DEFAULT 'libre'
);

-- Relations 1:N optimisées
CREATE INDEX idx_chambres_bien_id ON chambres(bien_id);
CREATE INDEX idx_locataires_chambre_id ON locataires(chambre_id);
```
