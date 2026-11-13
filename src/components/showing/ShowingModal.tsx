"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CalendarCheck, CheckCircle2, Clock, Loader2, X } from "lucide-react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { LogoMark } from "@/components/brand/Logo";
import { SHOWING_REQUEST_URL, SHOWING_STORE_URL } from "@/lib/portal";
import { cn } from "@/lib/utils";
import { useShowing } from "./ShowingProvider";
import { fallbackDates, REQUEST_TIMES, type SlotData } from "./use-showing-slots";

function firstOfNextMonth(): string {
  const t = new Date();
  const d = t.getDate() === 1 ? new Date(t.getFullYear(), t.getMonth(), 1) : new Date(t.getFullYear(), t.getMonth() + 1, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

function prettyDate(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d, 12).toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric" });
}

/**
 * Book a showing. With open slots it books one (POST /api/v1/showing/store,
 * with the slot's agent). With none it requests a time instead
 * (POST /api/v1/showing/submit-lead). Same payload as the MoveSmart site.
 */
export function ShowingModal({ initialDate, onClose }: { initialDate?: string; onClose: () => void }) {
  const { dates, loading, slotsFor, refresh, hasSlots, unitId, suiteTitle } = useShowing();
  const isRequest = !loading && !hasSlots;
  const displayDates = useMemo(() => (hasSlots ? dates : fallbackDates()), [hasSlots, dates]);

  const [date, setDate] = useState(initialDate ?? "");
  const [slot, setSlot] = useState<SlotData | null>(null);
  const [requestTime, setRequestTime] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState<string | undefined>("");
  const [moveIn, setMoveIn] = useState(firstOfNextMonth);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<null | { date: string; time: string; requested: boolean }>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Settle on a date once slots are known.
  useEffect(() => {
    if (loading) return;
    if (!date || !displayDates.some((d) => d.date === date)) setDate(displayDates[0]?.date ?? "");
  }, [loading, displayDates, date]);

  const slots = useMemo(() => (date && hasSlots ? slotsFor(date) : []), [date, hasSlots, slotsFor]);
  useEffect(() => {
    setSlot((prev) => (prev ? slots.find((s) => s.time === prev.time) ?? null : null));
  }, [slots]);

  // Lock scroll, close on Escape, keep focus inside.
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) onClose();
      if (e.key === "Tab" && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input, select, [href], [tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus?.();
    };
  }, [onClose, submitting]);

  const time = hasSlots ? slot?.time ?? "" : requestTime;
  const minMoveIn = date || new Date().toISOString().slice(0, 10);
  const valid =
    !!date &&
    !!time &&
    firstName.trim() &&
    lastName.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    !!phone &&
    isValidPhoneNumber(phone) &&
    !!moveIn;

  async function submit() {
    if (!valid || submitting) return;
    setSubmitting(true);
    setError("");
    const payload = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      phone,
      move_in_date: moveIn,
      showing_date: date,
      showing_time: time,
      unit_id: unitId,
      ...(hasSlots && slot ? { agent_id: slot.agent_id } : {}),
    };
    try {
      const res = await fetch(hasSlots ? SHOWING_STORE_URL : SHOWING_REQUEST_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string; error?: string };
      if (!res.ok) {
        if (res.status === 409) {
          refresh();
          setSlot(null);
        }
        throw new Error(data.message || data.error || "Something went wrong while booking the showing.");
      }
      setDone({ date, time, requested: !hasSlots });
    } catch (e) {
      setError(e instanceof Error ? e.message : "We couldn't book that. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const title = isRequest ? "Request a showing" : "Book a showing";

  return createPortal(
    <div className="fixed inset-0 z-[100] flex animate-fade-in items-end justify-center bg-teal/70 backdrop-blur-[2px] sm:items-center sm:p-6" onMouseDown={(e) => e.target === e.currentTarget && !submitting && onClose()}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="showing-title"
        className="flex h-[100dvh] w-full max-w-2xl animate-rise-in flex-col overflow-hidden bg-canvas text-brown shadow-2xl sm:h-auto sm:max-h-[92vh] sm:rounded-[1.5rem]"
      >
        <div className="flex shrink-0 items-start justify-between gap-4 bg-bell px-6 py-5 text-canvas">
          <div className="flex items-start gap-4">
            <LogoMark className="mt-1 w-7 text-canvas" />
            <div>
              <h2 id="showing-title" className="font-serif text-h3 text-canvas">
                {done ? (done.requested ? "Showing requested" : "You're booked") : title}
              </h2>
              <p className="mt-1 text-sm text-canvas/80">{suiteTitle}</p>
            </div>
          </div>
          <button
            type="button"
            data-autofocus
            onClick={onClose}
            disabled={submitting}
            className="-mr-2 inline-flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-canvas/10"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        {done ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 py-14 text-center">
            <CheckCircle2 className="size-14 text-bell" aria-hidden />
            <h3 className="type-h2 mt-5">{done.requested ? "We'll confirm shortly." : "See you there."}</h3>
            <p className="mt-3 max-w-md text-brown">
              {done.requested ? "You asked for " : "Your showing is on "}
              <strong className="font-semibold">{prettyDate(done.date)}</strong> at <strong className="font-semibold">{done.time.split(" - ")[0]}</strong>.{" "}
              {done.requested ? "A leasing advisor will contact you to confirm the time." : "You'll receive a confirmation shortly."}
            </p>
            <button type="button" onClick={onClose} className="btn-plum mt-8 px-10">
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <fieldset>
                <legend className="eyebrow text-bell">1 · Choose a day</legend>
                {loading ? (
                  <div className="mt-3 flex gap-2.5" aria-busy="true">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-[5.5rem] flex-[1_0_4.75rem] animate-pulse rounded-2xl bg-grey/30" />
                    ))}
                  </div>
                ) : (
                  <div className="hide-scrollbar -mx-6 mt-3 flex snap-x gap-2.5 overflow-x-auto px-6 pb-1">
                    {displayDates.map((d) => {
                      const active = d.date === date;
                      return (
                        <button
                          key={d.date}
                          type="button"
                          onClick={() => setDate(d.date)}
                          aria-pressed={active}
                          className={cn(
                            "flex h-[5.5rem] flex-[1_0_4.75rem] snap-start flex-col items-center justify-center rounded-2xl border transition-colors",
                            active ? "border-bell bg-bell text-canvas" : "border-grey bg-canvas-soft text-brown hover:border-bell/60",
                          )}
                        >
                          <span className={cn("text-[0.6875rem] font-semibold tracking-[0.14em]", active ? "text-canvas/80" : "text-brown-muted")}>{d.dayName}</span>
                          <span className="font-serif text-[1.625rem] leading-tight">{d.dayNum}</span>
                          <span className={cn("text-xs", active ? "text-canvas/80" : "text-brown-muted")}>{d.month}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </fieldset>

              <fieldset className="mt-7">
                <legend className="eyebrow text-bell">2 · {isRequest ? "Pick a preferred time" : "Pick a time"}</legend>
                {isRequest && !loading && (
                  <p className="mt-2 text-sm text-brown-muted">No open times are posted for this suite yet. Choose what suits you and we&rsquo;ll confirm.</p>
                )}
                {loading ? (
                  <div className="mt-3 flex items-center gap-2 text-sm text-brown-muted">
                    <Loader2 className="size-4 animate-spin" aria-hidden /> Loading open times…
                  </div>
                ) : (
                  <div className="mt-3 flex max-h-44 flex-wrap gap-2 overflow-y-auto pr-1">
                    {(hasSlots ? slots.map((s) => s.time) : REQUEST_TIMES).map((t) => {
                      const active = t === time;
                      return (
                        <button
                          key={t}
                          type="button"
                          aria-pressed={active}
                          onClick={() => (hasSlots ? setSlot(slots.find((s) => s.time === t) ?? null) : setRequestTime(t))}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                            active ? "border-bell bg-bell text-canvas" : "border-grey bg-canvas-soft text-brown hover:border-bell/60",
                          )}
                        >
                          {active && <Clock className="size-3.5" aria-hidden />}
                          {t.split(" - ")[0]}
                        </button>
                      );
                    })}
                    {hasSlots && slots.length === 0 && <p className="text-sm text-brown-muted">No times left on this day. Try another.</p>}
                  </div>
                )}
              </fieldset>

              <fieldset className="mt-7 border-t border-grey/50 pt-6">
                <legend className="eyebrow float-left w-full text-bell">3 · Your details</legend>
                <div className="clear-both grid gap-4 pt-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="sh-first" className="field-label">
                      First name
                    </label>
                    <input id="sh-first" className="field" autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div>
                    <label htmlFor="sh-last" className="field-label">
                      Last name
                    </label>
                    <input id="sh-last" className="field" autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="sh-email" className="field-label">
                      Email
                    </label>
                    <input id="sh-email" type="email" className="field" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div>
                    <label htmlFor="sh-phone" className="field-label">
                      Phone
                    </label>
                    <div className="rounded-xl border border-grey bg-canvas-soft px-3 focus-within:border-bell focus-within:ring-1 focus-within:ring-bell">
                      <PhoneInput id="sh-phone" international defaultCountry="CA" value={phone} onChange={setPhone} limitMaxLength autoComplete="tel" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="sh-movein" className="field-label">
                      Expected move-in
                    </label>
                    <input id="sh-movein" type="date" className="field" min={minMoveIn} value={moveIn} onChange={(e) => setMoveIn(e.target.value)} />
                  </div>
                </div>
              </fieldset>

              {error && (
                <p role="alert" className="mt-5 rounded-xl border border-plum/30 bg-plum/5 px-4 py-3 text-sm text-plum">
                  {error}
                </p>
              )}
            </div>

            <div className="flex shrink-0 items-center justify-between gap-3 border-t border-grey/50 bg-canvas-soft px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <p className="hidden text-sm text-brown-muted sm:block">
                {date && time ? (
                  <>
                    {prettyDate(date)} · {time.split(" - ")[0]}
                  </>
                ) : (
                  "Choose a day and time"
                )}
              </p>
              <div className="flex w-full gap-3 sm:w-auto">
                <button type="button" onClick={onClose} disabled={submitting} className="btn flex-1 text-brown-muted hover:text-brown sm:flex-none">
                  Cancel
                </button>
                <button type="button" onClick={submit} disabled={!valid || submitting} className="btn-plum flex-[2] sm:flex-none">
                  {submitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" aria-hidden /> Booking…
                    </>
                  ) : (
                    <>
                      <CalendarCheck className="size-4" aria-hidden /> {isRequest ? "Request showing" : "Book showing"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
