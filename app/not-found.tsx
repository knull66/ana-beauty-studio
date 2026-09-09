"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language-provider";

export default function NotFound() {
  const { dictionary } = useLanguage();

  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-6 text-center">
      <p className="text-[11px] uppercase tracking-[0.42em] text-gold">
        {dictionary.notFound.kicker}
      </p>
      <h1 className="mt-4 font-serif text-4xl">{dictionary.notFound.title}</h1>
      <Link
        href="/"
        className="mt-8 text-[11px] uppercase tracking-[0.28em] text-muted hover:text-gold-soft"
      >
        {dictionary.notFound.home}
      </Link>
    </main>
  );
}
