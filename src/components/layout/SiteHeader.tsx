"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { LogoWordmarkAlt, LogoLockup } from "@/components/brand/Logo";
import { nav, site } from "@/data/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-bell text-canvas transition-shadow duration-300",
        scrolled && "shadow-[0_1px_0_rgba(241,232,221,0.12),0_12px_30px_-18px_rgba(26,51,56,0.6)]",
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-6 lg:h-[4.5rem]">
        <Link href="/" aria-label="The Bellmont home" className="py-2">
          <LogoWordmarkAlt className="w-[150px] text-canvas lg:w-[172px]" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => {
            const active = !!pathname && (pathname.startsWith(item.href) || (item.href === "/suites/" && /^\/(private-rooms|whole-suites)/.test(pathname)));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "eyebrow relative py-2 text-canvas/85 transition-colors hover:text-canvas",
                  active && "text-canvas after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-gold",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <a href={site.phoneHref} className="hidden items-center gap-2 text-sm font-medium text-canvas/85 hover:text-canvas xl:flex">
            <Phone className="size-4" aria-hidden /> {site.phone}
          </a>
          <Link href="/suites/" className="btn-canvas min-h-[2.5rem] px-5 text-sm">
            Schedule a Tour
          </Link>
        </div>

        <button
          type="button"
          className="-mr-2 inline-flex size-11 items-center justify-center rounded-full text-canvas hover:bg-canvas/10 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-16 z-50 flex animate-fade-in flex-col overflow-y-auto bg-bell lg:hidden">
          <nav aria-label="Mobile" className="container flex flex-1 flex-col pt-6">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-canvas/15 py-4 font-serif text-[1.625rem] leading-none text-canvas"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-auto space-y-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-8">
              <Link href="/suites/" onClick={() => setOpen(false)} className="btn-canvas w-full">
                Schedule a Tour
              </Link>
              <a href={site.phoneHref} className="btn-outline-light w-full">
                <Phone className="size-4" aria-hidden /> Call {site.phone}
              </a>
              <LogoLockup className="mx-auto mt-6 w-[180px] text-canvas" />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
