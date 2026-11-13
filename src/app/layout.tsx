import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { JsonLd } from "@/components/ui/primitives";
import { site } from "@/data/site";
import { PORTAL_BASE_URL } from "@/lib/portal";

// Fraunces for headers (optical size axis for the 144 display cut), DM Sans for body.
const fraunces = Fraunces({ subsets: ["latin"], axes: ["opsz"], variable: "--font-fraunces", display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });

const defaultTitle = "The Bellmont Kitchener | Rooms & Suites for Rent near Conestoga College";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: defaultTitle, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "The Bellmont Kitchener",
    "200 Old Carriage Drive",
    "apartments for rent Kitchener",
    "rooms for rent Kitchener",
    "student housing Conestoga College",
    "furnished rooms Kitchener",
    "3 bedroom apartment Kitchener",
    "4 bedroom apartment Kitchener",
    "Pioneer Park Kitchener rentals",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: "real estate",
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: site.url,
    siteName: site.name,
    title: defaultTitle,
    description: site.description,
  },
  twitter: { card: "summary_large_image", title: defaultTitle, description: site.description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION ? { verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } } : {}),
};

export const viewport: Viewport = {
  themeColor: "#2F5D66",
  width: "device-width",
  initialScale: 1,
};

const residenceSchema = {
  "@context": "https://schema.org",
  "@type": "ApartmentComplex",
  "@id": `${site.url}/#residence`,
  name: site.name,
  url: site.url,
  slogan: site.tagline,
  description: site.description,
  telephone: `+1-${site.phone}`,
  image: `${PORTAL_BASE_URL}${site.heroImage}`,
  hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapQuery)}`,
  petsAllowed: true,
  containsPlace: [
    { "@type": "Residence", name: "The Bellmont — Tower A (private rooms)", url: `${site.url}/private-rooms/` },
    { "@type": "Residence", name: "The Bellmont — Tower B (whole suites)", url: `${site.url}/whole-suites/` },
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.regionCode,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
  amenityFeature: [
    "24/7 convenience store",
    "Fitness centre",
    "Yoga room",
    "Theatre room",
    "Games room",
    "Meeting rooms",
    "Study rooms",
    "Underground parking",
    "On-site management",
  ].map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${site.url}/#website`,
  url: site.url,
  name: site.name,
  inLanguage: "en-CA",
  publisher: { "@id": `${site.url}/#residence` },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only z-[100] rounded-full bg-plum px-4 py-2 text-canvas focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <JsonLd data={[residenceSchema, websiteSchema]} />
      </body>
    </html>
  );
}
