import type { Locale } from "@/lib/i18n";

export function formatPrice(value: number | string, locale: Locale = "en") {
  const amount = typeof value === "string" ? Number(value) : value;

  if (!Number.isFinite(amount)) {
    return "—";
  }

  return new Intl.NumberFormat(locale === "es" ? "es-US" : "en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDuration(minutes: number | null) {
  if (!minutes || minutes <= 0) {
    return null;
  }

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  return rest ? `${hours} h ${rest} min` : `${hours} h`;
}

export function toErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
