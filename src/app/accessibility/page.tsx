import Link from "next/link";
import { LegalPage } from "@/components/ui/LegalPage";
import { site } from "@/data/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Accessibility",
  description: "The Bellmont's approach to website accessibility, and how to get information in another format or ask for help.",
  path: "/accessibility/",
});

export default function AccessibilityPage() {
  return (
    <LegalPage title="Accessibility" path="/accessibility/" intro="We want everyone to be able to find a home here, online and in person.">
      <h2>Our approach</h2>
      <p>
        We work to make this website usable by as many people as possible, using the Web Content Accessibility Guidelines (WCAG) 2.0 Level AA
        as our guide. The site is built with readable text contrast, labelled form fields, keyboard navigation, text alternatives for
        images, and support for screen readers and reduced-motion settings.
      </p>

      <h2>Known limitations</h2>
      <p>
        Some content comes from other services, such as embedded maps and our leasing portal, and may not meet the same standard. Listing
        photos may not describe every detail of a suite.
      </p>

      <h2>Need help or another format?</h2>
      <p>
        If anything on this website is hard to use, or you&rsquo;d like information in a different format, call us at{" "}
        <a href={site.phoneHref}>{site.phone}</a> — we answer {site.phoneHours} — or reach us through our{" "}
        <Link href="/contact/">contact page</Link>. We can also book a tour for you over the phone.
      </p>

      <h2>Feedback</h2>
      <p>
        Tell us about any barrier you run into, and we&rsquo;ll use your feedback to improve.
      </p>
    </LegalPage>
  );
}
