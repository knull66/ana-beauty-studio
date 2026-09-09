"use client";

import Image from "next/image";
import { useLanguage } from "@/components/language-provider";
import type { PortfolioImage } from "@/lib/types";

export function Hero({ featured }: { featured?: PortfolioImage }) {
  const { dictionary } = useLanguage();

  return (
    <section className="relative flex min-h-svh items-end overflow-hidden">
      {featured ? (
        <Image
          src={featured.public_url}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-45"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/25" />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-24 pt-40 md:px-10 md:pb-32">
        <p className="text-[11px] uppercase tracking-[0.42em] text-gold">
          {dictionary.hero.kicker}
        </p>
        <h1 className="mt-6 max-w-3xl font-serif text-5xl leading-[0.95] text-foreground md:text-7xl">
          {dictionary.hero.title}
        </h1>
        <p className="mt-6 max-w-md text-sm leading-7 text-muted">
          {dictionary.hero.body}
        </p>
        <a
          href="#portafolio"
          className="mt-12 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-gold-soft transition-colors hover:text-gold"
        >
          {dictionary.hero.cta}
          <span aria-hidden className="block h-px w-10 bg-gold" />
        </a>
      </div>
    </section>
  );
}
