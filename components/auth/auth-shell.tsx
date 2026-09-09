"use client";

import Link from "next/link";
import { LanguageToggle } from "@/components/language-toggle";
import { Wordmark } from "@/components/wordmark";

export function AuthShell({
  kicker,
  notice,
  children,
}: {
  kicker: string;
  notice?: string | null;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-svh items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex justify-end">
          <LanguageToggle />
        </div>
        <Link href="/" className="flex justify-center">
          <Wordmark />
        </Link>
        <p className="mt-10 text-center text-[11px] uppercase tracking-[0.42em] text-muted">
          {kicker}
        </p>
        {notice ? (
          <p className="mt-6 text-center text-sm leading-6 text-gold-soft">
            {notice}
          </p>
        ) : null}
        {children}
      </div>
    </main>
  );
}
