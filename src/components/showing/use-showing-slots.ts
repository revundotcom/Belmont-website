"use client";

import { useCallback, useEffect, useState } from "react";
import { SHOWING_SLOTS_URL } from "@/lib/portal";

/**
 * Showing slots from GET /api/v1/showing/slots/{slug} — the same endpoint and
 * response shape the MoveSmart site reads:
 *   { "2026-11-13": { dayName, dayNum, monthName, slots: [{ time, agent_id, start, end }] }, … }
 */
export interface SlotData {
  time: string;
  agent_id: number;
}

export interface ShowingDate {
  date: string;
  dayName: string;
  dayNum: string;
  month: string;
}

type SlotsJson = Record<string, { slots?: Array<Record<string, unknown>> }>;

function toShowingDate(dateKey: string): ShowingDate {
  const [y, m, d] = dateKey.split("-").map(Number);
  const dt = new Date(y, m - 1, d, 12);
  const parts = new Intl.DateTimeFormat("en-CA", { weekday: "short", day: "2-digit", month: "short" }).formatToParts(dt);
  return {
    date: dateKey,
    dayName: (parts.find((p) => p.type === "weekday")?.value ?? "").replace(".", "").toUpperCase(),
    dayNum: parts.find((p) => p.type === "day")?.value ?? "",
    month: (parts.find((p) => p.type === "month")?.value ?? "").replace(".", ""),
  };
}

/** Next five weekdays, used when the portal has no open slots (a time is requested instead). */
export function fallbackDates(): ShowingDate[] {
  const out: ShowingDate[] = [];
  const cur = new Date();
  cur.setHours(12, 0, 0, 0);
  while (out.length < 5) {
    cur.setDate(cur.getDate() + 1);
    const day = cur.getDay();
    if (day === 0 || day === 6) continue;
    const key = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}-${String(cur.getDate()).padStart(2, "0")}`;
    out.push(toShowingDate(key));
  }
  return out;
}

export const REQUEST_TIMES = [
  "10:00 AM - 10:20 AM", "10:20 AM - 10:40 AM", "10:40 AM - 11:00 AM",
  "11:00 AM - 11:20 AM", "11:20 AM - 11:40 AM", "11:40 AM - 12:00 PM",
  "12:00 PM - 12:20 PM", "12:20 PM - 12:40 PM", "12:40 PM - 01:00 PM",
  "01:00 PM - 01:20 PM", "01:20 PM - 01:40 PM", "01:40 PM - 02:00 PM",
  "02:00 PM - 02:20 PM", "02:20 PM - 02:40 PM", "02:40 PM - 03:00 PM",
  "03:00 PM - 03:20 PM", "03:20 PM - 03:40 PM", "03:40 PM - 04:00 PM",
  "04:00 PM - 04:20 PM", "04:20 PM - 04:40 PM", "04:40 PM - 05:00 PM",
  "05:00 PM - 05:20 PM", "05:20 PM - 05:40 PM", "05:40 PM - 06:00 PM",
];

export function useShowingSlots(unitId: string) {
  const [json, setJson] = useState<SlotsJson | null>(null);
  const [dates, setDates] = useState<ShowingDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!unitId) return;
    let alive = true;
    setLoading(true);
    setFailed(false);
    fetch(SHOWING_SLOTS_URL(unitId), { headers: { Accept: "application/json" }, cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error(`slots ${r.status}`);
        return r.json();
      })
      .then((data: unknown) => {
        if (!alive) return;
        const obj = data && typeof data === "object" && !Array.isArray(data) && !("data" in data) ? (data as SlotsJson) : {};
        setJson(obj);
        setDates(
          Object.keys(obj)
            .filter((k) => /^\d{4}-\d{2}-\d{2}$/.test(k) && Array.isArray(obj[k]?.slots) && obj[k].slots!.length > 0)
            .sort()
            .map(toShowingDate),
        );
      })
      .catch(() => {
        if (!alive) return;
        setJson({});
        setDates([]);
        setFailed(true);
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [unitId, refreshKey]);

  const slotsFor = useCallback(
    (date: string): SlotData[] => {
      const list = json?.[date]?.slots;
      if (!Array.isArray(list)) return [];
      return list.map((s) => {
        const agents = s.agents as number[] | undefined;
        return {
          time: String(s.time ?? s.showing_time ?? s.raw_time ?? ""),
          agent_id: Array.isArray(agents) && agents.length ? agents[0] : Number(s.agent_id ?? 0),
        };
      });
    },
    [json],
  );

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  return { dates, loading, failed, slotsFor, refresh, hasSlots: dates.length > 0 };
}
