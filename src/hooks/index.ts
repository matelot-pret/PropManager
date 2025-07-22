// ===========================================
// EXPORT DE TOUS LES HOOKS PERSONNALISÉS
// ===========================================

// Hooks pour les biens
export {
  useBiens,
  useBien,
  useBiensStats,
  useBiensActions,
  useBiensSearch,
} from "./useBiens";

// Hooks pour les chambres
export {
  useChambres,
  useChambre,
  useChambresStats,
  useChambresActions,
  useChambresParStatut,
} from "./useChambres";

// Hooks pour les locataires
export {
  useLocataires,
  useLocataire,
  useLocatairesStats,
  useLocatairesActions,
  useLocatairesParStatut,
  useLocatairesSearch,
} from "./useLocataires";

// Hooks pour le dashboard et l'application globale
export {
  useDashboard,
  useGlobalSearch,
  useDataSync,
  useConnectivity,
  useActivityReport,
  usePropManager,
} from "./usePropManager";

// ===========================================
// TYPES UTILITAIRES POUR LES HOOKS
// ===========================================

export interface BaseHookState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface PaginatedHookState<T> extends BaseHookState<T[]> {
  pagination: {
    page: number;
    totalPages: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SearchHookState<T> extends BaseHookState<T[]> {
  search: (terme: string) => Promise<void>;
  clearResults: () => void;
}

export interface ActionsHookState {
  loading: boolean;
  error: string | null;
}

// ===========================================
// HOOKS UTILITAIRES RÉUTILISABLES
// ===========================================

import { useState, useCallback } from "react";

/**
 * Hook générique pour gérer les états de chargement et d'erreur
 */
export function useAsyncState<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (asyncFn: () => Promise<T>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFn();
      setData(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

/**
 * Hook pour gérer les formulaires avec validation
 */
export function useFormState<T extends Record<string, any>>(
  initialValues: T,
  validator?: (values: T) => Record<string, string>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );

  const setValue = useCallback(
    (name: keyof T, value: any) => {
      setValues((prev) => ({ ...prev, [name]: value }));

      // Effacer l'erreur quand on commence à taper
      if (errors[name as string]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name as string];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const setFieldTouched = useCallback((name: keyof T) => {
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
  }, []);

  const validate = useCallback(() => {
    if (!validator) return true;

    const validationErrors = validator(values);
    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  }, [values, validator]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouchedFields({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched: touchedFields,
    setValue,
    setTouched: setFieldTouched,
    validate,
    reset,
    isValid: Object.keys(errors).length === 0,
  };
}

/**
 * Hook pour gérer les notifications/toasts
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<
    Array<{
      id: string;
      type: "success" | "error" | "warning" | "info";
      message: string;
      duration?: number;
    }>
  >([]);

  const addNotification = useCallback(
    (
      type: "success" | "error" | "warning" | "info",
      message: string,
      duration = 5000
    ) => {
      const id = Math.random().toString(36).substr(2, 9);
      const notification = { id, type, message, duration };

      setNotifications((prev) => [...prev, notification]);

      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }

      return id;
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success: (message: string, duration?: number) =>
      addNotification("success", message, duration),
    error: (message: string, duration?: number) =>
      addNotification("error", message, duration),
    warning: (message: string, duration?: number) =>
      addNotification("warning", message, duration),
    info: (message: string, duration?: number) =>
      addNotification("info", message, duration),
  };
}

/**
 * Hook pour gérer le localStorage de manière réactive
 */
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(
        `Erreur lors de la lecture de localStorage pour la clé "${key}":`,
        error
      );
      return defaultValue;
    }
  });

  const setStoredValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      try {
        const valueToStore =
          newValue instanceof Function ? newValue(value) : newValue;
        setValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.warn(
          `Erreur lors de l'écriture dans localStorage pour la clé "${key}":`,
          error
        );
      }
    },
    [key, value]
  );

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setValue(defaultValue);
    } catch (error) {
      console.warn(
        `Erreur lors de la suppression de localStorage pour la clé "${key}":`,
        error
      );
    }
  }, [key, defaultValue]);

  return [value, setStoredValue, removeValue] as const;
}
