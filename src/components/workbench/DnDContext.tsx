'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

type DnDContextType = [string | null, (type: string | null) => void];

const DnDContext = createContext<DnDContextType>([null, () => {}]);

export function DnDProvider({ children }: { children: ReactNode }) {
  const [type, setType] = useState<string | null>(null);
  return (
    <DnDContext.Provider value={[type, setType]}>
      {children}
    </DnDContext.Provider>
  );
}

export function useDnD() {
  return useContext(DnDContext);
}
