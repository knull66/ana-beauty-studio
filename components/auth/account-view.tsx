"use client";

import Link from "next/link";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/components/language-provider";
import { Wordmark } from "@/components/wordmark";
import { signOut } from "@/lib/actions/auth";

export function AccountView({
  email,
  isAdmin,
}: {
  email: string;
  isAdmin: boolean;
}) {
  const { dictionary } = useLanguage();

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
