# 📚 Phase 1 : Plan d'Apprentissage PropManager

## 🎯 Objectif : Maîtrise Complète du Stack

### **Semaine 1 : Fondations TypeScript + Architecture**

#### **Jour 1-2 : TypeScript Immersion**

```typescript
// Exercice pratique : Typer vos entities existantes
interface Bien {
  id: number;
  nom: string;
  adresse: string;
  type: "appartement" | "maison" | "studio" | "bureau" | "local_commercial";
  surface?: number;
  nb_pieces?: number;
  loyer_mensuel: number;
  charges: number;
  depot_garantie: number;
  statut: "libre" | "loue";
  description?: string;
  created_at: Date;
  updated_at: Date;
}

// Challenge : Convertir 1 fichier par jour
// Jour 1 : Entities/Bien → types/Bien.ts
// Jour 2 : Pages/Biens → pages/Biens.tsx
```

#### **Jour 3-4 : React Patterns Avancés**

```typescript
// Pattern : Custom Hooks
function useBienForm(initialBien?: Bien) {
  const [bien, setBien] = useState<Partial<Bien>>(initialBien || {});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!bien.nom?.trim()) {
      newErrors.nom = "Le nom est requis";
    }

    if (!bien.adresse?.trim()) {
      newErrors.adresse = "L'adresse est requise";
    }

    if (!bien.loyer_mensuel || bien.loyer_mensuel <= 0) {
      newErrors.loyer_mensuel = "Le loyer doit être positif";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [bien]);

  return { bien, setBien, errors, validate };
}

// Pattern : Compound Components
export function BienCard({ children, bien, ...props }) {
  return (
    <BienCardContext.Provider value={{ bien }}>
      <Card {...props}>{children}</Card>
    </BienCardContext.Provider>
  );
}

BienCard.Header = function BienCardHeader({ children }) {
  const { bien } = useBienCardContext();
  return (
    <CardHeader>
      <h3>{bien.nom}</h3>
      {children}
    </CardHeader>
  );
};

BienCard.Body = function BienCardBody({ children }) {
  return <CardContent>{children}</CardContent>;
};

// Utilisation élégante
<BienCard bien={bien}>
  <BienCard.Header>
    <Badge>{bien.statut}</Badge>
  </BienCard.Header>
  <BienCard.Body>
    <p>{bien.adresse}</p>
  </BienCard.Body>
</BienCard>;
```

#### **Jour 5-7 : State Management Professionnel**

```typescript
// Challenge : Implémenter Zustand step-by-step
// Jour 5 : Store basique
// Jour 6 : Middleware (devtools, persist)
// Jour 7 : Slices modulaires

// Store modulaire avec slices
interface BienSlice {
  biens: Bien[];
  selectedBien: Bien | null;
  isLoading: boolean;

  // Actions
  loadBiens: () => Promise<void>;
  selectBien: (bien: Bien) => void;
  createBien: (data: CreateBienData) => Promise<void>;
}

interface ChambreSlice {
  chambres: Chambre[];
  selectedChambre: Chambre | null;

  loadChambres: (bienId: number) => Promise<void>;
  selectChambre: (chambre: Chambre) => void;
}

// Store composé
type AppState = BienSlice & ChambreSlice;

const createBienSlice: StateCreator<AppState, [], [], BienSlice> = (
  set,
  get
) => ({
  biens: [],
  selectedBien: null,
  isLoading: false,

  loadBiens: async () => {
    set({ isLoading: true });
    const biens = await BienService.list();
    set({ biens, isLoading: false });
  },

  selectBien: (bien) => set({ selectedBien: bien }),

  createBien: async (data) => {
    const newBien = await BienService.create(data);
    set((state) => ({ biens: [...state.biens, newBien] }));
  },
});

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (...args) => ({
        ...createBienSlice(...args),
        ...createChambreSlice(...args),
      }),
      { name: "propmanager-storage" }
    )
  )
);
```

### **Semaine 2 : Backend + API Design**

#### **Jour 8-10 : Node.js + Express API**

```typescript
// Structure backend professionnelle
src/
├── controllers/
│   ├── BienController.ts
│   ├── ChambreController.ts
│   └── LocataireController.ts
├── services/
│   ├── BienService.ts
│   └── EmailService.ts
├── models/
│   ├── Bien.ts
│   └── Chambre.ts
├── middleware/
│   ├── auth.ts
│   ├── validation.ts
│   └── errorHandler.ts
├── routes/
│   ├── biens.ts
│   └── chambres.ts
└── app.ts

// Controller pattern
export class BienController {
  static async list(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, type, statut } = req.query;

      const filters = {
        ...(type && { type }),
        ...(statut && { statut })
      };

      const result = await BienService.list({
        page: Number(page),
        limit: Number(limit),
        filters
      });

      res.json({
        success: true,
        data: result.biens,
        meta: {
          total: result.total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(result.total / Number(limit))
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const bienData = req.body;

      // Validation avec Joi ou Zod
      const { error, value } = BienSchema.validate(bienData);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Données invalides',
          errors: error.details
        });
      }

      const nouveauBien = await BienService.create(value);

      res.status(201).json({
        success: true,
        data: nouveauBien,
        message: 'Bien créé avec succès'
      });
    } catch (error) {
      next(error);
    }
  }
}
```

#### **Jour 11-12 : Base de Données + Prisma**

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Bien {
  id               Int       @id @default(autoincrement())
  nom              String
  adresse          String
  type             TypeBien
  surface          Float?
  nb_pieces        Int?
  loyer_mensuel    Float
  charges          Float     @default(0)
  depot_garantie   Float
  statut           StatutBien @default(LIBRE)
  description      String?
  created_at       DateTime  @default(now())
  updated_at       DateTime  @updatedAt

  // Relations
  chambres         Chambre[]

  @@map("biens")
}

model Chambre {
  id               Int       @id @default(autoincrement())
  bien_id          Int
  nom              String
  surface          Float?
  loyer_mensuel    Float
  statut           StatutChambre @default(LIBRE)

  // Relations
  bien             Bien      @relation(fields: [bien_id], references: [id], onDelete: Cascade)
  contrats         ContratBail[]

  @@map("chambres")
}

model Locataire {
  id               Int       @id @default(autoincrement())
  prenom           String
  nom              String
  email            String    @unique
  telephone        String?
  age              Int?
  profession       String?
  sera_seul        Boolean   @default(true)
  statut           StatutLocataire @default(CANDIDAT)

  // Relations
  contrats         ContratBail[]
  co_occupants     CoOccupant[]

  @@map("locataires")
}

enum TypeBien {
  APPARTEMENT
  MAISON
  STUDIO
  BUREAU
  LOCAL_COMMERCIAL
  AUTRE
}

enum StatutBien {
  LIBRE
  LOUE
}

enum StatutChambre {
  LIBRE
  LOUEE
}

enum StatutLocataire {
  CANDIDAT
  ACTIF
  ANCIEN
}
```

#### **Jour 13-14 : Testing Strategy**

```typescript
// tests/integration/biens.test.ts
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { app } from "../src/app";
import request from "supertest";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Biens API", () => {
  beforeEach(async () => {
    // Clean database
    await prisma.bien.deleteMany();
  });

  afterEach(async () => {
    await prisma.bien.deleteMany();
  });

  describe("POST /api/biens", () => {
    it("devrait créer un nouveau bien", async () => {
      const bienData = {
        nom: "Test Appartement",
        adresse: "123 Rue Test",
        type: "APPARTEMENT",
        loyer_mensuel: 1000,
        charges: 100,
        depot_garantie: 2000,
      };

      const response = await request(app)
        .post("/api/biens")
        .send(bienData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.nom).toBe(bienData.nom);
      expect(response.body.data.id).toBeDefined();
    });

    it("devrait rejeter des données invalides", async () => {
      const invalidData = {
        nom: "", // nom vide
        adresse: "123 Rue Test",
        loyer_mensuel: -100, // négatif
      };

      const response = await request(app)
        .post("/api/biens")
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe("GET /api/biens", () => {
    it("devrait retourner une liste paginée", async () => {
      // Créer des données test
      await Promise.all([
        prisma.bien.create({
          data: {
            nom: "Bien 1",
            adresse: "Adresse 1",
            type: "APPARTEMENT",
            loyer_mensuel: 1000,
            depot_garantie: 2000,
          },
        }),
        prisma.bien.create({
          data: {
            nom: "Bien 2",
            adresse: "Adresse 2",
            type: "MAISON",
            loyer_mensuel: 1500,
            depot_garantie: 3000,
          },
        }),
      ]);

      const response = await request(app)
        .get("/api/biens?page=1&limit=10")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.meta.total).toBe(2);
      expect(response.body.meta.page).toBe(1);
    });
  });
});

// tests/unit/services/BienService.test.ts
describe("BienService", () => {
  it("devrait calculer le rendement locatif", () => {
    const bien = {
      loyer_mensuel: 1000,
      charges: 100,
      prix_achat: 200000,
    };

    const rendement = BienService.calculerRendement(bien);

    // (1000 * 12) / 200000 * 100 = 6%
    expect(rendement).toBe(6);
  });
});
```

### **Semaine 3 : DevOps + Déploiement**

#### **Jour 15-17 : Docker + CI/CD**

```dockerfile
# Dockerfile.frontend
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: propmanager_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run type check
        run: npm run type-check

      - name: Run tests
        run: npm run test:coverage
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/propmanager_test

      - name: Upload coverage
        uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Build Docker image
        run: docker build -t propmanager:${{ github.sha }} .

      - name: Push to registry
        if: github.ref == 'refs/heads/main'
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push propmanager:${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Deploy to staging
        run: |
          # Deploy script here
          echo "Deploying to staging..."
```

#### **Jour 18-21 : Monitoring + Analytics**

```typescript
// utils/analytics.ts
export class Analytics {
  private static instance: Analytics;

  static getInstance() {
    if (!this.instance) {
      this.instance = new Analytics();
    }
    return this.instance;
  }

  trackBienCreation(bien: Bien) {
    this.track('bien_created', {
      type: bien.type,
      loyer_mensuel: bien.loyer_mensuel,
      surface: bien.surface
    });
  }

  trackUserAction(action: string, properties?: Record<string, any>) {
    this.track(action, properties);
  }

  private track(event: string, properties?: Record<string, any>) {
    // En développement : console
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics:', event, properties);
      return;
    }

    // En production : service analytics réel
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, properties, timestamp: new Date().toISOString() })
    });
  }
}

// Hook React
export function useAnalytics() {
  const analytics = Analytics.getInstance();

  return {
    trackBienCreation: analytics.trackBienCreation.bind(analytics),
    trackUserAction: analytics.trackUserAction.bind(analytics)
  };
}

// Utilisation dans vos composants
export function BienForm() {
  const { trackBienCreation } = useAnalytics();

  const handleSubmit = async (bienData) => {
    const nouveauBien = await createBien(bienData);
    trackBienCreation(nouveauBien);
  };

  return (
    // Votre formulaire...
  );
}
```

## 📊 **Métriques d'Apprentissage**

### **Checklist Semaine 1 :**

- [ ] TypeScript : Convertir 3 fichiers sans erreurs
- [ ] React : Créer 2 custom hooks fonctionnels
- [ ] Zustand : Store avec 3 slices + persistence
- [ ] Tests : 1 test unitaire + 1 test composant

### **Checklist Semaine 2 :**

- [ ] API : 5 endpoints CRUD complets
- [ ] Database : Schema + migrations
- [ ] Validation : Middleware robuste
- [ ] Tests : Coverage > 70%

### **Checklist Semaine 3 :**

- [ ] Docker : Build + run sans erreurs
- [ ] CI/CD : Pipeline GitHub Actions
- [ ] Monitoring : Métriques de base
- [ ] Documentation : README complet

## 🎯 **Objectifs Mesurables**

**Après Phase 1, vous devrez :**

1. **Expliquer** chaque ligne de code de votre projet
2. **Déboguer** n'importe quel problème rapidement
3. **Ajouter** une nouvelle feature en < 2h
4. **Déployer** en production en 1 clic
5. **Présenter** le projet avec confiance

Cette base solide vous permettra d'aborder sereinement les phases Portfolio et Clients !

Êtes-vous prêt à commencer par la migration TypeScript cette semaine ?
