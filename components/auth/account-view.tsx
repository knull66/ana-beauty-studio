"use client";

import Link from "next/link";
import { BookLink } from "@/components/public/book-link";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/components/language-provider";
import { Wordmark } from "@/components/wordmark";
import { signOut } from "@/lib/actions/auth";
import { localized } from "@/lib/examples";
import { formatDuration, formatPrice } from "@/lib/format";
import type { ServicePackage } from "@/lib/types";

export function AccountView({
  email,
  isAdmin,
  packages,
}: {
  email: string;
  isAdmin: boolean;
  packages: ServicePackage[];
}) {
  const { locale, dictionary } = useLanguage();

  return (
    <main className="mx-auto flex min-h-svh max-w-lg flex-col justify-center px-6 py-16">
      <div className="mb-10 flex items-center justify-between">
        <Link href="/" aria-label="Ana Beauty Studio">
          <Wordmark compact />
        </Link>
        <LanguageToggle />
      </div>
      <p className="text-[11px] uppercase tracking-[0.42em] text-gold">
        {dictionary.account.kicker}
      </p>
      <h1 className="mt-3 font-serif text-4xl">{dictionary.account.title}</h1>
      <p className="mt-6 text-sm text-muted">
        {dictionary.account.signedIn}
        <span className="mt-2 block text-gold-soft">{email}</span>
      </p>

      <section className="mt-12 border-t border-line pt-10">
        <h2 className="font-serif text-2xl">{dictionary.account.bookTitle}</h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          {dictionary.account.bookBody}
        </p>
        {packages.length === 0 ? (
          <p className="mt-6 text-sm text-muted">{dictionary.booking.empty}</p>
        ) : (
          <ul className="mt-6 space-y-3">
            {packages.map((item) => {
              const duration = formatDuration(item.duration_minutes);

              return (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-4 border border-line px-4 py-4"
                >
                  <div>
                    <p className="font-serif text-xl">
                      {localized(locale, item.name, item.name_es)}
                    </p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-muted">
                      {formatPrice(item.price, locale)}
                      {duration ? ` · ${duration}` : ""}
                    </p>
                  </div>
                  <BookLink
                    packageId={item.id}
                    bordered
                    className="shrink-0 text-[10px] uppercase tracking-[0.22em]"
                  />
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <div className="mt-10 flex flex-wrap gap-8 text-[11px] uppercase tracking-[0.28em]">
        {isAdmin ? (
          <Link href="/admin" className="text-gold-soft hover:text-gold">
            {dictionary.account.adminCta}
          </Link>
        ) : null}
        <Link href="/" className="text-muted hover:text-gold-soft">
          {dictionary.account.home}
        </Link>
        <form action={signOut}>
          <button type="submit" className="text-muted hover:text-gold-soft">
            {dictionary.account.signOut}
          </button>
        </form>
      </div>
    </main>
  );
}
