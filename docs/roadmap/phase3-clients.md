# 💼 Phase 3 : Clients PropManager

## 🎯 Objectif : Application Client-Ready

### **Semaine 6-7 : Production & Sécurité**

#### **Jour 32-35 : Sécurité Enterprise**

```typescript
// security/auth.ts
export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET!;
  private static readonly REFRESH_SECRET = process.env.REFRESH_SECRET!;

  static async login(email: string, password: string) {
    // Validation stricte
    const user = await UserService.findByEmail(email);
    if (!user) {
      throw new AuthError("Utilisateur non trouvé", "USER_NOT_FOUND");
    }

    // Vérification mot de passe avec bcrypt
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      // Log tentative d'intrusion
      await SecurityLog.create({
        type: "FAILED_LOGIN",
        email,
        ip: request.ip,
        user_agent: request.headers["user-agent"],
      });

      throw new AuthError("Mot de passe incorrect", "INVALID_PASSWORD");
    }

    // Génération des tokens
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      this.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, type: "refresh" },
      this.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Stockage du refresh token
    await RefreshToken.create({
      user_id: user.id,
      token: refreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // Log connexion réussie
    await SecurityLog.create({
      type: "SUCCESSFUL_LOGIN",
      user_id: user.id,
      ip: request.ip,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        nom: user.nom,
        role: user.role,
      },
    };
  }

  static async refreshAccessToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, this.REFRESH_SECRET) as any;

      // Vérifier que le token existe en base
      const storedToken = await RefreshToken.findOne({
        where: {
          token: refreshToken,
          user_id: decoded.userId,
          expires_at: { $gt: new Date() },
        },
      });

      if (!storedToken) {
        throw new AuthError("Token invalide", "INVALID_REFRESH_TOKEN");
      }

      // Générer un nouveau access token
      const user = await UserService.findById(decoded.userId);
      const accessToken = jwt.sign(
        { userId: user.id, role: user.role },
        this.JWT_SECRET,
        { expiresIn: "15m" }
      );

      return { accessToken };
    } catch (error) {
      throw new AuthError("Token expiré", "EXPIRED_REFRESH_TOKEN");
    }
  }
}

// middleware/auth.ts
export function requireAuth(roles?: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        return res.status(401).json({ error: "Token manquant" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      const user = await UserService.findById(decoded.userId);

      if (!user) {
        return res.status(401).json({ error: "Utilisateur invalide" });
      }

      if (roles && !roles.includes(user.role)) {
        return res.status(403).json({ error: "Permissions insuffisantes" });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ error: "Token invalide" });
    }
  };
}

// middleware/security.ts
export function securityMiddleware() {
  return [
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            "https://fonts.googleapis.com",
          ],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:"],
          scriptSrc: ["'self'"],
        },
      },
    }),

    // Rate limiting
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limite à 100 requêtes par IP
      message: "Trop de requêtes, veuillez réessayer plus tard",
      standardHeaders: true,
      legacyHeaders: false,
    }),

    // Rate limiting pour les tentatives de connexion
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 5,
      skipSuccessfulRequests: true,
      keyGenerator: (req) => req.body.email || req.ip,
    }),

    cors({
      origin: process.env.ALLOWED_ORIGINS?.split(",") || [
        "http://localhost:3000",
      ],
      credentials: true,
    }),

    // Protection CSRF
    csrf({
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      },
    }),
  ];
}
```

#### **Jour 36-38 : Multi-tenancy & Isolation**

```typescript
// models/Tenant.ts
export interface Tenant {
  id: number;
  nom: string;
  subdomain: string;
  plan: "basic" | "premium" | "enterprise";
  max_biens: number;
  max_users: number;
  features: string[];
  created_at: Date;
  expires_at?: Date;
}

// middleware/tenant.ts
export async function tenantMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Extraire le tenant depuis le sous-domaine ou header
    const subdomain = req.headers.host?.split(".")[0];
    const tenantId = req.headers["x-tenant-id"];

    let tenant: Tenant;

    if (subdomain && subdomain !== "www" && subdomain !== "api") {
      tenant = await TenantService.findBySubdomain(subdomain);
    } else if (tenantId) {
      tenant = await TenantService.findById(Number(tenantId));
    } else {
      return res.status(400).json({ error: "Tenant non spécifié" });
    }

    if (!tenant) {
      return res.status(404).json({ error: "Tenant non trouvé" });
    }

    // Vérifier l'expiration
    if (tenant.expires_at && tenant.expires_at < new Date()) {
      return res.status(403).json({ error: "Abonnement expiré" });
    }

    // Ajouter le tenant au contexte
    req.tenant = tenant;

    // Configurer la connexion DB pour ce tenant
    await DatabaseService.setTenantContext(tenant.id);

    next();
  } catch (error) {
    console.error("Erreur middleware tenant:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

// services/TenantService.ts
export class TenantService {
  static async createTenant(data: CreateTenantData): Promise<Tenant> {
    const tenant = await prisma.tenant.create({
      data: {
        nom: data.nom,
        subdomain: data.subdomain,
        plan: data.plan,
        max_biens: this.getPlanLimits(data.plan).biens,
        max_users: this.getPlanLimits(data.plan).users,
        features: this.getPlanFeatures(data.plan),
      },
    });

    // Créer la base de données dédiée
    await this.createTenantDatabase(tenant.id);

    // Créer l'utilisateur admin
    await UserService.createTenantAdmin(tenant.id, data.admin);

    return tenant;
  }

  static async createTenantDatabase(tenantId: number) {
    const dbName = `propmanager_tenant_${tenantId}`;

    // Créer la base de données
    await prisma.$executeRawUnsafe(`CREATE DATABASE ${dbName}`);

    // Exécuter les migrations
    await execSync(
      `npx prisma migrate deploy --database-url="postgresql://user:pass@localhost:5432/${dbName}"`
    );
  }

  static getPlanLimits(plan: string) {
    const limits = {
      basic: { biens: 10, users: 2 },
      premium: { biens: 50, users: 5 },
      enterprise: { biens: -1, users: -1 }, // illimité
    };
    return limits[plan] || limits.basic;
  }

  static getPlanFeatures(plan: string): string[] {
    const features = {
      basic: ["biens", "locataires", "contrats"],
      premium: ["biens", "locataires", "contrats", "rapports", "analytics"],
      enterprise: [
        "biens",
        "locataires",
        "contrats",
        "rapports",
        "analytics",
        "api",
        "webhooks",
        "white_label",
      ],
    };
    return features[plan] || features.basic;
  }
}

// utils/feature-flags.ts
export class FeatureFlags {
  static hasFeature(tenant: Tenant, feature: string): boolean {
    return tenant.features.includes(feature);
  }

  static requireFeature(feature: string) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!this.hasFeature(req.tenant, feature)) {
        return res.status(403).json({
          error: "Fonctionnalité non disponible",
          required_plan: this.getRequiredPlan(feature),
        });
      }
      next();
    };
  }

  static getRequiredPlan(feature: string): string {
    const featurePlans = {
      rapports: "premium",
      analytics: "premium",
      api: "enterprise",
      webhooks: "enterprise",
      white_label: "enterprise",
    };
    return featurePlans[feature] || "basic";
  }
}

// Utilisation dans les routes
app.get(
  "/api/rapports",
  tenantMiddleware,
  requireAuth(),
  FeatureFlags.requireFeature("rapports"),
  RapportController.list
);
```

#### **Jour 39-42 : Système de Facturation**

```typescript
// models/Subscription.ts
export interface Subscription {
  id: number;
  tenant_id: number;
  plan: "basic" | "premium" | "enterprise";
  status: "active" | "cancelled" | "expired" | "trial";
  started_at: Date;
  ends_at: Date;
  trial_ends_at?: Date;
  stripe_subscription_id?: string;

  // Métriques d'usage
  current_biens: number;
  current_users: number;
  monthly_price: number;
}

// services/BillingService.ts
export class BillingService {
  private static stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  static async createSubscription(
    tenantId: number,
    plan: string,
    paymentMethodId: string
  ) {
    const tenant = await TenantService.findById(tenantId);
    const priceId = this.getPriceId(plan);

    try {
      // Créer le customer Stripe
      const customer = await this.stripe.customers.create({
        metadata: { tenant_id: tenantId.toString() },
      });

      // Attacher la méthode de paiement
      await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customer.id,
      });

      // Créer la subscription
      const subscription = await this.stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        default_payment_method: paymentMethodId,
        expand: ["latest_invoice.payment_intent"],
      });

      // Enregistrer en base
      await prisma.subscription.create({
        data: {
          tenant_id: tenantId,
          plan,
          status: "active",
          started_at: new Date(),
          ends_at: new Date(subscription.current_period_end * 1000),
          stripe_subscription_id: subscription.id,
          monthly_price: this.getPlanPrice(plan),
        },
      });

      return subscription;
    } catch (error) {
      console.error("Erreur création subscription:", error);
      throw new Error("Impossible de créer l'abonnement");
    }
  }

  static async handleWebhook(event: Stripe.Event) {
    switch (event.type) {
      case "invoice.payment_succeeded":
        await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_failed":
        await this.handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case "customer.subscription.deleted":
        await this.handleSubscriptionCancelled(
          event.data.object as Stripe.Subscription
        );
        break;

      case "customer.subscription.updated":
        await this.handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription
        );
        break;
    }
  }

  private static async handlePaymentSucceeded(invoice: Stripe.Invoice) {
    const subscription = await prisma.subscription.findFirst({
      where: { stripe_subscription_id: invoice.subscription as string },
    });

    if (subscription) {
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status: "active",
          ends_at: new Date(invoice.period_end * 1000),
        },
      });

      // Envoyer email de confirmation
      await EmailService.sendPaymentConfirmation(subscription.tenant_id, {
        amount: invoice.amount_paid / 100,
        plan: subscription.plan,
        next_billing: new Date(invoice.period_end * 1000),
      });
    }
  }

  private static async handlePaymentFailed(invoice: Stripe.Invoice) {
    const subscription = await prisma.subscription.findFirst({
      where: { stripe_subscription_id: invoice.subscription as string },
    });

    if (subscription) {
      // Marquer comme expiré après 3 échecs
      const failedAttempts = await prisma.paymentFailure.count({
        where: {
          subscription_id: subscription.id,
          created_at: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
      });

      if (failedAttempts >= 2) {
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: { status: "expired" },
        });

        // Suspendre l'accès
        await TenantService.suspendTenant(subscription.tenant_id);
      }

      // Enregistrer l'échec
      await prisma.paymentFailure.create({
        data: {
          subscription_id: subscription.id,
          amount: invoice.amount_due,
          reason: "payment_failed",
        },
      });

      // Envoyer email d'alerte
      await EmailService.sendPaymentFailedAlert(subscription.tenant_id);
    }
  }

  static getPlanPrice(plan: string): number {
    const prices = {
      basic: 29,
      premium: 79,
      enterprise: 199,
    };
    return prices[plan] || prices.basic;
  }

  static getPriceId(plan: string): string {
    const priceIds = {
      basic: process.env.STRIPE_PRICE_BASIC!,
      premium: process.env.STRIPE_PRICE_PREMIUM!,
      enterprise: process.env.STRIPE_PRICE_ENTERPRISE!,
    };
    return priceIds[plan];
  }
}

// components/BillingManagement.tsx
export function BillingManagement() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const data = await api.get("/billing/subscription");
      setSubscription(data);
    } catch (error) {
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (newPlan: string) => {
    try {
      setLoading(true);
      await api.post("/billing/upgrade", { plan: newPlan });
      toast.success("Plan mis à jour avec succès");
      loadSubscription();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Êtes-vous sûr de vouloir annuler votre abonnement ?")) {
      return;
    }

    try {
      await api.post("/billing/cancel");
      toast.success("Abonnement annulé");
      loadSubscription();
    } catch (error) {
      toast.error("Erreur lors de l'annulation");
    }
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Facturation & Abonnement</h1>

      {/* Current Plan */}
      <PremiumCard>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold mb-2">Plan Actuel</h3>
            <div className="space-y-1">
              <p className="text-2xl font-bold capitalize">
                {subscription?.plan}
              </p>
              <p className="text-gray-400">
                {subscription?.monthly_price}€/mois
              </p>
              <p className="text-sm text-gray-500">
                Prochain paiement :{" "}
                {format(new Date(subscription?.ends_at), "dd/MM/yyyy")}
              </p>
            </div>
          </div>

          <Badge
            variant={
              subscription?.status === "active" ? "success" : "destructive"
            }
          >
            {subscription?.status}
          </Badge>
        </div>
      </PremiumCard>

      {/* Usage Stats */}
      <PremiumCard>
        <h3 className="text-lg font-semibold mb-4">Utilisation</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Biens</p>
            <p className="text-xl font-semibold">
              {subscription?.current_biens} /{" "}
              {subscription?.max_biens === -1 ? "∞" : subscription?.max_biens}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Utilisateurs</p>
            <p className="text-xl font-semibold">
              {subscription?.current_users} /{" "}
              {subscription?.max_users === -1 ? "∞" : subscription?.max_users}
            </p>
          </div>
        </div>
      </PremiumCard>

      {/* Plans Available */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            current={plan.id === subscription?.plan}
            onSelect={() => handleUpgrade(plan.id)}
          />
        ))}
      </div>

      {/* Billing History */}
      <PremiumCard>
        <h3 className="text-lg font-semibold mb-4">Historique des Paiements</h3>
        <BillingHistory />
      </PremiumCard>

      {/* Danger Zone */}
      <PremiumCard className="border-red-500/20">
        <h3 className="text-lg font-semibold mb-4 text-red-400">
          Zone Dangereuse
        </h3>
        <Button
          variant="destructive"
          onClick={handleCancelSubscription}
          disabled={loading}
        >
          Annuler l'abonnement
        </Button>
      </PremiumCard>
    </div>
  );
}
```

### **Semaine 8 : Support Client & Onboarding**

#### **Jour 43-45 : Système de Support**

```typescript
// models/Ticket.ts
export interface SupportTicket {
  id: number;
  tenant_id: number;
  user_id: number;
  subject: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  category: "bug" | "feature" | "question" | "billing";
  assigned_to?: number;
  created_at: Date;
  updated_at: Date;

  // Relations
  messages: TicketMessage[];
  attachments: TicketAttachment[];
}

// components/SupportWidget.tsx
export function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState({
    subject: "",
    description: "",
    priority: "medium",
    category: "question",
  });

  const createTicket = async () => {
    try {
      const ticket = await api.post("/support/tickets", newTicket);
      setTickets((prev) => [ticket, ...prev]);
      setNewTicket({
        subject: "",
        description: "",
        priority: "medium",
        category: "question",
      });
      toast.success("Ticket créé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la création du ticket");
    }
  };

  return (
    <>
      {/* Floating Support Button */}
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-lg flex items-center justify-center text-white z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Support Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Support Client</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
                {/* Quick Actions */}
                <div>
                  <h3 className="font-medium mb-3">Actions Rapides</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="justify-start">
                      <Book className="w-4 h-4 mr-2" />
                      Documentation
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Video className="w-4 h-4 mr-2" />
                      Tutoriels
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Chat en Direct
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Mail className="w-4 h-4 mr-2" />
                      Nous Contacter
                    </Button>
                  </div>
                </div>

                {/* Existing Tickets */}
                {tickets.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-3">Tickets en Cours</h3>
                    <div className="space-y-2">
                      {tickets.slice(0, 3).map((ticket) => (
                        <div key={ticket.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{ticket.subject}</p>
                            <Badge
                              variant={
                                ticket.status === "open"
                                  ? "destructive"
                                  : ticket.status === "in_progress"
                                  ? "default"
                                  : "success"
                              }
                            >
                              {ticket.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {format(
                              new Date(ticket.created_at),
                              "dd/MM/yyyy HH:mm"
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Ticket Form */}
                <div>
                  <h3 className="font-medium mb-3">Créer un Nouveau Ticket</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Catégorie</Label>
                        <Select
                          value={newTicket.category}
                          onValueChange={(value) =>
                            setNewTicket((prev) => ({
                              ...prev,
                              category: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="question">Question</SelectItem>
                            <SelectItem value="bug">Bug</SelectItem>
                            <SelectItem value="feature">
                              Nouvelle Fonctionnalité
                            </SelectItem>
                            <SelectItem value="billing">Facturation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Priorité</Label>
                        <Select
                          value={newTicket.priority}
                          onValueChange={(value) =>
                            setNewTicket((prev) => ({
                              ...prev,
                              priority: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Faible</SelectItem>
                            <SelectItem value="medium">Moyenne</SelectItem>
                            <SelectItem value="high">Élevée</SelectItem>
                            <SelectItem value="urgent">Urgente</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Sujet</Label>
                      <Input
                        value={newTicket.subject}
                        onChange={(e) =>
                          setNewTicket((prev) => ({
                            ...prev,
                            subject: e.target.value,
                          }))
                        }
                        placeholder="Décrivez brièvement votre problème"
                      />
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={newTicket.description}
                        onChange={(e) =>
                          setNewTicket((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Détaillez votre problème ou votre demande"
                        rows={4}
                      />
                    </div>

                    <Button onClick={createTicket} className="w-full">
                      Créer le Ticket
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// services/SupportService.ts
export class SupportService {
  static async createTicket(
    tenantId: number,
    userId: number,
    data: CreateTicketData
  ) {
    const ticket = await prisma.supportTicket.create({
      data: {
        tenant_id: tenantId,
        user_id: userId,
        subject: data.subject,
        description: data.description,
        priority: data.priority,
        category: data.category,
        status: "open",
      },
      include: {
        user: true,
        tenant: true,
      },
    });

    // Notification automatique à l'équipe support
    await this.notifySupport(ticket);

    // Auto-assignment basé sur la catégorie
    const assignee = await this.getAutoAssignee(data.category);
    if (assignee) {
      await this.assignTicket(ticket.id, assignee.id);
    }

    return ticket;
  }

  static async notifySupport(ticket: SupportTicket) {
    const priority =
      ticket.priority === "urgent"
        ? "🚨"
        : ticket.priority === "high"
        ? "⚡"
        : "📋";

    await SlackService.sendMessage({
      channel: "#support",
      text: `${priority} Nouveau ticket: ${ticket.subject}`,
      attachments: [
        {
          color:
            ticket.priority === "urgent"
              ? "danger"
              : ticket.priority === "high"
              ? "warning"
              : "good",
          fields: [
            { title: "Tenant", value: ticket.tenant.nom, short: true },
            { title: "Catégorie", value: ticket.category, short: true },
            { title: "Priorité", value: ticket.priority, short: true },
            {
              title: "Description",
              value: ticket.description.substring(0, 200) + "...",
              short: false,
            },
          ],
        },
      ],
    });
  }

  static async getAutoAssignee(category: string) {
    const assignments = {
      bug: "dev-team",
      billing: "billing-team",
      feature: "product-team",
      question: "support-team",
    };

    const teamId = assignments[category] || "support-team";
    return await this.getAvailableAgent(teamId);
  }
}
```

#### **Jour 46-49 : Onboarding Guidé**

```typescript
// components/OnboardingFlow.tsx
export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({});
  const [progress, setProgress] = useState(0);

  const steps = [
    {
      id: "welcome",
      title: "Bienvenue dans PropManager",
      component: WelcomeStep,
    },
    {
      id: "profile",
      title: "Configurez votre profil",
      component: ProfileStep,
    },
    {
      id: "first-bien",
      title: "Ajoutez votre premier bien",
      component: FirstBienStep,
    },
    {
      id: "team",
      title: "Invitez votre équipe",
      component: TeamStep,
    },
    {
      id: "complete",
      title: "Configuration terminée",
      component: CompleteStep,
    },
  ];

  useEffect(() => {
    setProgress((currentStep / (steps.length - 1)) * 100);
  }, [currentStep]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-6 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">
              Configuration Initiale
            </h1>
            <span className="text-white/70">
              Étape {currentStep + 1} sur {steps.length}
            </span>
          </div>

          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <CurrentStepComponent
            userData={userData}
            setUserData={setUserData}
            nextStep={nextStep}
            prevStep={prevStep}
            isFirst={currentStep === 0}
            isLast={currentStep === steps.length - 1}
          />
        </motion.div>
      </div>
    </div>
  );
}

// components/onboarding/WelcomeStep.tsx
export function WelcomeStep({ nextStep }) {
  return (
    <PremiumCard className="max-w-2xl mx-auto text-center">
      <div className="mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Home className="w-10 h-10 text-white" />
        </motion.div>

        <h2 className="text-3xl font-bold text-white mb-4">
          Bienvenue dans PropManager !
        </h2>

        <p className="text-gray-300 text-lg">
          Félicitations pour avoir choisi la solution de gestion immobilière la
          plus moderne du marché. Nous allons configurer votre compte en
          quelques étapes simples.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Zap className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="font-semibold text-white mb-2">Rapide</h3>
          <p className="text-sm text-gray-400">
            Configuration en moins de 5 minutes
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Shield className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="font-semibold text-white mb-2">Sécurisé</h3>
          <p className="text-sm text-gray-400">Vos données sont protégées</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Heart className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="font-semibold text-white mb-2">Support</h3>
          <p className="text-sm text-gray-400">Équipe disponible 24/7</p>
        </motion.div>
      </div>

      <Button onClick={nextStep} size="lg" className="px-8">
        Commencer la Configuration
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </PremiumCard>
  );
}

// components/onboarding/FirstBienStep.tsx
export function FirstBienStep({ userData, setUserData, nextStep, prevStep }) {
  const [bienData, setBienData] = useState({
    nom: "",
    adresse: "",
    type: "appartement",
    loyer_mensuel: "",
    charges: "",
    depot_garantie: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async () => {
    try {
      const response = await api.post("/biens", {
        ...bienData,
        loyer_mensuel: Number(bienData.loyer_mensuel),
        charges: Number(bienData.charges),
        depot_garantie: Number(bienData.depot_garantie),
      });

      setUserData((prev) => ({ ...prev, firstBien: response.data }));
      setShowSuccess(true);

      setTimeout(() => {
        nextStep();
      }, 2000);
    } catch (error) {
      toast.error("Erreur lors de la création du bien");
    }
  };

  if (showSuccess) {
    return (
      <PremiumCard className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Check className="w-10 h-10 text-white" />
        </motion.div>

        <h2 className="text-2xl font-bold text-white mb-4">
          Premier bien créé avec succès !
        </h2>

        <p className="text-gray-300">
          Excellent ! Votre bien "{bienData.nom}" a été ajouté à votre
          portfolio.
        </p>
      </PremiumCard>
    );
  }

  return (
    <PremiumCard className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Ajoutez votre premier bien
      </h2>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-white">Nom du bien</Label>
            <Input
              value={bienData.nom}
              onChange={(e) =>
                setBienData((prev) => ({ ...prev, nom: e.target.value }))
              }
              placeholder="Appartement Centre-ville"
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          <div>
            <Label className="text-white">Type</Label>
            <Select
              value={bienData.type}
              onValueChange={(value) =>
                setBienData((prev) => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="appartement">Appartement</SelectItem>
                <SelectItem value="maison">Maison</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className="text-white">Adresse</Label>
          <Input
            value={bienData.adresse}
            onChange={(e) =>
              setBienData((prev) => ({ ...prev, adresse: e.target.value }))
            }
            placeholder="123 Rue de la République, 75001 Paris"
            className="bg-white/10 border-white/20 text-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-white">Loyer mensuel (€)</Label>
            <Input
              type="number"
              value={bienData.loyer_mensuel}
              onChange={(e) =>
                setBienData((prev) => ({
                  ...prev,
                  loyer_mensuel: e.target.value,
                }))
              }
              placeholder="1200"
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          <div>
            <Label className="text-white">Charges (€)</Label>
            <Input
              type="number"
              value={bienData.charges}
              onChange={(e) =>
                setBienData((prev) => ({ ...prev, charges: e.target.value }))
              }
              placeholder="100"
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          <div>
            <Label className="text-white">Dépôt de garantie (€)</Label>
            <Input
              type="number"
              value={bienData.depot_garantie}
              onChange={(e) =>
                setBienData((prev) => ({
                  ...prev,
                  depot_garantie: e.target.value,
                }))
              }
              placeholder="2400"
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={prevStep}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Précédent
        </Button>

        <Button onClick={handleSubmit}>
          Créer le Bien
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </PremiumCard>
  );
}
```

## 📋 **Checklist Phase 3 - Clients**

### **Sécurité & Production :**

- [ ] Authentification JWT sécurisée
- [ ] Rate limiting et protection DDoS
- [ ] Multi-tenancy avec isolation des données
- [ ] Système de facturation Stripe intégré
- [ ] Monitoring et alertes configurés

### **Support Client :**

- [ ] Widget de support intégré
- [ ] Système de tickets automatisé
- [ ] Base de connaissances
- [ ] Chat en direct configuré
- [ ] SLA de réponse défini

### **Onboarding :**

- [ ] Processus guidé de configuration
- [ ] Tooltips et aide contextuelle
- [ ] Tutoriels vidéo intégrés
- [ ] Templates de données d'exemple
- [ ] Migration assistant

### **Business Ready :**

- [ ] Plans tarifaires définis
- [ ] Système d'essai gratuit
- [ ] Facturation automatique
- [ ] Analytics business intégrés
- [ ] Rapports clients automatisés

Avec cette phase, vous aurez une application **100% prête pour vos premiers clients** avec un système complet de support, facturation et onboarding professionnel !

Prêt pour la dernière phase SaaS ?
