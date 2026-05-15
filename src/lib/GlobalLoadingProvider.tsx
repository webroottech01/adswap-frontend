'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Loader } from '@/ui/Loader';
import { setGlobalLoadingCallback } from './api';

interface GlobalLoadingContextType {
  isLoading: boolean;
}

const GlobalLoadingContext = createContext<GlobalLoadingContextType | undefined>(undefined);

export function useGlobalLoading() {
  const context = useContext(GlobalLoadingContext);
  if (!context) {
    throw new Error('useGlobalLoading must be used within GlobalLoadingProvider');
  }
  return context;
}

export function GlobalLoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Subscribe to global loading state changes from API client
    const unsubscribe = setGlobalLoadingCallback((loading: boolean) => {
      setIsLoading(loading);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <GlobalLoadingContext.Provider value={{ isLoading }}>
      {children}
      {isLoading && <Loader fullScreen variant="primary" text="Loading..." />}
    </GlobalLoadingContext.Provider>
  );
}

