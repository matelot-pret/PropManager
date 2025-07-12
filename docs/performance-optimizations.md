# OPTIMISATIONS PERFORMANCE - PropManager

---

## 1. MEMOISATION DES COMPOSANTS

**Avant :**

```jsx
export default function BienCard({ bien, onEdit, onDelete }) {
  return (
    <Card>
      <h3>{bien.nom}</h3>
      <Button onClick={() => onEdit(bien)}>Modifier</Button>
      <Button onClick={() => onDelete(bien.id)}>Supprimer</Button>
    </Card>
  );
}
```

**Après :**

```jsx
export default memo(function BienCard({ bien, onEdit, onDelete }) {
  const handleEdit = useCallback(() => onEdit(bien), [bien, onEdit]);
  const handleDelete = useCallback(
    () => onDelete(bien.id),
    [bien.id, onDelete]
  );
  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(bien.loyer_mensuel);
  }, [bien.loyer_mensuel]);

  return (
    <Card>
      <h3>{bien.nom}</h3>
      <p>{formattedPrice}</p>
      <Button onClick={handleEdit}>Modifier</Button>
      <Button onClick={handleDelete}>Supprimer</Button>
    </Card>
  );
});
```

---

## 2. LAZY LOADING DES PAGES

```jsx
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Biens = lazy(() => import("@/pages/Biens"));
const BienDetails = lazy(() => import("@/pages/BienDetails"));
const ChambreDetails = lazy(() => import("@/pages/ChambreDetails"));
const Locataires = lazy(() => import("@/pages/Locataires"));

export function AppRouter() {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/biens" element={<Biens />} />
            <Route path="/biens/:id" element={<BienDetails />} />
            <Route path="/chambres/:id" element={<ChambreDetails />} />
            <Route path="/locataires" element={<Locataires />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}
```

---

## 3. VIRTUALISATION DES LISTES

```jsx
import { FixedSizeList as List } from "react-window";

export function VirtualizedBienList({ biens }) {
  const Row = memo(({ index, style }) => (
    <div style={style}>
      <BienCard bien={biens[index]} />
    </div>
  ));

  return (
    <List height={600} itemCount={biens.length} itemSize={120} width="100%">
      {Row}
    </List>
  );
}
```

---

## 4. CACHE ET INVALIDATION

```jsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useBiens() {
  const queryClient = useQueryClient();
  const { data: biens, isLoading } = useQuery({
    queryKey: ["biens"],
    queryFn: BienService.list,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const createMutation = useMutation({
    mutationFn: BienService.create,
    onMutate: async (newBien) => {
      await queryClient.cancelQueries({ queryKey: ["biens"] });
      const previousBiens = queryClient.getQueryData(["biens"]);
      queryClient.setQueryData(["biens"], (old) => [...old, newBien]);
      return { previousBiens };
    },
    onError: (err, newBien, context) => {
      queryClient.setQueryData(["biens"], context.previousBiens);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["biens"] });
    },
  });

  return {
    biens,
    isLoading,
    createBien: createMutation.mutate,
  };
}
```

---

## 5. IMAGES OPTIMISÉES

```jsx
export function OptimizedImage({ src, alt, ...props }) {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative">
      {!loaded && <Skeleton className="absolute inset-0" />}
      {inView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          style={{ opacity: loaded ? 1 : 0 }}
          {...props}
        />
      )}
    </div>
  );
}
```

---

## 6. CONFIGURATION VITE OPTIMISÉE

```js
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["lucide-react", "framer-motion"],
          dates: ["date-fns"],
          routing: ["react-router-dom"],
        },
      },
    },
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  },
});
```

---

## 7. MONITORING PERFORMANCE

```jsx
export function usePerformanceMonitor(componentName) {
  useEffect(() => {
    const start = performance.now();
    return () => {
      const end = performance.now();
      const duration = end - start;
      if (duration > 100) {
        console.warn(`${componentName} slow render: ${duration}ms`);
      }
    };
  });
}

export default function SlowComponent() {
  usePerformanceMonitor("SlowComponent");
  // Votre code...
}
```

---

## RÉSULTATS ATTENDUS

```
🚀 Métriques Cibles :
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Bundle size: < 500KB gzipped

📊 Améliorations PropManager :
- Liste 1000+ biens: Fluide avec virtualisation
- Navigation pages: Instantanée avec cache
- Images: Lazy loading + compression
- Mémoire: Pas de memory leaks

⚡ Tools de mesure :
- Lighthouse CI
- Bundle Analyzer
- React DevTools Profiler
- Web Vitals dashboard
```
