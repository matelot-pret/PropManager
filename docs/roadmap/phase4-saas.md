# 🚀 Phase 4 : SaaS PropManager

## 🎯 Objectif : Plateforme SaaS Scalable et Profitable

### **Semaine 9-10 : Architecture Scalable**

#### **Jour 50-53 : Microservices & API Gateway**

```typescript
// services/api-gateway/server.ts
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import rateLimit from "express-rate-limit";
import { verifyJWT } from "./middleware/auth";
import { loadBalancer } from "./middleware/load-balancer";
import { circuitBreaker } from "./middleware/circuit-breaker";

const app = express();

// Rate limiting par plan
const createRateLimiter = (windowMs: number, max: number) =>
  rateLimit({
    windowMs,
    max,
    keyGenerator: (req) => `${req.user?.tenant_id || req.ip}`,
    message: "Limite de requêtes atteinte",
  });

// Plans de rate limiting
const rateLimits = {
  basic: createRateLimiter(15 * 60 * 1000, 1000), // 1000/15min
  premium: createRateLimiter(15 * 60 * 1000, 5000), // 5000/15min
  enterprise: createRateLimiter(15 * 60 * 1000, 20000), // 20000/15min
};

// Middleware global
app.use(express.json());
app.use(verifyJWT);

// Appliquer rate limiting basé sur le plan
app.use((req, res, next) => {
  const plan = req.user?.tenant?.plan || "basic";
  const limiter = rateLimits[plan] || rateLimits.basic;
  limiter(req, res, next);
});

// Service Discovery
const services = {
  auth: process.env.AUTH_SERVICE_URL || "http://auth-service:3001",
  core: process.env.CORE_SERVICE_URL || "http://core-service:3002",
  billing: process.env.BILLING_SERVICE_URL || "http://billing-service:3003",
  notifications:
    process.env.NOTIFICATIONS_SERVICE_URL ||
    "http://notifications-service:3004",
  analytics:
    process.env.ANALYTICS_SERVICE_URL || "http://analytics-service:3005",
};

// Routes avec load balancing et circuit breaker
app.use(
  "/api/auth",
  loadBalancer(services.auth),
  circuitBreaker("auth"),
  createProxyMiddleware({
    target: services.auth,
    changeOrigin: true,
    pathRewrite: { "^/api/auth": "" },
  })
);

app.use(
  "/api/biens",
  loadBalancer(services.core),
  circuitBreaker("core"),
  createProxyMiddleware({
    target: services.core,
    changeOrigin: true,
    pathRewrite: { "^/api": "" },
  })
);

app.use(
  "/api/billing",
  loadBalancer(services.billing),
  circuitBreaker("billing"),
  createProxyMiddleware({
    target: services.billing,
    changeOrigin: true,
    pathRewrite: { "^/api/billing": "" },
  })
);

// Health checks
app.get("/health", async (req, res) => {
  const health = {
    status: "OK",
    timestamp: new Date().toISOString(),
    services: {},
  };

  for (const [name, url] of Object.entries(services)) {
    try {
      const response = await fetch(`${url}/health`, { timeout: 5000 });
      health.services[name] = {
        status: response.ok ? "UP" : "DOWN",
        latency: response.headers.get("x-response-time"),
      };
    } catch (error) {
      health.services[name] = { status: "DOWN", error: error.message };
    }
  }

  const allUp = Object.values(health.services).every((s) => s.status === "UP");
  res.status(allUp ? 200 : 503).json(health);
});

app.listen(3000, () => {
  console.log("🚀 API Gateway running on port 3000");
});

// middleware/circuit-breaker.ts
class CircuitBreaker {
  private failures = new Map<string, number>();
  private lastFailureTime = new Map<string, number>();
  private state = new Map<string, "CLOSED" | "OPEN" | "HALF_OPEN">();

  constructor(
    private threshold = 5,
    private timeout = 60000,
    private monitoringPeriod = 10000
  ) {}

  async execute<T>(serviceId: string, operation: () => Promise<T>): Promise<T> {
    const currentState = this.state.get(serviceId) || "CLOSED";

    if (currentState === "OPEN") {
      if (this.shouldAttemptReset(serviceId)) {
        this.state.set(serviceId, "HALF_OPEN");
      } else {
        throw new Error(`Circuit breaker OPEN for ${serviceId}`);
      }
    }

    try {
      const result = await operation();
      this.onSuccess(serviceId);
      return result;
    } catch (error) {
      this.onFailure(serviceId);
      throw error;
    }
  }

  private onSuccess(serviceId: string) {
    this.failures.set(serviceId, 0);
    this.state.set(serviceId, "CLOSED");
  }

  private onFailure(serviceId: string) {
    const failures = (this.failures.get(serviceId) || 0) + 1;
    this.failures.set(serviceId, failures);
    this.lastFailureTime.set(serviceId, Date.now());

    if (failures >= this.threshold) {
      this.state.set(serviceId, "OPEN");
    }
  }

  private shouldAttemptReset(serviceId: string): boolean {
    const lastFailure = this.lastFailureTime.get(serviceId) || 0;
    return Date.now() - lastFailure >= this.timeout;
  }
}

export const circuitBreaker = (serviceId: string) => {
  const breaker = new CircuitBreaker();

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await breaker.execute(serviceId, async () => {
        return new Promise((resolve) => {
          const originalEnd = res.end;
          res.end = function (...args) {
            if (res.statusCode >= 500) {
              throw new Error(`Service ${serviceId} error: ${res.statusCode}`);
            }
            resolve(true);
            originalEnd.apply(this, args);
          };
          next();
        });
      });
    } catch (error) {
      res.status(503).json({
        error: "Service temporairement indisponible",
        service: serviceId,
        retry_after: 60,
      });
    }
  };
};
```

#### **Jour 54-56 : Cache Distribué & Performance**

```typescript
// services/cache/redis-manager.ts
import Redis from "ioredis";
import { promisify } from "util";

export class CacheManager {
  private redis: Redis;
  private redisCluster: Redis.Cluster;

  constructor() {
    if (process.env.REDIS_CLUSTER_NODES) {
      this.redisCluster = new Redis.Cluster(
        process.env.REDIS_CLUSTER_NODES.split(",").map((node) => ({
          host: node.split(":")[0],
          port: parseInt(node.split(":")[1]),
        }))
      );
    } else {
      this.redis = new Redis({
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT || "6379"),
        password: process.env.REDIS_PASSWORD,
        retryDelayOnFailover: 100,
        enableReadyCheck: false,
        maxRetriesPerRequest: null,
      });
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const client = this.redisCluster || this.redis;
      const value = await client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error("Cache get error:", error);
      return null;
    }
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    try {
      const client = this.redisCluster || this.redis;
      await client.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error("Cache set error:", error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      const client = this.redisCluster || this.redis;
      await client.del(key);
    } catch (error) {
      console.error("Cache del error:", error);
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const client = this.redisCluster || this.redis;
      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        await client.del(...keys);
      }
    } catch (error) {
      console.error("Cache invalidate error:", error);
    }
  }

  // Cache avec lock pour éviter thundering herd
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl: number = 3600,
    lockTtl: number = 30
  ): Promise<T> {
    // Tentative de récupération depuis le cache
    let cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Tentative d'acquisition du lock
    const lockKey = `lock:${key}`;
    const lockValue = Math.random().toString(36);

    const client = this.redisCluster || this.redis;
    const acquired = await client.set(lockKey, lockValue, "EX", lockTtl, "NX");

    if (acquired) {
      try {
        // Double-check au cas où un autre processus aurait mis en cache
        cached = await this.get<T>(key);
        if (cached !== null) {
          return cached;
        }

        // Générer la valeur
        const value = await factory();
        await this.set(key, value, ttl);
        return value;
      } finally {
        // Libérer le lock seulement si on le possède encore
        const script = `
          if redis.call("GET", KEYS[1]) == ARGV[1] then
            return redis.call("DEL", KEYS[1])
          else
            return 0
          end
        `;
        await client.eval(script, 1, lockKey, lockValue);
      }
    } else {
      // Attendre un peu et réessayer
      await new Promise((resolve) =>
        setTimeout(resolve, 100 + Math.random() * 100)
      );
      return this.getOrSet(key, factory, ttl, lockTtl);
    }
  }
}

// decorators/cacheable.ts
export function Cacheable(options: {
  keyGenerator?: (...args: any[]) => string;
  ttl?: number;
  prefix?: string;
}) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cache = new CacheManager();

      // Générer la clé de cache
      let key: string;
      if (options.keyGenerator) {
        key = options.keyGenerator(...args);
      } else {
        const argsHash = require("crypto")
          .createHash("md5")
          .update(JSON.stringify(args))
          .digest("hex");
        key = `${target.constructor.name}:${propertyName}:${argsHash}`;
      }

      if (options.prefix) {
        key = `${options.prefix}:${key}`;
      }

      return cache.getOrSet(
        key,
        () => method.apply(this, args),
        options.ttl || 3600
      );
    };
  };
}

// services/BienService.ts avec cache
export class BienService {
  @Cacheable({
    keyGenerator: (tenantId: number, filters: any) =>
      `biens:${tenantId}:${JSON.stringify(filters)}`,
    ttl: 1800, // 30 minutes
  })
  static async list(tenantId: number, filters: any = {}) {
    const where = {
      tenant_id: tenantId,
      ...filters,
    };

    return prisma.bien.findMany({
      where,
      include: {
        chambres: true,
        locataire_actuel: true,
      },
      orderBy: { created_at: "desc" },
    });
  }

  @Cacheable({
    keyGenerator: (id: number) => `bien:${id}`,
    ttl: 3600,
  })
  static async findById(id: number) {
    return prisma.bien.findUnique({
      where: { id },
      include: {
        chambres: {
          include: {
            contrat_actuel: {
              include: {
                locataire: true,
              },
            },
          },
        },
        historique_loyers: {
          orderBy: { date_paiement: "desc" },
          take: 12,
        },
      },
    });
  }

  static async create(data: CreateBienData) {
    const bien = await prisma.bien.create({ data });

    // Invalider les caches liés
    const cache = new CacheManager();
    await cache.invalidatePattern(`biens:${data.tenant_id}:*`);

    return bien;
  }

  static async update(id: number, data: UpdateBienData) {
    const bien = await prisma.bien.update({
      where: { id },
      data,
    });

    // Invalider les caches spécifiques
    const cache = new CacheManager();
    await cache.del(`bien:${id}`);
    await cache.invalidatePattern(`biens:${bien.tenant_id}:*`);

    return bien;
  }
}
```

#### **Jour 57-60 : Message Queue & Events**

```typescript
// services/queue/queue-manager.ts
import Bull from "bull";
import { sendEmail } from "../email/email-service";
import { generateReport } from "../reports/report-service";
import { processWebhook } from "../webhooks/webhook-service";

interface QueueConfig {
  redis: {
    host: string;
    port: number;
    password?: string;
  };
  concurrency: number;
  retries: number;
}

export class QueueManager {
  private queues: Map<string, Bull.Queue> = new Map();

  constructor(private config: QueueConfig) {
    this.initializeQueues();
  }

  private initializeQueues() {
    // Queue pour emails
    const emailQueue = new Bull("email processing", {
      redis: this.config.redis,
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 50,
        attempts: 3,
        backoff: "exponential",
      },
    });

    emailQueue.process("send-email", this.config.concurrency, async (job) => {
      const { to, subject, template, data } = job.data;
      return sendEmail(to, subject, template, data);
    });

    // Queue pour rapports
    const reportQueue = new Bull("report generation", {
      redis: this.config.redis,
      defaultJobOptions: {
        removeOnComplete: 50,
        removeOnFail: 20,
        attempts: 2,
        delay: 5000,
      },
    });

    reportQueue.process("generate-report", 1, async (job) => {
      const { tenantId, type, filters, userId } = job.data;
      const report = await generateReport(tenantId, type, filters);

      // Notifier l'utilisateur
      await this.addJob("email", "send-email", {
        to: userId,
        subject: "Votre rapport est prêt",
        template: "report-ready",
        data: { downloadUrl: report.url },
      });

      return report;
    });

    // Queue pour webhooks
    const webhookQueue = new Bull("webhook processing", {
      redis: this.config.redis,
      defaultJobOptions: {
        removeOnComplete: 200,
        removeOnFail: 50,
        attempts: 5,
        backoff: "exponential",
      },
    });

    webhookQueue.process(
      "send-webhook",
      this.config.concurrency,
      async (job) => {
        const { url, payload, headers } = job.data;
        return processWebhook(url, payload, headers);
      }
    );

    // Queue pour traitement des données
    const dataQueue = new Bull("data processing", {
      redis: this.config.redis,
    });

    dataQueue.process("calculate-metrics", 5, async (job) => {
      const { tenantId, type, period } = job.data;
      return this.calculateMetrics(tenantId, type, period);
    });

    // Stocker les queues
    this.queues.set("email", emailQueue);
    this.queues.set("reports", reportQueue);
    this.queues.set("webhooks", webhookQueue);
    this.queues.set("data", dataQueue);
  }

  async addJob(
    queueName: string,
    jobType: string,
    data: any,
    options?: Bull.JobOptions
  ) {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    return queue.add(jobType, data, options);
  }

  async getQueueStats(queueName: string) {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    const [waiting, active, completed, failed] = await Promise.all([
      queue.getWaiting(),
      queue.getActive(),
      queue.getCompleted(),
      queue.getFailed(),
    ]);

    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
    };
  }

  private async calculateMetrics(
    tenantId: number,
    type: string,
    period: string
  ) {
    switch (type) {
      case "revenue":
        return this.calculateRevenueMetrics(tenantId, period);
      case "occupancy":
        return this.calculateOccupancyMetrics(tenantId, period);
      case "maintenance":
        return this.calculateMaintenanceMetrics(tenantId, period);
      default:
        throw new Error(`Unknown metrics type: ${type}`);
    }
  }

  private async calculateRevenueMetrics(tenantId: number, period: string) {
    const startDate = this.getPeriodStartDate(period);

    const revenue = await prisma.loyer.aggregate({
      where: {
        tenant_id: tenantId,
        date_paiement: { gte: startDate },
        statut: "paye",
      },
      _sum: { montant: true },
    });

    const expenses = await prisma.charge.aggregate({
      where: {
        tenant_id: tenantId,
        date: { gte: startDate },
      },
      _sum: { montant: true },
    });

    const profit = (revenue._sum.montant || 0) - (expenses._sum.montant || 0);

    // Mettre en cache
    const cache = new CacheManager();
    await cache.set(
      `metrics:revenue:${tenantId}:${period}`,
      {
        revenue: revenue._sum.montant,
        expenses: expenses._sum.montant,
        profit,
      },
      3600
    );

    return {
      revenue: revenue._sum.montant,
      expenses: expenses._sum.montant,
      profit,
    };
  }

  private getPeriodStartDate(period: string): Date {
    const now = new Date();
    switch (period) {
      case "month":
        return new Date(now.getFullYear(), now.getMonth(), 1);
      case "quarter":
        const quarter = Math.floor(now.getMonth() / 3);
        return new Date(now.getFullYear(), quarter * 3, 1);
      case "year":
        return new Date(now.getFullYear(), 0, 1);
      default:
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
  }
}

// Event-driven architecture
// services/events/event-dispatcher.ts
export class EventDispatcher {
  private listeners: Map<string, Function[]> = new Map();
  private queue: QueueManager;

  constructor(queue: QueueManager) {
    this.queue = queue;
  }

  on(event: string, listener: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener);
  }

  async emit(event: string, data: any) {
    const listeners = this.listeners.get(event) || [];

    // Exécuter les listeners synchrones
    const syncPromises = listeners.map((listener) => {
      try {
        return listener(data);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });

    await Promise.allSettled(syncPromises);

    // Ajouter à la queue pour traitement asynchrone
    await this.queue.addJob("events", "process-event", { event, data });
  }
}

// Événements business
export const events = {
  BIEN_CREATED: "bien.created",
  BIEN_UPDATED: "bien.updated",
  LOCATAIRE_ADDED: "locataire.added",
  PAYMENT_RECEIVED: "payment.received",
  PAYMENT_OVERDUE: "payment.overdue",
  CONTRACT_SIGNED: "contract.signed",
  CONTRACT_EXPIRED: "contract.expired",
};

// Listeners d'événements
export function setupEventListeners(dispatcher: EventDispatcher) {
  // Nouveau bien créé
  dispatcher.on(events.BIEN_CREATED, async (data) => {
    const { bien, userId } = data;

    // Envoyer email de confirmation
    await queue.addJob("email", "send-email", {
      to: userId,
      subject: "Nouveau bien ajouté",
      template: "bien-created",
      data: { bien },
    });

    // Calculer les nouvelles métriques
    await queue.addJob("data", "calculate-metrics", {
      tenantId: bien.tenant_id,
      type: "revenue",
      period: "month",
    });
  });

  // Paiement reçu
  dispatcher.on(events.PAYMENT_RECEIVED, async (data) => {
    const { loyer, locataire } = data;

    // Envoyer reçu au locataire
    await queue.addJob("email", "send-email", {
      to: locataire.email,
      subject: "Reçu de paiement",
      template: "payment-receipt",
      data: { loyer, locataire },
    });

    // Notifier le propriétaire
    await queue.addJob("email", "send-email", {
      to: loyer.bien.proprietaire.email,
      subject: "Paiement reçu",
      template: "payment-notification",
      data: { loyer, locataire },
    });

    // Mettre à jour les métriques en temps réel
    await queue.addJob("data", "calculate-metrics", {
      tenantId: loyer.tenant_id,
      type: "revenue",
      period: "month",
    });
  });

  // Paiement en retard
  dispatcher.on(events.PAYMENT_OVERDUE, async (data) => {
    const { loyer, locataire, daysOverdue } = data;

    // Email de rappel au locataire
    await queue.addJob("email", "send-email", {
      to: locataire.email,
      subject: `Rappel: Loyer en retard (${daysOverdue} jours)`,
      template: "payment-overdue",
      data: { loyer, locataire, daysOverdue },
    });

    // Alerte au propriétaire
    await queue.addJob("email", "send-email", {
      to: loyer.bien.proprietaire.email,
      subject: "Alerte: Paiement en retard",
      template: "payment-overdue-alert",
      data: { loyer, locataire, daysOverdue },
    });
  });
}
```

### **Semaine 11-12 : Analytics & Business Intelligence**

#### **Jour 61-63 : Système d'Analytics Avancé**

```typescript
// services/analytics/analytics-engine.ts
export class AnalyticsEngine {
  private clickhouse: ClickHouse;
  private redis: CacheManager;

  constructor() {
    this.clickhouse = new ClickHouse({
      host: process.env.CLICKHOUSE_HOST,
      port: process.env.CLICKHOUSE_PORT,
      user: process.env.CLICKHOUSE_USER,
      password: process.env.CLICKHOUSE_PASSWORD,
    });
    this.redis = new CacheManager();
  }

  // Tracking des événements
  async track(event: AnalyticsEvent) {
    // Enrichir l'événement
    const enrichedEvent = {
      ...event,
      timestamp: new Date(),
      session_id: this.generateSessionId(),
      device_info: this.getDeviceInfo(event.user_agent),
      geo_info: await this.getGeoInfo(event.ip),
    };

    // Stocker en temps réel (Redis)
    await this.redis.set(
      `event:${event.tenant_id}:${Date.now()}:${Math.random()}`,
      enrichedEvent,
      3600
    );

    // Stocker pour analytics long terme (ClickHouse)
    await this.clickhouse.insert("events", [enrichedEvent]);

    // Déclencher calculs en temps réel
    await this.updateRealTimeMetrics(event.tenant_id, event.type);
  }

  // Métriques en temps réel
  async getRealTimeMetrics(tenantId: number): Promise<RealTimeMetrics> {
    const cacheKey = `realtime:${tenantId}`;
    let metrics = await this.redis.get<RealTimeMetrics>(cacheKey);

    if (!metrics) {
      metrics = await this.calculateRealTimeMetrics(tenantId);
      await this.redis.set(cacheKey, metrics, 300); // 5 minutes
    }

    return metrics;
  }

  private async calculateRealTimeMetrics(
    tenantId: number
  ): Promise<RealTimeMetrics> {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Requêtes parallèles vers ClickHouse
    const [
      visitsToday,
      visitsYesterday,
      activeUsers,
      popularPages,
      conversionRate,
      avgSessionDuration,
    ] = await Promise.all([
      this.getVisitsCount(tenantId, yesterday, now),
      this.getVisitsCount(
        tenantId,
        new Date(yesterday.getTime() - 24 * 60 * 60 * 1000),
        yesterday
      ),
      this.getActiveUsers(tenantId, 30), // 30 minutes
      this.getPopularPages(tenantId, lastWeek, now),
      this.getConversionRate(tenantId, lastWeek, now),
      this.getAvgSessionDuration(tenantId, yesterday, now),
    ]);

    return {
      visits: {
        today: visitsToday,
        yesterday: visitsYesterday,
        change: this.calculateChange(visitsToday, visitsYesterday),
      },
      activeUsers,
      popularPages,
      conversionRate,
      avgSessionDuration,
      lastUpdated: now,
    };
  }

  // Dashboard analytics
  async getDashboardAnalytics(
    tenantId: number,
    period: string
  ): Promise<DashboardAnalytics> {
    const { startDate, endDate } = this.getPeriodDates(period);

    const [overview, userBehavior, contentAnalytics, performanceMetrics] =
      await Promise.all([
        this.getOverviewMetrics(tenantId, startDate, endDate),
        this.getUserBehaviorMetrics(tenantId, startDate, endDate),
        this.getContentAnalytics(tenantId, startDate, endDate),
        this.getPerformanceMetrics(tenantId, startDate, endDate),
      ]);

    return {
      overview,
      userBehavior,
      contentAnalytics,
      performanceMetrics,
      period: { startDate, endDate },
    };
  }

  private async getOverviewMetrics(
    tenantId: number,
    startDate: Date,
    endDate: Date
  ) {
    const query = `
      SELECT 
        count() as total_events,
        uniq(user_id) as unique_users,
        uniq(session_id) as sessions,
        countIf(event_type = 'page_view') as page_views,
        countIf(event_type = 'bien_created') as biens_created,
        countIf(event_type = 'locataire_added') as locataires_added,
        countIf(event_type = 'payment_received') as payments_received,
        avg(session_duration) as avg_session_duration
      FROM events 
      WHERE tenant_id = ? 
        AND timestamp BETWEEN ? AND ?
    `;

    const result = await this.clickhouse.query(query, [
      tenantId,
      startDate,
      endDate,
    ]);
    return result[0];
  }

  private async getUserBehaviorMetrics(
    tenantId: number,
    startDate: Date,
    endDate: Date
  ) {
    // Funnel d'acquisition/conversion
    const funnelQuery = `
      SELECT 
        countIf(event_type = 'page_view' AND page = '/') as homepage_visits,
        countIf(event_type = 'page_view' AND page LIKE '/biens%') as biens_views,
        countIf(event_type = 'bien_form_started') as form_starts,
        countIf(event_type = 'bien_created') as conversions
      FROM events 
      WHERE tenant_id = ? AND timestamp BETWEEN ? AND ?
    `;

    // Retention par cohorte
    const retentionQuery = `
      SELECT 
        toYYYYMM(first_visit) as cohort_month,
        count() as cohort_size,
        countIf(days_since_first_visit = 1) as day_1,
        countIf(days_since_first_visit = 7) as day_7,
        countIf(days_since_first_visit = 30) as day_30
      FROM (
        SELECT 
          user_id,
          min(timestamp) as first_visit,
          dateDiff('day', min(timestamp), timestamp) as days_since_first_visit
        FROM events 
        WHERE tenant_id = ? AND timestamp BETWEEN ? AND ?
        GROUP BY user_id, timestamp
      )
      GROUP BY cohort_month
      ORDER BY cohort_month
    `;

    const [funnel, retention] = await Promise.all([
      this.clickhouse.query(funnelQuery, [tenantId, startDate, endDate]),
      this.clickhouse.query(retentionQuery, [tenantId, startDate, endDate]),
    ]);

    return { funnel: funnel[0], retention };
  }

  // Alertes intelligentes
  async checkAlerts(tenantId: number): Promise<Alert[]> {
    const alerts: Alert[] = [];
    const metrics = await this.getRealTimeMetrics(tenantId);

    // Alerte sur chute de trafic
    if (metrics.visits.change < -20) {
      alerts.push({
        type: "warning",
        title: "Chute de trafic détectée",
        description: `Le trafic a diminué de ${Math.abs(
          metrics.visits.change
        )}% par rapport à hier`,
        action: "check_marketing_campaigns",
      });
    }

    // Alerte sur taux de conversion bas
    if (metrics.conversionRate < 2) {
      alerts.push({
        type: "info",
        title: "Taux de conversion faible",
        description: `Le taux de conversion est de ${metrics.conversionRate}%, en dessous de la moyenne`,
        action: "optimize_onboarding",
      });
    }

    // Alertes business spécifiques
    const businessAlerts = await this.checkBusinessAlerts(tenantId);
    alerts.push(...businessAlerts);

    return alerts;
  }

  private async checkBusinessAlerts(tenantId: number): Promise<Alert[]> {
    const alerts: Alert[] = [];

    // Paiements en retard
    const overduePayments = await prisma.loyer.count({
      where: {
        tenant_id: tenantId,
        date_echeance: { lt: new Date() },
        statut: "en_attente",
      },
    });

    if (overduePayments > 0) {
      alerts.push({
        type: "error",
        title: "Paiements en retard",
        description: `${overduePayments} paiements sont en retard`,
        action: "send_payment_reminders",
      });
    }

    // Taux d'occupation faible
    const totalChambres = await prisma.chambre.count({
      where: { bien: { tenant_id: tenantId } },
    });

    const chambresOccupees = await prisma.chambre.count({
      where: {
        bien: { tenant_id: tenantId },
        statut: "louee",
      },
    });

    const occupancyRate = (chambresOccupees / totalChambres) * 100;

    if (occupancyRate < 80) {
      alerts.push({
        type: "warning",
        title: "Taux d'occupation faible",
        description: `Le taux d'occupation est de ${occupancyRate.toFixed(1)}%`,
        action: "review_pricing_strategy",
      });
    }

    return alerts;
  }
}

// Composant Analytics Dashboard
export function AnalyticsDashboard() {
  const [period, setPeriod] = useState("30d");
  const [analytics, setAnalytics] = useState(null);
  const [realTimeMetrics, setRealTimeMetrics] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
    loadRealTimeMetrics();
    loadAlerts();

    // Refresh temps réel toutes les 30 secondes
    const interval = setInterval(loadRealTimeMetrics, 30000);
    return () => clearInterval(interval);
  }, [period]);

  const loadAnalytics = async () => {
    try {
      const data = await api.get(`/analytics/dashboard?period=${period}`);
      setAnalytics(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des analytics");
    }
  };

  const loadRealTimeMetrics = async () => {
    try {
      const data = await api.get("/analytics/realtime");
      setRealTimeMetrics(data);
    } catch (error) {
      console.error("Erreur metrics temps réel:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadAlerts = async () => {
    try {
      const data = await api.get("/analytics/alerts");
      setAlerts(data);
    } catch (error) {
      console.error("Erreur alerts:", error);
    }
  };

  if (loading) return <AnalyticsLoadingSkeleton />;

  return (
    <div className="space-y-6">
      {/* Header avec période */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics & Insights</h1>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 jours</SelectItem>
            <SelectItem value="30d">30 jours</SelectItem>
            <SelectItem value="90d">3 mois</SelectItem>
            <SelectItem value="1y">1 an</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Alertes */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <Alert key={index} variant={alert.type}>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{alert.title}</AlertTitle>
              <AlertDescription>{alert.description}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Métriques temps réel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <RealTimeMetricCard
          title="Visiteurs Actifs"
          value={realTimeMetrics?.activeUsers || 0}
          icon={Users}
          color="green"
        />
        <RealTimeMetricCard
          title="Visites Aujourd'hui"
          value={realTimeMetrics?.visits.today || 0}
          change={realTimeMetrics?.visits.change}
          icon={Eye}
          color="blue"
        />
        <RealTimeMetricCard
          title="Taux de Conversion"
          value={`${realTimeMetrics?.conversionRate || 0}%`}
          icon={Target}
          color="purple"
        />
        <RealTimeMetricCard
          title="Durée Moyenne"
          value={formatDuration(realTimeMetrics?.avgSessionDuration || 0)}
          icon={Clock}
          color="orange"
        />
      </div>

      {/* Charts principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PremiumCard>
          <h3 className="text-lg font-semibold mb-4">Évolution du Trafic</h3>
          <TrafficChart data={analytics?.overview} />
        </PremiumCard>

        <PremiumCard>
          <h3 className="text-lg font-semibold mb-4">Funnel de Conversion</h3>
          <FunnelChart data={analytics?.userBehavior?.funnel} />
        </PremiumCard>
      </div>

      {/* Analytics détaillés */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PremiumCard>
          <h3 className="text-lg font-semibold mb-4">Pages Populaires</h3>
          <PopularPagesTable data={realTimeMetrics?.popularPages} />
        </PremiumCard>

        <PremiumCard>
          <h3 className="text-lg font-semibent mb-4">Rétention par Cohorte</h3>
          <RetentionChart data={analytics?.userBehavior?.retention} />
        </PremiumCard>

        <PremiumCard>
          <h3 className="text-lg font-semibold mb-4">Performance</h3>
          <PerformanceMetrics data={analytics?.performanceMetrics} />
        </PremiumCard>
      </div>
    </div>
  );
}
```

## 📋 **Checklist Phase 4 - SaaS**

### **Architecture Scalable :**

- [ ] Microservices avec API Gateway
- [ ] Load balancing et circuit breakers
- [ ] Cache distribué Redis/ClickHouse
- [ ] Message queues pour traitement asynchrone
- [ ] Event-driven architecture

### **Analytics & BI :**

- [ ] Tracking temps réel des événements
- [ ] Dashboard analytics complet
- [ ] Alertes intelligentes automatiques
- [ ] Métriques business et techniques
- [ ] Rapports automatisés

### **Scalabilité :**

- [ ] Auto-scaling horizontal
- [ ] CDN pour assets statiques
- [ ] Database sharding par tenant
- [ ] Monitoring et observabilité
- [ ] Disaster recovery

### **Business Intelligence :**

- [ ] KPIs business automatisés
- [ ] Prédictions ML pour churn
- [ ] Optimisation pricing dynamique
- [ ] Segmentation clients avancée
- [ ] ROI tracking par feature

Avec cette architecture, PropManager devient une **véritable plateforme SaaS enterprise-ready** capable de gérer des milliers de clients avec des performances optimales !

🎯 **Résultat Final :** Une application complète qui va de l'apprentissage étudiant au SaaS profitable, avec une roadmap claire de 12 semaines pour atteindre vos objectifs !

Quelle phase vous excite le plus pour commencer ?
