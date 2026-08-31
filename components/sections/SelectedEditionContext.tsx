// components/sections/SelectedEditionContext.tsx
//
// Shares which program edition (tab) is selected in HomeRegistrationStrip
// with sibling sections (currently FurtherInformation), since both live as
// separate client components under the server-rendered app/page.tsx.
'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

type SelectedEditionContextValue = {
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
};

const SelectedEditionContext = createContext<SelectedEditionContextValue | null>(null);

export function SelectedEditionProvider({
  children,
  defaultIndex = 0,
}: {
  children: ReactNode;
  defaultIndex?: number;
}) {
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);
  return (
    <SelectedEditionContext.Provider value={{ selectedIndex, setSelectedIndex }}>
      {children}
    </SelectedEditionContext.Provider>
  );
}

// Returns null when rendered outside the provider, so consumers fall back to
// their own local state (single-edition brands, standalone renders, tests).
export function useSelectedEdition(): SelectedEditionContextValue | null {
  return useContext(SelectedEditionContext);
}
