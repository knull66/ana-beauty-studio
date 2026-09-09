"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { BookLink } from "@/components/public/book-link";
import { useLanguage } from "@/components/language-provider";
import { localized } from "@/lib/examples";
import type { PortfolioImage } from "@/lib/types";

const SLIDE_MS = 5500;

export function Hero({ images }: { images: PortfolioImage[] }) {
  const { locale, dictionary } = useLanguage();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = images.length;

  const goTo = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (count < 2 || paused) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, SLIDE_MS);

    return () => window.clearInterval(id);
  }, [count, paused]);

  return (
    <section
      className="relative flex min-h-svh items-center overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Ana Beauty Studio"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {images.map((image, slideIndex) => (
        <Image
          key={image.id}
          src={image.public_url}
          alt={localized(locale, image.alt_text, image.alt_text_es)}
          fill
          priority={slideIndex === 0}
          sizes="100vw"
          className={`hero-slide object-cover ${
            slideIndex === index ? "opacity-50" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/20" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-32 text-center md:px-10">
        <p className="text-[11px] uppercase tracking-[0.42em] text-gold">
          {dictionary.hero.kicker}
        </p>
        <h1 className="mt-7 flex flex-col items-center">
          <span className="font-serif text-6xl leading-none tracking-[0.28em] text-gold-soft md:text-8xl">
            ANA
          </span>
          <span className="mt-4 text-[12px] uppercase tracking-[0.48em] text-foreground md:text-sm">
            Beauty Studio
          </span>
        </h1>
        <span className="mt-8 block h-px w-16 bg-gold" />
        <p className="mt-8 max-w-md text-sm leading-7 text-muted">
          {dictionary.hero.body}
        </p>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
          <BookLink
            bordered
            className="text-[11px] uppercase tracking-[0.32em]"
          />
          <a
            href="#portafolio"
            className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-gold-soft transition-colors hover:text-gold"
          >
            {dictionary.hero.cta}
            <span aria-hidden className="block h-px w-10 bg-gold" />
          </a>
        </div>
      </div>

      {count > 1 ? (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            className="absolute left-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center border border-gold/30 text-gold-soft transition-colors hover:border-gold md:flex"
            aria-label={dictionary.hero.prev}
          >
            <span aria-hidden>‹</span>
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            className="absolute right-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center border border-gold/30 text-gold-soft transition-colors hover:border-gold md:flex"
            aria-label={dictionary.hero.next}
          >
            <span aria-hidden>›</span>
          </button>
          <div className="absolute inset-x-0 bottom-8 z-10 flex justify-center gap-2">
            {images.map((image, slideIndex) => (
              <button
                key={image.id}
                type="button"
                onClick={() => goTo(slideIndex)}
                className={`h-1.5 rounded-full transition-all ${
                  slideIndex === index
                    ? "w-8 bg-gold"
                    : "w-2 bg-gold/35 hover:bg-gold/70"
                }`}
                aria-label={`${dictionary.hero.slide} ${slideIndex + 1}`}
                aria-current={slideIndex === index ? "true" : undefined}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
