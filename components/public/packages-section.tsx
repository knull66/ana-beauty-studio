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
    <section id="servicios" className="mx-auto max-w-5xl px-6 pb-20 md:px-10">
      <header className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.42em] text-gold">
          {dictionary.packages.kicker}
        </p>
        <h2 className="mt-2 font-serif text-3xl text-foreground md:text-4xl">
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
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
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
                  <div className="relative mb-3 aspect-[3/4] overflow-hidden bg-surface">
                    <Image
                      src={item.image_url}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                ) : null}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-serif text-lg leading-tight text-foreground">
                    {name}
                  </h3>
                  <p className="shrink-0 font-serif text-sm text-gold-soft">
                    {formatPrice(item.price, locale)}
                  </p>
                </div>
                {duration ? (
                  <p className="mt-1.5 text-[10px] uppercase tracking-[0.24em] text-gold">
                    {duration}
                  </p>
                ) : null}
                {description ? (
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted">
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
