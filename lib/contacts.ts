import type { Locale } from "@/lib/i18n";
import type {
  ContactKind,
  StudioContact,
  StudioSettings,
} from "@/lib/types";

export const DEFAULT_STUDIO_SETTINGS: StudioSettings = {
  id: 1,
  booking_message_en:
    "Hi, I would like to book an appointment at Ana Beauty Studio.",
  booking_message_es:
    "Hola, me gustaría reservar una cita en Ana Beauty Studio.",
};

export function isContactKind(value: string): value is ContactKind {
  return (
    value === "email" ||
    value === "whatsapp" ||
    value === "instagram" ||
    value === "phone" ||
    value === "address" ||
    value === "other"
  );
}

export function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export function contactHref(contact: Pick<StudioContact, "kind" | "value">) {
  const value = contact.value.trim();

  if (!value) {
    return null;
  }

  switch (contact.kind) {
    case "email":
      return { href: `mailto:${value}`, external: false };
    case "whatsapp": {
      const phone = digitsOnly(value);
      return phone
        ? { href: `https://wa.me/${phone}`, external: true }
        : null;
    }
    case "phone":
      return { href: `tel:${digitsOnly(value) || value}`, external: false };
    case "instagram": {
      if (/^https?:\/\//i.test(value)) {
        return { href: value, external: true };
      }
      const handle = value.replace(/^@/, "");
      return handle
        ? { href: `https://instagram.com/${handle}`, external: true }
        : null;
    }
    case "address":
      return {
        href: `https://maps.google.com/?q=${encodeURIComponent(value)}`,
        external: true,
      };
    case "other":
      return /^https?:\/\//i.test(value)
        ? { href: value, external: true }
        : null;
    default:
      return null;
  }
}

export function bookingContact(contacts: StudioContact[]) {
  return (
    contacts.find(
      (item) => item.use_for_booking && item.kind === "whatsapp" && item.value,
    ) ??
    contacts.find((item) => item.kind === "whatsapp" && item.value) ??
    null
  );
}

export function bookingUrl(
  contacts: StudioContact[],
  settings: StudioSettings,
  locale: Locale,
) {
  const whatsapp = bookingContact(contacts);

  if (!whatsapp) {
    return null;
  }

  const phone = digitsOnly(whatsapp.value);

  if (!phone) {
    return null;
  }

  const message =
    locale === "es"
      ? settings.booking_message_es
      : settings.booking_message_en;

  const params = message.trim()
    ? `?text=${encodeURIComponent(message.trim())}`
    : "";

  return `https://wa.me/${phone}${params}`;
}

export function visibleContacts(contacts: StudioContact[]) {
  return contacts.filter((item) => item.is_visible && item.value.trim());
}

export function contactLabel(
  contact: StudioContact,
  fallback: string,
) {
  return contact.label.trim() || fallback;
}

export function isMissingRelation(error: string | null) {
  if (!error) {
    return false;
  }

  const message = error.toLowerCase();
  return (
    message.includes("studio_contacts") ||
    message.includes("studio_settings") ||
    message.includes("schema cache")
  );
}
