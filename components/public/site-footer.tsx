"use client";

import Image from "next/image";
import { BookLink } from "@/components/public/book-link";
import { useLanguage } from "@/components/language-provider";
import { contactHref, contactLabel, visibleContacts } from "@/lib/contacts";
import type { StudioContact, StudioSettings } from "@/lib/types";

export function SiteFooter({
  contacts,
  settings,
}: {
  contacts: StudioContact[];
  settings: StudioSettings;
}) {
  const { dictionary } = useLanguage();
  const items = visibleContacts(contacts);

  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-[1fr_auto_1fr] md:items-start md:px-10">
        <div>
          <p className="font-serif text-xl tracking-[0.18em] text-gold-soft">
            ANA
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.36em] text-muted">
            Beauty Studio
          </p>
          {items.length > 0 ? (
            <ul className="mt-6 space-y-2">
              {items.map((item) => {
                const link = contactHref(item);
                const label = contactLabel(
                  item,
                  dictionary.adminContacts.kinds[item.kind],
                );

                return (
                  <li key={item.id}>
                    {link ? (
                      <a
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        className="text-[11px] uppercase tracking-[0.22em] text-muted transition-colors hover:text-gold-soft"
                      >
                        {label}
                      </a>
                    ) : (
                      <span className="text-[11px] uppercase tracking-[0.22em] text-muted">
                        {label}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : null}
          <div className="mt-6">
            <BookLink
              contacts={contacts}
              settings={settings}
              className="text-[11px] uppercase tracking-[0.28em] text-gold-soft hover:text-gold"
            />
          </div>
        </div>

        <p className="hidden text-center text-[11px] uppercase tracking-[0.28em] text-muted md:block">
          {dictionary.nav.portfolio} · {dictionary.nav.services}
        </p>

        <div className="flex flex-col items-center md:items-end">
          <p className="text-[10px] uppercase tracking-[0.36em] text-muted">
            {dictionary.credits.designed}
          </p>
          <div className="relative mt-3 h-28 w-28">
            <Image
              src="/credits/vibes-district.png"
              alt={dictionary.credits.studio}
              fill
              sizes="112px"
              className="object-contain"
            />
          </div>
          <p className="mt-2 text-[10px] uppercase tracking-[0.28em] text-gold-soft">
            {dictionary.credits.studio}
          </p>
          <p className="mt-6 text-[11px] uppercase tracking-[0.28em] text-muted">
            © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
