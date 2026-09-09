"use client";

import { useLanguage } from "@/components/language-provider";

export function SiteFooter() {
  const { dictionary } = useLanguage();

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-[11px] uppercase tracking-[0.28em] text-muted md:flex-row md:px-10">
        <p>Ana Beauty Studio</p>
        <p>
          {dictionary.nav.portfolio} · {dictionary.nav.services}
        </p>
        <p>© {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
