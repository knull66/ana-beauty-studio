"use client";

import { useLanguage } from "@/components/language-provider";

export function LanguageToggle() {
  const { locale, setLocale, dictionary } = useLanguage();

  return (
    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em]">
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={locale === "en" ? "text-gold-soft" : "text-muted hover:text-gold-soft"}
        aria-pressed={locale === "en"}
      >
        {dictionary.language.en}
      </button>
      <span className="text-muted/40">/</span>
      <button
        type="button"
        onClick={() => setLocale("es")}
        className={locale === "es" ? "text-gold-soft" : "text-muted hover:text-gold-soft"}
        aria-pressed={locale === "es"}
      >
        {dictionary.language.es}
      </button>
    </div>
  );
}
