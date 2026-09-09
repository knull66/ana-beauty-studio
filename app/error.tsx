"use client";

import { useLanguage } from "@/components/language-provider";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { dictionary } = useLanguage();

  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-6 text-center">
      <p className="text-[11px] uppercase tracking-[0.42em] text-gold">
        {dictionary.error.kicker}
      </p>
      <h1 className="mt-4 font-serif text-4xl">{dictionary.error.title}</h1>
      <button
        type="button"
        onClick={reset}
        className="mt-8 text-[11px] uppercase tracking-[0.28em] text-muted hover:text-gold-soft"
      >
        {dictionary.error.retry}
      </button>
    </main>
  );
}
