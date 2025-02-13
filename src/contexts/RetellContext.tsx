import React, { createContext, useContext, useEffect } from 'react';
import Retell from 'retell-sdk';

const retellClient = new Retell({ apiKey: '' });

interface RetellContextType {
  client: typeof retellClient;
}

const RetellContext = createContext<RetellContextType | undefined>(undefined);

export function RetellProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!window.retellClient) {
      window.retellClient = retellClient;
    }
  }, []);

  return (
    <RetellContext.Provider value={{ client: retellClient }}>
      {children}
    </RetellContext.Provider>
  );
}

export const useRetell = () => {
  const context = useContext(RetellContext);
  if (context === undefined) {
    throw new Error('useRetell must be used within a RetellProvider');
  }
  return context;
};

// Type definition for window object
declare global {
  interface Window {
    retellClient: typeof retellClient;
  }
} 