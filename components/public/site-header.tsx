"use client";

import Link from "next/link";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/components/language-provider";
import { Wordmark } from "@/components/wordmark";

export function SiteHeader({
  signedIn,
  isAdmin,
}: {
  signedIn: boolean;
  isAdmin: boolean;
}) {
  const { dictionary } = useLanguage();

  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-6 md:px-10">
        <Link href="/" aria-label="Ana Beauty Studio">
          <Wordmark compact />
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-5 text-[11px] uppercase tracking-[0.28em] text-muted md:gap-7">
          <a href="#portafolio" className="transition-colors hover:text-gold-soft">
            {dictionary.nav.portfolio}
          </a>
          <a href="#servicios" className="transition-colors hover:text-gold-soft">
            {dictionary.nav.services}
          </a>
          <LanguageToggle />
          {signedIn ? (
            <Link
              href={isAdmin ? "/admin" : "/account"}
              className="transition-colors hover:text-gold-soft"
            >
              {isAdmin ? dictionary.nav.admin : dictionary.nav.account}
            </Link>
          ) : (
            <>
              <Link href="/login" className="transition-colors hover:text-gold-soft">
                {dictionary.nav.login}
              </Link>
              <Link
                href="/register"
                className="border border-gold/35 px-3 py-1.5 text-gold-soft transition-colors hover:border-gold"
              >
                {dictionary.nav.register}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
