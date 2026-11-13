import { NextResponse } from "next/server";
import { submitLead } from "@/lib/portal";

/**
 * Contact form → portal /api/lead-submit (same CRM pipe the MoveSmart site uses).
 * Proxied here so the browser never talks to the lead endpoint directly.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  // Honeypot: bots fill every field. Pretend it worked.
  if (typeof body.company === "string" && body.company.trim()) {
    return NextResponse.json({ ok: true });
  }

  const str = (k: string, max = 100) => (typeof body[k] === "string" ? (body[k] as string).trim().slice(0, max) : "");
  const first_name = str("first_name");
  const last_name = str("last_name");
  const email = str("email", 160);
  const phone = str("phone", 20);
  const interest = str("interest", 60);

  if (!first_name || !last_name) return NextResponse.json({ message: "Please add your first and last name." }, { status: 422 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ message: "Please add a valid email." }, { status: 422 });
  if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(phone)) return NextResponse.json({ message: "Please add a 10-digit phone number." }, { status: 422 });

  const result = await submitLead({
    first_name,
    last_name,
    email,
    phone,
    user_type: "Tenant",
    source: "The Bellmont Website",
    city: "Kitchener",
    ...(interest ? { property_type: interest } : {}),
  });

  if (!result.ok) {
    console.warn("[contact] lead-submit failed", result.status, result.message);
    return NextResponse.json({ message: "We couldn't send that just now. Please call 833-501-7501." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
