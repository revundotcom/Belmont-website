import Link from "next/link";
import { LogoLockup } from "@/components/brand/Logo";
import { fullAddress, nav, site } from "@/data/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-teal text-canvas">
      <div className="container grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr] lg:py-20">
        <div>
          <LogoLockup className="w-[220px] text-canvas" />
          <p className="mt-6 max-w-sm text-body text-canvas/80">{site.tagline} Private rooms and whole suites in two towers in Kitchener&rsquo;s Pioneer Park.</p>
        </div>

        <div>
          <p className="eyebrow text-seafoam">Visit</p>
          <address className="mt-4 not-italic text-body text-canvas/85">
            {site.address.street}
            <br />
            {site.address.city}, {site.address.region} {site.address.postalCode}
          </address>
          <a
            className="mt-3 inline-block text-sm font-semibold text-canvas underline decoration-canvas/30 underline-offset-4 hover:decoration-canvas"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Get directions
          </a>
        </div>

        <div>
          <p className="eyebrow text-seafoam">Talk to us</p>
          <a href={site.phoneHref} className="mt-4 block font-serif text-[1.75rem] leading-none text-canvas hover:text-white">
            {site.phone}
          </a>
          <p className="mt-2 text-sm text-canvas/70">{site.phoneHours}</p>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="eyebrow text-canvas/75 hover:text-canvas">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-canvas/10">
        <div className="container flex flex-col gap-2 py-6 text-xs text-canvas/60 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} The Bellmont. All rights reserved.</p>
          <p>Prices and availability update live and can change without notice.</p>
        </div>
      </div>
    </footer>
  );
}
