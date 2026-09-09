"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import {
  defaultLocale,
  dictionaries,
  isLocale,
  localeCookie,
  type Dictionary,
  type Locale,
} from "@/lib/i18n";

type LanguageContextValue = {
  locale: Locale;
  dictionary: Dictionary;
  setLocale: (locale: Locale) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readLocale(): Locale {
  const stored = window.localStorage.getItem(localeCookie);
  return isLocale(stored) ? stored : defaultLocale;
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("abs-locale", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("abs-locale", callback);
  };
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(subscribe, readLocale, () => defaultLocale);

  const setLocale = useCallback((next: Locale) => {
    window.localStorage.setItem(localeCookie, next);
    document.documentElement.lang = next;
    document.cookie = `${localeCookie}=${next}; path=/; max-age=31536000; samesite=lax`;
    window.dispatchEvent(new Event("abs-locale"));
  }, []);

  const value = useMemo(
    () => ({
      locale,
      dictionary: dictionaries[locale],
      setLocale,
    }),
    [locale, setLocale],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider.");
  }

  return context;
}
