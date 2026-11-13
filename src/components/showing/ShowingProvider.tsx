"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { useShowingSlots } from "./use-showing-slots";
import { ShowingModal } from "./ShowingModal";

type Ctx = ReturnType<typeof useShowingSlots> & {
  open: (date?: string) => void;
  unitId: string;
  suiteTitle: string;
};

const ShowingContext = createContext<Ctx | null>(null);

export function useShowing() {
  const ctx = useContext(ShowingContext);
  if (!ctx) throw new Error("useShowing must be used inside <ShowingProvider>");
  return ctx;
}

/**
 * One slots request per page: the inline date strip, the sidebar button and the
 * mobile bar all open the same modal from the same data.
 */
export function ShowingProvider({ unitId, suiteTitle, children }: { unitId: string; suiteTitle: string; children: ReactNode }) {
  const slots = useShowingSlots(unitId);
  const [isOpen, setIsOpen] = useState(false);
  const [initialDate, setInitialDate] = useState<string | undefined>();

  const open = useCallback((date?: string) => {
    setInitialDate(date);
    setIsOpen(true);
  }, []);

  const value = useMemo(() => ({ ...slots, open, unitId, suiteTitle }), [slots, open, unitId, suiteTitle]);

  return (
    <ShowingContext.Provider value={value}>
      {children}
      {isOpen && <ShowingModal initialDate={initialDate} onClose={() => setIsOpen(false)} />}
    </ShowingContext.Provider>
  );
}
