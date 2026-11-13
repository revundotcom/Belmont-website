import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { JsonLd } from "@/components/ui/primitives";
import { site } from "@/data/site";

// Fraunces for headers (optical size axis for the 144 display cut), DM Sans for body.
const fraunces = Fraunces({ subsets: ["latin"], axes: ["opsz"], variable: "--font-fraunces", display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });

const defaultTitle = "The Bellmont | Rooms & Suites for Rent at 200 Old Carriage Drive, Kitchener";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: defaultTitle, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
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
  robots: { index: true, follow: true },
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
  petsAllowed: true,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.regionCode,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
  amenityFeature: [
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
        <JsonLd data={residenceSchema} />
      </body>
    </html>
  );
}
