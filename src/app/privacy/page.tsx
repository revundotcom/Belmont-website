import Link from "next/link";
import { LegalPage } from "@/components/ui/LegalPage";
import { fullAddress, site } from "@/data/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Privacy Policy",
  description: "How The Bellmont website collects, uses and protects your personal information when you browse, contact us, book a tour or apply.",
  path: "/privacy/",
});

/*
 * Written to match what this site actually does (see src/lib/portal.ts,
 * ShowingModal.tsx, ContactForm.tsx). If the site starts collecting anything
 * new — analytics, chat, cookies — update this page in the same change.
 */
export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      path="/privacy/"
      intro="What we collect when you use this website, why, who it's shared with, and the choices you have."
    >
      <h2>Who we are</h2>
      <p>
        This website is operated for The Bellmont, a rental residence at {fullAddress} (&ldquo;The Bellmont&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). This
        policy covers {site.url.replace(/^https?:\/\//, "")} only. We handle personal information in line with Canada&rsquo;s{" "}
        <em>Personal Information Protection and Electronic Documents Act</em> (PIPEDA).
      </p>

      <h2>What we collect</h2>
      <h3>Information you give us</h3>
      <ul>
        <li>
          <strong>Contact form:</strong> your first and last name, email address, phone number and the type of home you&rsquo;re looking for.
        </li>
        <li>
          <strong>Tour booking:</strong> your first and last name, email address, phone number, expected move-in date, and the suite, date and
          time you choose.
        </li>
      </ul>
      <h3>Information collected automatically</h3>
      <ul>
        <li>
          Like any website, our hosting provider receives standard technical information when you visit, such as your IP address, browser
          type and the pages you request.
        </li>
        <li>
          When you open the tour booking form, your IP address is sent to a geolocation service (ipapi.co) only to pre-select your country
          code in the phone field.
        </li>
      </ul>
      <p>
        We don&rsquo;t sell personal information, and this website does not use advertising or analytics tracking.
      </p>

      <h2>How we use it</h2>
      <ul>
        <li>To answer your questions and help you find a suite.</li>
        <li>To book, confirm, change or follow up on a tour you request.</li>
        <li>To run, secure and fix this website.</li>
      </ul>
      <p>
        We won&rsquo;t send you marketing messages unless you agree to receive them, and you can opt out of any we send.
      </p>

      <h2>Who we share it with</h2>
      <ul>
        <li>
          <strong>Our leasing team and leasing system.</strong> Contact form and tour details are sent to the leasing management system our
          team uses to manage enquiries and tours, and to the people who respond to you.
        </li>
        <li>
          <strong>Service providers</strong> who host this website and run the services above, only as needed to provide them to us.
        </li>
        <li>
          <strong>Where required by law</strong>, for example in response to a valid legal request.
        </li>
      </ul>
      <p>
        Some of these providers may store or process information outside Canada, including in the United States, where it may be subject to
        the laws of that country.
      </p>

      <h2>Applying for a suite</h2>
      <p>
        <em>Apply Now</em> takes you to our secure leasing portal, where you create an account or sign in and complete your application.
        Information you enter there is collected by the portal, not by this website, and is covered by the privacy terms shown on the portal.
      </p>

      <h2>Cookies and third-party content</h2>
      <p>
        This website does not set its own tracking cookies. Pages that show a map embed Google Maps, and Google may set cookies or collect
        information when the map loads, under Google&rsquo;s own privacy policy. Listing photos and tour times load from our leasing system.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep personal information only as long as we need it for the purposes above or as the law requires, and then delete or anonymize
        it.
      </p>

      <h2>How we protect it</h2>
      <p>
        This website is served over an encrypted (HTTPS) connection, and access to enquiry and tour information is limited to the people and
        providers who need it. No method of transmission or storage is completely secure, but we take reasonable steps to protect your
        information.
      </p>

      <h2>Your choices and rights</h2>
      <p>
        You can ask to see the personal information we hold about you, ask us to correct it, or withdraw your consent to our using it (which
        may mean we can no longer help with your enquiry or tour). To do any of these, call us at <a href={site.phoneHref}>{site.phone}</a> or
        send a request through our <Link href="/contact/">contact page</Link>.
      </p>
      <p>
        If you&rsquo;re not satisfied with our response, you can contact the{" "}
        <a href="https://www.priv.gc.ca/" target="_blank" rel="noopener noreferrer">
          Office of the Privacy Commissioner of Canada
        </a>
        .
      </p>

      <h2>Children</h2>
      <p>This website is meant for adults looking for a place to rent. We don&rsquo;t knowingly collect information from children.</p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The date at the top shows when it last changed, and the current version is always on
        this page.
      </p>
    </LegalPage>
  );
}
