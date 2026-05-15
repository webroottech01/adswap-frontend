import { useState, useEffect, useRef } from 'react';
import { businessApi, BusinessCategory } from '../api';

// Module-level singleton to prevent duplicate API calls across all component instances
let globalFetchPromise: Promise<BusinessCategory[]> | null = null;
let globalCategoriesCache: BusinessCategory[] | null = null;

/**
 * Hook to fetch business categories
 * Handles React StrictMode double-mounting correctly
 */
export const useBusinessCategories = () => {
  const [categories, setCategories] = useState<BusinessCategory[]>(globalCategoriesCache || []);
  const [loading, setLoading] = useState(!globalCategoriesCache);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);
  const fetchControllerRef = useRef<{ cancelled: boolean }>({ cancelled: false });

  useEffect(() => {
    // Reset mounted flag and cancel flag on mount
    isMountedRef.current = true;
    fetchControllerRef.current = { cancelled: false };

    // If we already have cached categories, use them
    if (globalCategoriesCache) {
      setCategories(globalCategoriesCache);
      setLoading(false);
      return;
    }

    // If there's already a fetch in progress, wait for it
    if (globalFetchPromise) {
      globalFetchPromise
        .then((data) => {
          if (isMountedRef.current && !fetchControllerRef.current.cancelled) {
            const categoriesArray = Array.isArray(data) ? data : [];
            setCategories(categoriesArray);
            setLoading(false);
          }
        })
        .catch((err) => {
          if (isMountedRef.current && !fetchControllerRef.current.cancelled) {
            const errorMessage = err.response?.data?.message || 'Failed to load categories. Please try again.';
            setError(errorMessage);
            setCategories([]);
            setLoading(false);
          }
        });
      return;
    }

    // Start a new fetch
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Create and store the promise
        globalFetchPromise = businessApi.getCategories();
        const data = await globalFetchPromise;
        
        // Cache the result
        globalCategoriesCache = Array.isArray(data) ? data : [];
        globalFetchPromise = null;
        
        // Check if fetch was cancelled (component unmounted)
        if (fetchControllerRef.current.cancelled || !isMountedRef.current) {
          return;
        }
        
        // Update state
        setCategories(globalCategoriesCache);
        setLoading(false);
      } catch (err: any) {
        // Clear the promise on error
        globalFetchPromise = null;
        
        // Check if fetch was cancelled
        if (fetchControllerRef.current.cancelled || !isMountedRef.current) {
          return;
        }
        
        const errorMessage = err.response?.data?.message || 'Failed to load categories. Please try again.';
        console.error('Error fetching business categories:', err);
        
        setError(errorMessage);
        setCategories([]); // Ensure categories is always an array even on error
        setLoading(false);
      }
    };

    fetchCategories();

    // Cleanup function - mark fetch as cancelled
    return () => {
      isMountedRef.current = false;
      fetchControllerRef.current.cancelled = true;
    };
  }, []);

  return {
    categories,
    loading,
    error,
  };
};

