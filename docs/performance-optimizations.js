// ===========================================
// OPTIMISATIONS PERFORMANCE - PropManager
// ===========================================

import React, { memo, useMemo, useCallback, lazy, Suspense } from 'react';

// ===========================================
// 1. MEMOISATION DES COMPOSANTS
// ===========================================

// ❌ Avant : Re-render à chaque props change
export default function BienCard({ bien, onEdit, onDelete }) {
  return (
    <Card>
      <h3>{bien.nom}</h3>
      <Button onClick={() => onEdit(bien)}>Modifier</Button>
      <Button onClick={() => onDelete(bien.id)}>Supprimer</Button>
    </Card>
  );
}

// ✅ Après : Re-render uniquement si props changent vraiment
export default memo(function BienCard({ bien, onEdit, onDelete }) {
  // Mémoriser les callbacks pour éviter re-renders enfants
  const handleEdit = useCallback(() => onEdit(bien), [bien, onEdit]);
  const handleDelete = useCallback(() => onDelete(bien.id), [bien.id, onDelete]);
  
  // Mémoriser calculs coûteux
  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
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

// ===========================================
// 2. LAZY LOADING DES PAGES
// ===========================================

// Splitté automatiquement en chunks séparés
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Biens = lazy(() => import('@/pages/Biens'));
const BienDetails = lazy(() => import('@/pages/BienDetails'));
const ChambreDetails = lazy(() => import('@/pages/ChambreDetails'));
const Locataires = lazy(() => import('@/pages/Locataires'));

// Router avec Suspense
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

// ===========================================
// 3. VIRTUALISATION DES LISTES
// ===========================================

import { FixedSizeList as List } from 'react-window';

// Pour grandes listes (>100 items)
export function VirtualizedBienList({ biens }) {
  const Row = memo(({ index, style }) => (
    <div style={style}>
      <BienCard bien={biens[index]} />
    </div>
  ));

  return (
    <List
      height={600}        // Hauteur container
      itemCount={biens.length}
      itemSize={120}      // Hauteur chaque item
      width="100%"
    >
      {Row}
    </List>
  );
}

// ===========================================
// 4. CACHE ET INVALIDATION
// ===========================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Cache intelligent avec invalidation automatique
export function useBiens() {
  const queryClient = useQueryClient();
  
  // Cache 5 minutes, background refetch
  const { data: biens, isLoading } = useQuery({
    queryKey: ['biens'],
    queryFn: BienService.list,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });

  // Mutations avec invalidation optimiste
  const createMutation = useMutation({
    mutationFn: BienService.create,
    onMutate: async (newBien) => {
      // Cancel queries pour éviter overwrite
      await queryClient.cancelQueries({ queryKey: ['biens'] });
      
      // Snapshot de l'état précédent
      const previousBiens = queryClient.getQueryData(['biens']);
      
      // Optimistic update
      queryClient.setQueryData(['biens'], old => [...old, newBien]);
      
      return { previousBiens };
    },
    onError: (err, newBien, context) => {
      // Rollback en cas d'erreur
      queryClient.setQueryData(['biens'], context.previousBiens);
    },
    onSettled: () => {
      // Re-fetch pour sync avec serveur
      queryClient.invalidateQueries({ queryKey: ['biens'] });
    }
  });

  return {
    biens,
    isLoading,
    createBien: createMutation.mutate
  };
}

// ===========================================
// 5. IMAGES OPTIMISÉES
// ===========================================

// Component image avec lazy loading + compression
export function OptimizedImage({ src, alt, ...props }) {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  
  // Intersection Observer pour lazy loading
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

// ===========================================
// 6. CONFIGURATION VITE OPTIMISÉE
// ===========================================

// vite.config.js - Configuration performance
export default defineConfig({
  plugins: [react()],
  
  build: {
    // Code splitting agressif
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react', 'framer-motion'],
          dates: ['date-fns'],
          routing: ['react-router-dom']
        }
      }
    },
    
    // Compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  
  // Preview optimisé
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
});

// ===========================================
// 7. MONITORING PERFORMANCE
// ===========================================

// Hook pour mesurer performance
export function usePerformanceMonitor(componentName) {
  useEffect(() => {
    const start = performance.now();
    
    return () => {
      const end = performance.now();
      const duration = end - start;
      
      if (duration > 100) { // Si > 100ms
        console.warn(`${componentName} slow render: ${duration}ms`);
      }
    };
  });
}

// Dans vos composants
export default function SlowComponent() {
  usePerformanceMonitor('SlowComponent');
  
  // Votre code...
}

// ===========================================
// RÉSULTATS ATTENDUS
// ===========================================

/*
🚀 **Métriques Cibles :**
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s  
- Time to Interactive: < 3.5s
- Bundle size: < 500KB gzipped

📊 **Améliorations PropManager :**
- Liste 1000+ biens: Fluide avec virtualisation
- Navigation pages: Instantanée avec cache
- Images: Lazy loading + compression
- Mémoire: Pas de memory leaks

⚡ **Tools de mesure :**
- Lighthouse CI
- Bundle Analyzer  
- React DevTools Profiler
- Web Vitals dashboard
*/
