// components/sections/SelectedEditionContext.tsx
//
// Shares which program edition (tab) is selected in HomeRegistrationStrip
// with the rest of the tree: sibling sections under app/page.tsx (currently
// FurtherInformation) AND, since this provider now wraps the whole body in
// app/layout.tsx, the countdown gates that sit OUTSIDE {children}
// (RegistrationCountdownGate, StickyBottomBarGate). A single provider
// instance is what keeps those two consumer groups from drifting: this used
// to be mounted narrowly around just the home page's registration strip,
// which meant the layout-level gates could never see a tab click at all.
'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

type SelectedEditionContextValue = {
  selectedIndex: number;
  /** The tab's stable program_id, tracked alongside the array index above.
   * The countdown gates key off this id rather than the index: they resolve
   * their own edition list (app/layout.tsx's own home-data fetch) independently
   * of HomeRegistrationStrip's `groups`, and even though both arrays come from
   * the same per-request-memoized payload today, an id survives any future
   * reordering that would otherwise silently desync the two. */
  selectedProgramId: string | null;
  /** Set index and id together so the two can never point at different tabs. */
  selectEdition: (index: number, programId: string | null) => void;
};

const SelectedEditionContext = createContext<SelectedEditionContextValue | null>(null);

export function SelectedEditionProvider({
  children,
  defaultIndex = 0,
  defaultProgramId = null,
}: {
  children: ReactNode;
  defaultIndex?: number;
  defaultProgramId?: string | null;
}) {
  const [selection, setSelection] = useState({ index: defaultIndex, programId: defaultProgramId });
  const selectEdition = (index: number, programId: string | null) => setSelection({ index, programId });
  return (
    <SelectedEditionContext.Provider
      value={{ selectedIndex: selection.index, selectedProgramId: selection.programId, selectEdition }}
    >
      {children}
    </SelectedEditionContext.Provider>
  );
}

// Returns null when rendered outside the provider, so consumers fall back to
// their own local state (single-edition brands, standalone renders, tests).
export function useSelectedEdition(): SelectedEditionContextValue | null {
  return useContext(SelectedEditionContext);
}
