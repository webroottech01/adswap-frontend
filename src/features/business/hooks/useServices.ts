import { useState, useEffect, useRef } from 'react';
import { serviceCatalogApi, Service } from '@/features/serviceCatalog/api';

// Module-level singleton to prevent duplicate API calls across all component instances
let globalFetchPromise: Promise<Service[]> | null = null;
let globalServicesCache: Service[] | null = null;

/**
 * Hook to fetch services from the service catalog
 * Handles React StrictMode double-mounting correctly
 */
export const useServices = () => {
  const [services, setServices] = useState<Service[]>(globalServicesCache || []);
  const [loading, setLoading] = useState(!globalServicesCache);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);
  const fetchControllerRef = useRef<{ cancelled: boolean }>({ cancelled: false });

  useEffect(() => {
    // Reset mounted flag and cancel flag on mount
    isMountedRef.current = true;
    fetchControllerRef.current = { cancelled: false };

    // If we already have cached services, use them
    if (globalServicesCache) {
      setServices(globalServicesCache);
      setLoading(false);
      return;
    }

    // If there's already a fetch in progress, wait for it
    if (globalFetchPromise) {
      globalFetchPromise
        .then((data) => {
          if (isMountedRef.current && !fetchControllerRef.current.cancelled) {
            const servicesArray = Array.isArray(data) ? data : [];
            setServices(servicesArray);
            setLoading(false);
          }
        })
        .catch((err) => {
          if (isMountedRef.current && !fetchControllerRef.current.cancelled) {
            const errorMessage = err.response?.data?.message || 'Failed to load services. Please try again.';
            setError(errorMessage);
            setServices([]);
            setLoading(false);
          }
        });
      return;
    }

    // Start a new fetch
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Create and store the promise
        globalFetchPromise = serviceCatalogApi.getServices();
        const data = await globalFetchPromise;
        
        // Cache the result
        globalServicesCache = Array.isArray(data) ? data : [];
        globalFetchPromise = null;
        
        // Check if fetch was cancelled (component unmounted)
        if (fetchControllerRef.current.cancelled || !isMountedRef.current) {
          return;
        }
        
        // Update state
        setServices(globalServicesCache);
        setLoading(false);
      } catch (err: any) {
        // Clear the promise on error
        globalFetchPromise = null;
        
        // Check if fetch was cancelled
        if (fetchControllerRef.current.cancelled || !isMountedRef.current) {
          return;
        }
        
        const errorMessage = err.response?.data?.message || 'Failed to load services. Please try again.';
        console.error('Error fetching services:', err);
        
        setError(errorMessage);
        setServices([]); // Ensure services is always an array even on error
        setLoading(false);
      }
    };

    fetchServices();

    // Cleanup function - mark fetch as cancelled
    return () => {
      isMountedRef.current = false;
      fetchControllerRef.current.cancelled = true;
    };
  }, []);

  /**
   * Get services grouped by category
   */
  const getServicesByCategory = (categoryName: string): Service[] => {
    return services.filter(
      (service) => service.category_name.toLowerCase() === categoryName.toLowerCase()
    );
  };

  /**
   * Get all enabled services
   */
  const enabledServices = services.filter((service) => service.is_enabled);

  return {
    services,
    enabledServices,
    loading,
    error,
    getServicesByCategory,
  };
};




