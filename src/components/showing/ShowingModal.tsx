"use client";

/*
 * Schedule a Tour — a port of the MoveSmart Rentals modal
 * (src/components/properties/schedule-tour-modal.tsx): same layout, same steps,
 * same endpoints and payload. Only the colours are swapped for The Bellmont's:
 *   MoveSmart green header / button  → Bell Blue header, Plum button
 *   MoveSmart navy selected state    → Bell Blue
 */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, Clock, Loader2, X } from "lucide-react";
import PhoneInput, { isValidPhoneNumber, type Country } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SHOWING_REQUEST_URL, SHOWING_STORE_URL } from "@/lib/portal";
import { cn } from "@/lib/utils";
import { useShowing } from "./ShowingProvider";
import { fallbackDates, REQUEST_TIMES, type SlotData } from "./use-showing-slots";

export function ShowingModal({ initialDate, onClose }: { initialDate?: string; onClose: () => void }) {
  const { dates: dynamicDates, loading: isLoadingSlots, slotsFor: getSlotsForDate, refresh: refreshSlots, unitId } = useShowing();

  // Fallback dates in case the API returns none
  const fallback = useMemo(() => fallbackDates(), []);
  const displayDates = dynamicDates.length > 0 ? dynamicDates : fallback;

  const [fakeLoading, setFakeLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(initialDate || "");
  const [selectedSlot, setSelectedSlot] = useState<SlotData | null>(null);
  const [availableSlots, setAvailableSlots] = useState<SlotData[]>([]);
  const [customTime, setCustomTime] = useState<string>("");

  useEffect(() => {
    if (initialDate && !selectedDate) {
      setSelectedDate(initialDate);
    } else if (!selectedDate && displayDates.length > 0) {
      setSelectedDate(displayDates[0].date);
    }
  }, [initialDate, displayDates, selectedDate]);

  const [phone, setPhone] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>("CA");
  const [expectedMoveIn, setExpectedMoveIn] = useState<Date | null>(() => {
    const today = new Date();
    if (today.getDate() === 1) return new Date(today.getFullYear(), today.getMonth(), 1);
    return new Date(today.getFullYear(), today.getMonth() + 1, 1);
  });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Drag to scroll
  const dateScrollRef = useRef<HTMLDivElement>(null);
  const slotsScrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e: React.MouseEvent, ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return;
    isDragging.current = true;
    startX.current = e.pageX - ref.current.offsetLeft;
    scrollLeft.current = ref.current.scrollLeft;
  };
  const handleMouseLeave = () => {
    isDragging.current = false;
  };
  const handleMouseUp = () => {
    isDragging.current = false;
  };
  const handleMouseMove = (e: React.MouseEvent, ref: React.RefObject<HTMLDivElement | null>) => {
    if (!isDragging.current || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    ref.current.scrollLeft = scrollLeft.current - (x - startX.current) * 1.5;
  };

  // Mouse wheel scrolls the date and time rows sideways
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        (e.currentTarget as HTMLElement).scrollLeft += e.deltaY;
      }
    };
    const dateEl = dateScrollRef.current;
    const slotsEl = slotsScrollRef.current;
    dateEl?.addEventListener("wheel", handleWheel, { passive: false });
    slotsEl?.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      dateEl?.removeEventListener("wheel", handleWheel);
      slotsEl?.removeEventListener("wheel", handleWheel);
    };
  }, [availableSlots, fakeLoading, isLoadingSlots]);

  // Visitor's country for the phone field
  useEffect(() => {
    setMounted(true);
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data.country_code) setCountryCode(data.country_code);
      })
      .catch(() => {});
  }, []);

  // Slots for the selected date
  useEffect(() => {
    if (!selectedDate) {
      setAvailableSlots([]);
      setFakeLoading(false);
      return;
    }
    const slots = getSlotsForDate(selectedDate);
    setAvailableSlots(slots);

    if (slots.length === 0 && !isLoadingSlots) {
      setFakeLoading(true);
      const timer = setTimeout(() => setFakeLoading(false), 600 + Math.random() * 400);
      return () => clearTimeout(timer);
    }
    setFakeLoading(false);
    setSelectedSlot((prev) => (prev ? slots.find((s) => s.time === prev.time) || null : null));
  }, [selectedDate, getSlotsForDate, isLoadingSlots]);

  // No background scrolling while open; Escape closes
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    const scrollY = window.scrollY;
    document.body.style.top = `-${scrollY}px`;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      window.scrollTo(0, scrollY);
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const handleSubmit = async () => {
    const timeToSubmit = availableSlots.length > 0 ? selectedSlot?.time : customTime;
    const agentToSubmit = availableSlots.length > 0 ? selectedSlot?.agent_id : 0;
    if (!timeToSubmit) return;

    setIsSubmitting(true);
    setSubmitError("");

    const payload = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      move_in_date: expectedMoveIn ? expectedMoveIn.toISOString().split("T")[0] : "",
      showing_date: selectedDate,
      showing_time: timeToSubmit,
      unit_id: unitId,
      ...(availableSlots.length > 0 && { agent_id: agentToSubmit }), // agent only for real slots
    };

    const apiUrl = availableSlots.length === 0 ? SHOWING_REQUEST_URL : SHOWING_STORE_URL;

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 409) refreshSlots();
        throw new Error(data.message || data.error || "Something went wrong while booking the tour.");
      }
      setSubmitSuccess(true);
    } catch (err: unknown) {
      setSubmitError((err as Error).message || "Failed to submit the request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  const hasTimeSelected = availableSlots.length > 0 ? !!selectedSlot : !!customTime;
  const isFormValid =
    selectedDate && hasTimeSelected && firstName && lastName && email && phone && isValidPhoneNumber(phone) && expectedMoveIn;

  const isFallback = !isLoadingSlots && availableSlots.length === 0;
  const titleText = isFallback ? "Request a Tour" : "Schedule a Tour";
  const successTitleText = isFallback ? "Tour Requested Successfully!" : "Tour Scheduled Successfully!";
  const submitText = isFallback ? "Request Tour" : "Schedule Tour";

  const timeButton = (isSelected: boolean) =>
    cn(
      "snap-start flex-shrink-0 py-2 px-3.5 rounded-lg border text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5 whitespace-nowrap",
      isSelected ? "border-bell bg-bell text-white shadow-md" : "border-slate-200 text-slate-700 hover:border-bell/50 hover:bg-slate-50 bg-white",
    );

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-6 sm:backdrop-blur-sm">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .PhoneInputInput { padding: 0.5rem; font-size: 16px; }
          .react-datepicker-wrapper { width: 100%; }
          .react-datepicker__input-container input { width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.5rem; border: 1px solid #e2e8f0; font-size: 16px; color: #334155; outline: none; transition: all 0.2s; background: #fff; }
          .react-datepicker__input-container input:focus { border-color: #2F5D66; box-shadow: 0 0 0 1px #2F5D66; }
          .react-datepicker { font-family: inherit; border-color: #e2e8f0; border-radius: 0.75rem; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); }
          .react-datepicker__header { background-color: #f8fafc; border-bottom-color: #e2e8f0; border-top-left-radius: 0.75rem !important; border-top-right-radius: 0.75rem !important; }
          .react-datepicker__day--selected, .react-datepicker__day--keyboard-selected { background-color: #2F5D66 !important; color: #fff !important; }
        `,
        }}
      />

      <div className="flex h-[100dvh] w-full max-w-2xl flex-col overflow-hidden bg-white shadow-2xl transition-all sm:h-auto sm:max-h-[90vh] sm:rounded-2xl" role="dialog" aria-modal="true" aria-labelledby="tour-title">
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between bg-bell px-5 py-4 text-white">
          <div>
            <h2 id="tour-title" className="font-sans text-xl font-bold text-white">
              {titleText}
            </h2>
            {!submitSuccess && <p className="mt-1 text-xs text-white/80">Select a date and time to book your unit tour.</p>}
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        {submitSuccess ? (
          <div className="flex flex-1 flex-col items-center justify-center p-10 text-center">
            <CheckCircle2 className="mb-4 h-16 w-16 text-bell" />
            <h3 className="font-sans text-2xl font-bold text-bell">{successTitleText}</h3>
            <p className="mt-2 max-w-md text-slate-600">
              Thank you for requesting a tour. We have received your request for <span className="font-semibold">{selectedDate}</span> at{" "}
              <span className="font-semibold">{availableSlots.length > 0 ? selectedSlot?.time : customTime}</span>.{" "}
              {isFallback ? "We will contact you shortly." : "You will receive a confirmation shortly."}
            </p>
            <button onClick={onClose} className="mt-8 rounded-lg bg-plum px-8 py-3 font-semibold text-white shadow-md transition-colors hover:bg-plum-700">
              Done
            </button>
          </div>
        ) : (
          <>
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">
              {/* Step 1: Date & Time */}
              <div className="mb-6">
                <h3 className="mb-3 font-sans text-base font-semibold text-slate-800">Choose Date &amp; Time</h3>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-600">
                      Showing Date <span className="text-red-500">*</span>
                    </label>
                    <div
                      ref={dateScrollRef}
                      onMouseDown={(e) => handleMouseDown(e, dateScrollRef)}
                      onMouseLeave={handleMouseLeave}
                      onMouseUp={handleMouseUp}
                      onMouseMove={(e) => handleMouseMove(e, dateScrollRef)}
                      className="hide-scrollbar flex cursor-grab snap-x gap-2.5 overflow-x-auto pb-2 active:cursor-grabbing"
                    >
                      {displayDates.map((d) => {
                        const isSelected = selectedDate === d.date;
                        return (
                          <button
                            key={d.date}
                            onClick={() => setSelectedDate(d.date)}
                            className={cn(
                              "flex h-24 flex-[1_0_5rem] snap-start flex-col items-center justify-center rounded-xl border transition-all duration-200",
                              isSelected ? "border-bell bg-bell/5 shadow-sm ring-1 ring-bell/20" : "border-slate-200 hover:border-bell/50 hover:bg-slate-50",
                            )}
                          >
                            <span className={cn("text-[10px] font-bold tracking-wider", isSelected ? "text-bell" : "text-slate-500")}>{d.dayName}</span>
                            <span className={cn("my-0.5 text-2xl font-bold", isSelected ? "text-bell" : "text-slate-800")}>{d.dayNum}</span>
                            <span className={cn("text-xs font-medium", isSelected ? "text-bell" : "text-slate-500")}>{d.month}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-600">
                      Showing Time <span className="text-red-500">*</span>
                    </label>

                    {isLoadingSlots || fakeLoading ? (
                      <div className="flex items-center justify-center rounded-xl border border-slate-100 bg-slate-50/50 p-6">
                        <Loader2 className="mr-2 h-6 w-6 animate-spin text-bell" />
                        <span className="text-sm font-medium text-slate-600">Loading available timeslots...</span>
                      </div>
                    ) : (
                      <div
                        ref={slotsScrollRef}
                        onMouseDown={(e) => handleMouseDown(e, slotsScrollRef)}
                        onMouseLeave={handleMouseLeave}
                        onMouseUp={handleMouseUp}
                        onMouseMove={(e) => handleMouseMove(e, slotsScrollRef)}
                        className="hide-scrollbar flex cursor-grab snap-x gap-2 overflow-x-auto pb-2 active:cursor-grabbing"
                      >
                        {availableSlots.length > 0
                          ? availableSlots.map((slot, i) => {
                              const isSelected = selectedSlot?.time === slot.time;
                              return (
                                <button key={i} onClick={() => setSelectedSlot(slot)} className={timeButton(isSelected)}>
                                  {isSelected && <Clock className="h-3.5 w-3.5" />}
                                  {slot.time.split(" - ")[0]}
                                </button>
                              );
                            })
                          : REQUEST_TIMES.map((time, i) => {
                              const isSelected = customTime === time;
                              return (
                                <button key={i} type="button" onClick={() => setCustomTime(time)} className={timeButton(isSelected)}>
                                  {isSelected && <Clock className="h-3.5 w-3.5" />}
                                  {time.split(" - ")[0]}
                                </button>
                              );
                            })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <hr className="mb-6 border-slate-100" />

              {/* Step 2: Your information */}
              <div>
                <h3 className="mb-4 font-sans text-base font-semibold text-slate-800">Your Information</h3>

                <form className="grid grid-cols-1 gap-x-4 gap-y-3.5 md:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-1">
                    <label htmlFor="tour-first" className="text-xs font-medium text-slate-700">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="tour-first"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      autoComplete="given-name"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-base outline-none transition-all focus:border-bell focus:ring-1 focus:ring-bell"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="tour-last" className="text-xs font-medium text-slate-700">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="tour-last"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      autoComplete="family-name"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-base outline-none transition-all focus:border-bell focus:ring-1 focus:ring-bell"
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label htmlFor="tour-email" className="text-xs font-medium text-slate-700">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="tour-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="yourmail@email.com"
                      autoComplete="email"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-base outline-none transition-all focus:border-bell focus:ring-1 focus:ring-bell"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-1">
                    <label className="text-xs font-medium text-slate-700">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex w-full overflow-hidden rounded-lg border border-slate-200 bg-white px-3 focus-within:border-bell focus-within:ring-1 focus-within:ring-bell">
                      <PhoneInput
                        international
                        defaultCountry={countryCode as Country}
                        value={phone}
                        onChange={(val) => {
                          if (val) {
                            // India: strict 10-digit national number
                            if (val.startsWith("+91") && val.replace(/\D/g, "").length > 12) return;
                            // Don't let an extra digit turn a valid number invalid
                            if (phone && val.length > phone.length && isValidPhoneNumber(phone) && !isValidPhoneNumber(val)) return;
                          }
                          setPhone(val || "");
                        }}
                        limitMaxLength
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 md:col-span-1">
                    <label className="text-xs font-medium text-slate-700">
                      Expected Move-in Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <DatePicker
                        selected={expectedMoveIn}
                        onChange={(date: Date | null) => setExpectedMoveIn(date)}
                        minDate={selectedDate ? new Date(selectedDate + "T12:00:00Z") : new Date()}
                        placeholderText="Select move-in date"
                        dateFormat="MMM d, yyyy"
                        wrapperClassName="w-full"
                        showPopperArrow={false}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </form>

                {submitError && <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{submitError}</div>}
              </div>
            </div>

            {/* Footer */}
            <div className="flex shrink-0 justify-end gap-3 border-t border-slate-100 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:rounded-b-2xl sm:bg-slate-50 sm:p-5 sm:pb-5">
              <button onClick={onClose} disabled={isSubmitting} className="px-5 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 disabled:opacity-50">
                Cancel
              </button>
              <button
                className="flex items-center justify-center rounded-lg bg-plum px-6 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-plum-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!isFormValid || isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  submitText
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
