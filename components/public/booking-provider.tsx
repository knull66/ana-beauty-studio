"use client";

import Image from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLanguage } from "@/components/language-provider";
import { bookingContact, bookingUrl } from "@/lib/contacts";
import { localized } from "@/lib/examples";
import { formatDuration, formatPrice } from "@/lib/format";
import type { ServicePackage, StudioContact, StudioSettings } from "@/lib/types";

type BookingContextValue = {
  canBook: boolean;
  open: (packageId?: string | null) => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function useBooking() {
  return useContext(BookingContext);
}

export function BookingProvider({
  packages,
  contacts,
  settings,
  children,
}: {
  packages: ServicePackage[];
  contacts: StudioContact[];
  settings: StudioSettings;
  children: React.ReactNode;
}) {
  const { locale, dictionary } = useLanguage();
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const canBook = Boolean(bookingContact(contacts));
  const selected = packages.find((item) => item.id === selectedId) ?? null;
  const href = bookingUrl(contacts, settings, locale, selected);

  const openBooking = useCallback((packageId?: string | null) => {
    setSelectedId(packageId ?? (packages.length === 1 ? packages[0].id : null));
    setOpen(true);
  }, [packages]);

  useEffect(() => {
    if (!open) return;

    dialogRef.current?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const value = useMemo(
    () => ({ canBook, open: openBooking }),
    [canBook, openBooking],
  );

  return (
    <BookingContext.Provider value={value}>
      {children}
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-4 sm:items-center">
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className="max-h-[88svh] w-full max-w-lg overflow-y-auto border border-line bg-background p-8"
          >
            <p className="text-[11px] uppercase tracking-[0.42em] text-gold">
              {dictionary.booking.kicker}
            </p>
            <h2 id={titleId} className="mt-3 font-serif text-3xl">
              {dictionary.booking.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              {dictionary.booking.choose}
            </p>

            {packages.length === 0 ? (
              <p className="mt-8 text-sm text-muted">{dictionary.booking.empty}</p>
            ) : (
              <ul className="mt-8 space-y-3">
                {packages.map((item) => {
                  const name = localized(locale, item.name, item.name_es);
                  const duration = formatDuration(item.duration_minutes);
                  const active = item.id === selectedId;

                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(item.id)}
                        aria-pressed={active}
                        className={`flex w-full items-center gap-4 border p-4 text-left transition-colors ${
                          active
                            ? "border-gold bg-gold/5"
                            : "border-line hover:border-gold/40"
                        }`}
                      >
                        {item.image_url ? (
                          <span className="relative hidden h-16 w-12 shrink-0 overflow-hidden bg-surface sm:block">
                            <Image
                              src={item.image_url}
                              alt=""
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </span>
                        ) : null}
                        <span className="min-w-0 flex-1">
                          <span className="block font-serif text-xl leading-tight">
                            {name}
                          </span>
                          {duration ? (
                            <span className="mt-1 block text-[10px] uppercase tracking-[0.22em] text-gold">
                              {duration}
                            </span>
                          ) : null}
                        </span>
                        <span className="shrink-0 font-serif text-lg text-gold-soft">
                          {formatPrice(item.price, locale)}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            {!canBook ? (
              <p className="mt-6 text-sm text-gold-soft">
                {dictionary.booking.unavailable}
              </p>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center justify-end gap-6 text-[11px] uppercase tracking-[0.28em]">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-muted hover:text-gold-soft"
              >
                {dictionary.booking.close}
              </button>
              {href && selected ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-gold/40 px-5 py-2 text-gold-soft hover:border-gold"
                >
                  {dictionary.booking.continue}
                </a>
              ) : (
                <span className="border border-line px-5 py-2 text-muted">
                  {dictionary.booking.continue}
                </span>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </BookingContext.Provider>
  );
}
