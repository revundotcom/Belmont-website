"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

/** Formats North American digits as (123) 456-7890 — the shape the lead API wants. */
function formatPhone(input: string): string {
  const d = input.replace(/\D/g, "").replace(/^1(?=\d{10})/, "").slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: form.get("first_name"),
          last_name: form.get("last_name"),
          email: form.get("email"),
          phone,
          interest: form.get("interest"),
          company: form.get("company"),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) throw new Error(data.message || "We couldn't send that. Please try again or call us.");
      setState("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="flex flex-col items-start rounded-[1.25rem] bg-canvas-soft p-8 text-brown">
        <CheckCircle2 className="size-10 text-bell" aria-hidden />
        <h3 className="type-h3 mt-4">Thanks, we&rsquo;ll be in touch.</h3>
        <p className="mt-2">A leasing advisor will call or email you shortly. Need us sooner? Call 833-501-7501, any time.</p>
      </div>
    );
  }

  const phoneValid = /^\(\d{3}\) \d{3}-\d{4}$/.test(phone);

  return (
    <form onSubmit={onSubmit} className="rounded-[1.25rem] bg-canvas-soft p-6 text-brown sm:p-8" noValidate={false}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-first" className="field-label">
            First name
          </label>
          <input id="cf-first" name="first_name" required autoComplete="given-name" className="field" />
        </div>
        <div>
          <label htmlFor="cf-last" className="field-label">
            Last name
          </label>
          <input id="cf-last" name="last_name" required autoComplete="family-name" className="field" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="cf-email" className="field-label">
            Email
          </label>
          <input id="cf-email" name="email" type="email" required autoComplete="email" className="field" />
        </div>
        <div>
          <label htmlFor="cf-phone" className="field-label">
            Phone
          </label>
          <input
            id="cf-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            required
            autoComplete="tel-national"
            placeholder="(519) 555-0123"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            aria-invalid={phone.length > 0 && !phoneValid}
            className="field"
          />
        </div>
        <div>
          <label htmlFor="cf-interest" className="field-label">
            I&rsquo;m looking for
          </label>
          <select id="cf-interest" name="interest" className="field appearance-none" defaultValue="Private room (Tower A)">
            <option>Private room (Tower A)</option>
            <option>Whole suite (Tower B)</option>
            <option>Not sure yet</option>
          </select>
        </div>
        {/* Honeypot */}
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="cf-company">Company</label>
          <input id="cf-company" name="company" tabIndex={-1} autoComplete="off" />
        </div>
      </div>

      {state === "error" && (
        <p role="alert" className="mt-4 rounded-xl border border-plum/30 bg-plum/5 px-4 py-3 text-sm text-plum">
          {error}
        </p>
      )}

      <button type="submit" disabled={state === "sending" || !phoneValid} className="btn-plum mt-6 w-full sm:w-auto">
        {state === "sending" ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden /> Sending
          </>
        ) : (
          "Ask a leasing advisor"
        )}
      </button>
      <p className="mt-3 text-xs text-brown-muted">We only use your details to answer you about The Bellmont.</p>
    </form>
  );
}
