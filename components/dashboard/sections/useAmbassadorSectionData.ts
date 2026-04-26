"use client";

import { useEffect, useState } from "react";
import { useDashboardData, type AmbassadorData } from "@/components/dashboard/DashboardDataContext";
import { getEnvelopeData, getMessage } from "@/lib/api/response";
import { toAmbassadorData } from "@/lib/dashboard/ambassador";

export function useAmbassadorSectionData() {
  const { ambassadorData, isAmbassadorDataLoading } = useDashboardData();
  const [data, setData] = useState<AmbassadorData | null>(ambassadorData);
  const [loading, setLoading] = useState(isAmbassadorDataLoading && !ambassadorData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ambassadorData) {
      setData(ambassadorData);
      setLoading(false);
      setError(null);
      return;
    }

    if (isAmbassadorDataLoading) {
      setLoading(true);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/participants/ambassador", { cache: "no-store" });
        const json = (await res.json().catch(() => null)) as unknown;
        if (!res.ok) throw new Error(getMessage(json) ?? "Failed to load ambassador data");
        if (!cancelled) setData(toAmbassadorData(getEnvelopeData(json)));
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [ambassadorData, isAmbassadorDataLoading]);

  return { data, loading, error };
}
