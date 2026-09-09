import { cache } from "react";
import { DEFAULT_STUDIO_SETTINGS, isContactKind } from "@/lib/contacts";
import { isSupabaseConfigured } from "@/lib/env";
import { toErrorMessage } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import type {
  QueryResult,
  StudioContact,
  StudioSettings,
} from "@/lib/types";

function mapContact(row: StudioContact): StudioContact | null {
  if (!isContactKind(row.kind)) {
    return null;
  }

  return {
    ...row,
    label: row.label ?? "",
    value: row.value ?? "",
    display_order: Number(row.display_order) || 0,
    is_visible: Boolean(row.is_visible),
    use_for_booking: Boolean(row.use_for_booking),
  };
}

export const getStudioContacts = cache(
  async function getStudioContacts(): Promise<QueryResult<StudioContact[]>> {
    if (!isSupabaseConfigured()) {
      return { data: [], error: null };
    }

    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("studio_contacts")
        .select(
          "id, kind, label, value, display_order, is_visible, use_for_booking, created_at, updated_at",
        )
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (error) {
        return { data: [], error: error.message };
      }

      return {
        data: (data ?? [])
          .map((row) => mapContact(row as StudioContact))
          .filter((row): row is StudioContact => row !== null),
        error: null,
      };
    } catch (error) {
      return {
        data: [],
        error: toErrorMessage(error, "No se pudieron cargar los contactos."),
      };
    }
  },
);

export const getStudioSettings = cache(
  async function getStudioSettings(): Promise<QueryResult<StudioSettings>> {
    if (!isSupabaseConfigured()) {
      return { data: DEFAULT_STUDIO_SETTINGS, error: null };
    }

    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("studio_settings")
        .select("id, booking_message_en, booking_message_es, created_at, updated_at")
        .eq("id", 1)
        .maybeSingle();

      if (error) {
        return { data: DEFAULT_STUDIO_SETTINGS, error: error.message };
      }

      if (!data) {
        return { data: DEFAULT_STUDIO_SETTINGS, error: null };
      }

      return {
        data: {
          id: 1,
          booking_message_en:
            data.booking_message_en || DEFAULT_STUDIO_SETTINGS.booking_message_en,
          booking_message_es:
            data.booking_message_es || DEFAULT_STUDIO_SETTINGS.booking_message_es,
          created_at: data.created_at,
          updated_at: data.updated_at,
        },
        error: null,
      };
    } catch (error) {
      return {
        data: DEFAULT_STUDIO_SETTINGS,
        error: toErrorMessage(error, "No se pudo cargar la configuración."),
      };
    }
  },
);

export const getStudioProfile = cache(async function getStudioProfile() {
  const [contacts, settings] = await Promise.all([
    getStudioContacts(),
    getStudioSettings(),
  ]);

  return {
    contacts: contacts.data,
    settings: settings.data,
    error: contacts.error || settings.error,
  };
});
