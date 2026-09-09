export type PortfolioImage = {
  id: string;
  title: string;
  title_es?: string;
  category: string;
  category_es?: string;
  alt_text: string;
  alt_text_es?: string;
  storage_path: string;
  public_url: string;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type ServicePackage = {
  id: string;
  name: string;
  name_es?: string;
  description: string;
  description_es?: string;
  price: number;
  duration_minutes: number | null;
  is_available: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  image_url?: string | null;
};

export const CONTACT_KINDS = [
  "email",
  "whatsapp",
  "instagram",
  "phone",
  "address",
  "other",
] as const;

export type ContactKind = (typeof CONTACT_KINDS)[number];

export type StudioContact = {
  id: string;
  kind: ContactKind;
  label: string;
  value: string;
  display_order: number;
  is_visible: boolean;
  use_for_booking: boolean;
  created_at: string;
  updated_at: string;
};

export type StudioSettings = {
  id: number;
  booking_message_en: string;
  booking_message_es: string;
  created_at?: string;
  updated_at?: string;
};

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string };

export type QueryResult<T> = {
  data: T;
  error: string | null;
};
