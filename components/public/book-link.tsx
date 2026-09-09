"use client";

import { useLanguage } from "@/components/language-provider";
import { bookingUrl } from "@/lib/contacts";
import type { StudioContact, StudioSettings } from "@/lib/types";

type BookLinkProps = {
  contacts: StudioContact[];
  settings: StudioSettings;
  className?: string;
  bordered?: boolean;
};

export function BookLink({
  contacts,
  settings,
  className = "",
  bordered = false,
}: BookLinkProps) {
  const { locale, dictionary } = useLanguage();
  const href = bookingUrl(contacts, settings, locale);

  if (!href) {
    return null;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        bordered
          ? `border border-gold/35 px-3 py-1.5 text-gold-soft transition-colors hover:border-gold ${className}`
          : className
      }
    >
      {dictionary.nav.book}
    </a>
  );
}
