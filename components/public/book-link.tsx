"use client";

import { useBooking } from "@/components/public/booking-provider";
import { useLanguage } from "@/components/language-provider";

type BookLinkProps = {
  className?: string;
  bordered?: boolean;
  packageId?: string;
};

export function BookLink({
  className = "",
  bordered = false,
  packageId,
}: BookLinkProps) {
  const { dictionary } = useLanguage();
  const booking = useBooking();

  if (!booking) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => booking.open(packageId)}
      className={
        bordered
          ? `border border-gold/35 px-3 py-1.5 text-gold-soft transition-colors hover:border-gold ${className}`
          : className
      }
    >
      {dictionary.nav.book}
    </button>
  );
}
