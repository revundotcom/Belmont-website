import Link from "next/link";
import { LogoMark } from "@/components/brand/Logo";

export default function NotFound() {
  return (
    <section className="container flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <LogoMark className="w-14 text-bell" />
      <p className="eyebrow mt-8 text-bell">Not found</p>
      <h1 className="type-h1 mt-4">This suite has moved on.</h1>
      <p className="mt-4 max-w-md text-body-lg text-brown">It may have been leased or the link has changed. Everything open right now is on our suites page.</p>
      <Link href="/suites/" className="btn-plum mt-10">
        See available suites
      </Link>
    </section>
  );
}
