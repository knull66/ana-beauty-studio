"use client";

import { BookLink } from "@/components/public/book-link";
import { useLanguage } from "@/components/language-provider";
import { contactHref, contactLabel, visibleContacts } from "@/lib/contacts";
import type { StudioContact, StudioSettings } from "@/lib/types";

export function ContactSection({
  contacts,
  settings,
}: {
  contacts: StudioContact[];
  settings: StudioSettings;
}) {
  const { dictionary } = useLanguage();
  const items = visibleContacts(contacts);

  if (items.length === 0) {
    return null;
  }

  return (
    <section id="contacto" className="mx-auto max-w-5xl px-6 pb-20 md:px-10">
      <header className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.42em] text-gold">
          {dictionary.contact.kicker}
        </p>
        <h2 className="mt-2 font-serif text-3xl text-foreground md:text-4xl">
          {dictionary.contact.title}
        </h2>
      </header>
      <ul className="grid gap-6 sm:grid-cols-2">
        {items.map((item) => {
          const link = contactHref(item);
          const label = contactLabel(item, dictionary.adminContacts.kinds[item.kind]);

          return (
            <li key={item.id} className="border-t border-line pt-5">
              <p className="text-[11px] uppercase tracking-[0.28em] text-muted">
                {label}
              </p>
              {link ? (
                <a
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="mt-2 block text-sm text-gold-soft transition-colors hover:text-gold"
                >
                  {item.value}
                </a>
              ) : (
                <p className="mt-2 text-sm text-foreground">{item.value}</p>
              )}
            </li>
          );
        })}
      </ul>
      <div className="mt-10">
        <BookLink
          contacts={contacts}
          settings={settings}
          bordered
          className="inline-flex text-[11px] uppercase tracking-[0.28em]"
        />
      </div>
    </section>
  );
}
