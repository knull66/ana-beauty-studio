"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { EmptyState, ErrorBanner } from "@/components/feedback";
import { useLanguage } from "@/components/language-provider";
import { localized } from "@/lib/examples";
import type { PortfolioImage } from "@/lib/types";

export function Gallery({
  images,
  error,
}: {
  images: PortfolioImage[];
  error: string | null;
}) {
  const { locale, dictionary } = useLanguage();
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const showPrev = useCallback(() => {
    setActive((current) => {
      if (current === null || images.length === 0) return current;
      return (current + images.length - 1) % images.length;
    });
  }, [images.length]);
  const showNext = useCallback(() => {
    setActive((current) => {
      if (current === null || images.length === 0) return current;
      return (current + 1) % images.length;
    });
  }, [images.length]);

  useEffect(() => {
    if (active === null) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") showPrev();
      if (event.key === "ArrowRight") showNext();
    }

    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [active, close, showNext, showPrev]);

  const current = active !== null ? images[active] : null;

  return (
    <section id="portafolio" className="mx-auto max-w-5xl px-6 py-16 md:px-10">
      <header className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.42em] text-gold">
          {dictionary.gallery.kicker}
        </p>
        <h2 className="mt-2 font-serif text-3xl text-foreground md:text-4xl">
          {dictionary.gallery.title}
        </h2>
      </header>

      {error ? (
        <ErrorBanner message={error} />
      ) : images.length === 0 ? (
        <EmptyState
          title={dictionary.gallery.emptyTitle}
          description={dictionary.gallery.emptyBody}
        />
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:gap-3">
          {images.map((image, index) => {
            const title = localized(locale, image.title, image.title_es);
            const category = localized(locale, image.category, image.category_es);
            const alt =
              localized(locale, image.alt_text, image.alt_text_es) || title;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => setActive(index)}
                className="group relative block aspect-[5/6] w-full overflow-hidden bg-surface"
                aria-label={alt || dictionary.gallery.viewImage}
              >
                <Image
                  src={image.public_url}
                  alt={alt || "Ana Beauty Studio"}
                  fill
                  sizes="(min-width: 640px) 33vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute bottom-3 left-3 translate-y-1 text-left opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="block text-[9px] uppercase tracking-[0.28em] text-gold">
                    {category}
                  </span>
                  {title ? (
                    <span className="mt-1 block font-serif text-base text-gold-soft">
                      {title}
                    </span>
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {current ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-4 [animation:fade-in_200ms_ease]"
          role="dialog"
          aria-modal="true"
          aria-label={
            localized(locale, current.alt_text, current.alt_text_es) ||
            localized(locale, current.title, current.title_es)
          }
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-6 top-6 text-[11px] uppercase tracking-[0.28em] text-muted hover:text-gold-soft"
          >
            {dictionary.gallery.close}
          </button>
          <div
            className="relative h-[82vh] w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={current.public_url}
              alt={localized(locale, current.alt_text, current.alt_text_es) || ""}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
          {current.title ? (
            <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.28em] text-gold-soft">
              {localized(locale, current.title, current.title_es)}
            </p>
          ) : null}
          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showPrev();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[11px] uppercase tracking-[0.28em] text-muted hover:text-gold-soft"
              >
                {dictionary.gallery.prev}
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] uppercase tracking-[0.28em] text-muted hover:text-gold-soft"
              >
                {dictionary.gallery.next}
              </button>
            </>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
