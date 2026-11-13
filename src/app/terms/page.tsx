import Link from "next/link";
import { LegalPage } from "@/components/ui/LegalPage";
import { site } from "@/data/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Terms of Use",
  description: "The terms for using The Bellmont website, including listing information, tour bookings, applications and links to other sites.",
  path: "/terms/",
});

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" path="/terms/" intro="The ground rules for using this website. By using it, you agree to these terms.">
      <h2>About this website</h2>
      <p>
        This website gives information about renting at The Bellmont, 200 Old Carriage Drive, Kitchener, Ontario, and lets you contact our
        leasing team, book a tour and start an application.
      </p>

      <h2>Listing information</h2>
      <ul>
        <li>
          Prices, availability, features and photos come from our leasing system and can change at any time without notice. We try to keep
          them accurate, but errors can happen.
        </li>
        <li>Photos, floor descriptions and sizes may show a representative suite and are approximate.</li>
        <li>
          Nothing on this website is an offer to rent. The terms that apply to you are only those in a signed lease.
        </li>
      </ul>

      <h2>Tours and applications</h2>
      <ul>
        <li>
          Booking or requesting a tour does not reserve a suite. A requested time is confirmed only when our team confirms it with you.
        </li>
        <li>
          <em>Apply Now</em> takes you to our leasing portal. Submitting an application doesn&rsquo;t guarantee approval or that a suite will be
          available, and the portal&rsquo;s own terms apply there.
        </li>
        <li>Please give accurate information. We may decline or cancel bookings that use false or misleading details.</li>
      </ul>

      <h2>Using this website</h2>
      <p>
        You may use this website for personal, non-commercial purposes. Please don&rsquo;t misuse it — for example, by trying to disrupt it,
        access it without authorization, submit spam or automated requests, or copy its content in bulk.
      </p>

      <h2>Content and trademarks</h2>
      <p>
        The Bellmont name, logo and the content on this website belong to their owners and may not be used without permission, except to
        view and share pages for personal use.
      </p>

      <h2>Links to other sites</h2>
      <p>
        This website links to and embeds services run by others, such as our leasing portal and Google Maps. We aren&rsquo;t responsible for
        their content or practices, and their own terms and privacy policies apply.
      </p>

      <h2>No warranty</h2>
      <p>
        This website is provided &ldquo;as is&rdquo;. We don&rsquo;t promise that it will always be available or error-free.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the extent permitted by law, we aren&rsquo;t liable for any indirect or consequential loss arising from your use of this website or
        from relying on its content. Nothing in these terms limits any rights you have that cannot be limited by law.
      </p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of the Province of Ontario and the federal laws of Canada that apply there.</p>

      <h2>Privacy</h2>
      <p>
        How we handle personal information is explained in our <Link href="/privacy/">Privacy Policy</Link>.
      </p>

      <h2>Changes and contact</h2>
      <p>
        We may update these terms from time to time; the date at the top shows when they last changed. Questions? Call{" "}
        <a href={site.phoneHref}>{site.phone}</a> or use our <Link href="/contact/">contact page</Link>.
      </p>
    </LegalPage>
  );
}
