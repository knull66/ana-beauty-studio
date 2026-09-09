"use client";

import Image from "next/image";
import { EmptyState, ErrorBanner } from "@/components/feedback";
import { useLanguage } from "@/components/language-provider";
import { localized } from "@/lib/examples";
import { formatDuration, formatPrice } from "@/lib/format";
import type { ServicePackage } from "@/lib/types";

export function PackagesSection({
  packages,
  error,
}: {
  packages: ServicePackage[];
  error: string | null;
}) {
  const { locale, dictionary } = useLanguage();

  return (
    <section id="servicios" className="mx-auto max-w-6xl px-6 pb-28 md:px-10">
      <header className="mb-14">
        <p className="text-[11px] uppercase tracking-[0.42em] text-gold">
          {dictionary.packages.kicker}
        </p>
        <h2 className="mt-3 font-serif text-4xl text-foreground md:text-5xl">
          {dictionary.packages.title}
        </h2>
      </header>

      {error ? (
        <ErrorBanner message={error} />
      ) : packages.length === 0 ? (
        <EmptyState
          title={dictionary.packages.emptyTitle}
          description={dictionary.packages.emptyBody}
        />
      ) : (
        <div className="grid gap-10 md:grid-cols-2 md:gap-x-8 md:gap-y-16">
          {packages.map((item) => {
            const duration = formatDuration(item.duration_minutes);
            const name = localized(locale, item.name, item.name_es);
            const description = localized(
              locale,
              item.description,
              item.description_es,
            );

            return (
              <article key={item.id} className="group">
                {item.image_url ? (
                  <div className="relative mb-6 aspect-[4/5] overflow-hidden bg-surface">
                    <Image
                      src={item.image_url}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                ) : null}
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-serif text-2xl text-foreground md:text-3xl">
                    {name}
                  </h3>
                  <p className="shrink-0 font-serif text-xl text-gold-soft">
                    {formatPrice(item.price, locale)}
                  </p>
                </div>
                {duration ? (
                  <p className="mt-3 text-[11px] uppercase tracking-[0.28em] text-gold">
                    {duration}
                  </p>
                ) : null}
                {description ? (
                  <p className="mt-4 max-w-md text-sm leading-7 text-muted">
                    {description}
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
