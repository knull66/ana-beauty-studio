"use server";

import { revalidatePath } from "next/cache";
import { requireAdminForAction } from "@/lib/auth";
import { isContactKind } from "@/lib/contacts";
import { toErrorMessage } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult, ContactKind } from "@/lib/types";

type ContactInput = {
  kind: ContactKind;
  label: string;
  value: string;
  display_order: number;
  is_visible: boolean;
  use_for_booking: boolean;
};

type SettingsInput = {
  booking_message_en: string;
  booking_message_es: string;
};

function parseContact(input: ContactInput): ContactInput | string {
  const kind = input.kind;
  const label = input.label.trim();
  const value = input.value.trim();
  const display_order = Number.isFinite(input.display_order)
    ? Math.max(0, Math.trunc(input.display_order))
    : 0;

  if (!isContactKind(kind)) {
    return "El tipo de contacto no es válido.";
  }

  if (!value) {
    return "El dato de contacto es obligatorio.";
  }

  if (kind === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "El correo no es válido.";
  }

  const use_for_booking = Boolean(input.use_for_booking) && kind === "whatsapp";

  return {
    kind,
    label,
    value,
    display_order,
    is_visible: Boolean(input.is_visible),
    use_for_booking,
  };
}

function revalidateStudio() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/contacts");
}

async function clearOtherBooking(id?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("studio_contacts")
    .update({ use_for_booking: false })
    .eq("use_for_booking", true);

  if (id) {
    query = query.neq("id", id);
  }

  await query;
}

export async function createContact(
  input: ContactInput,
): Promise<ActionResult> {
  try {
    await requireAdminForAction();
    const parsed = parseContact(input);

    if (typeof parsed === "string") {
      return { ok: false, error: parsed };
    }

    if (parsed.use_for_booking) {
      await clearOtherBooking();
    }

    const supabase = await createClient();
    const { error } = await supabase.from("studio_contacts").insert(parsed);

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidateStudio();
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: toErrorMessage(error, "No se pudo crear el contacto."),
    };
  }
}

export async function updateContact(
  id: string,
  input: ContactInput,
): Promise<ActionResult> {
  try {
    await requireAdminForAction();

    if (!id) {
      return { ok: false, error: "Identificador inválido." };
    }

    const parsed = parseContact(input);

    if (typeof parsed === "string") {
      return { ok: false, error: parsed };
    }

    if (parsed.use_for_booking) {
      await clearOtherBooking(id);
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("studio_contacts")
      .update(parsed)
      .eq("id", id);

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidateStudio();
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: toErrorMessage(error, "No se pudo actualizar el contacto."),
    };
  }
}

export async function deleteContact(id: string): Promise<ActionResult> {
  try {
    await requireAdminForAction();

    if (!id) {
      return { ok: false, error: "Identificador inválido." };
    }

    const supabase = await createClient();
    const { error } = await supabase.from("studio_contacts").delete().eq("id", id);

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidateStudio();
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: toErrorMessage(error, "No se pudo eliminar el contacto."),
    };
  }
}

export async function updateStudioSettings(
  input: SettingsInput,
): Promise<ActionResult> {
  try {
    await requireAdminForAction();

    const booking_message_en = input.booking_message_en.trim();
    const booking_message_es = input.booking_message_es.trim();

    const supabase = await createClient();
    const { error } = await supabase.from("studio_settings").upsert({
      id: 1,
      booking_message_en,
      booking_message_es,
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidateStudio();
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: toErrorMessage(error, "No se pudo guardar el mensaje de reserva."),
    };
  }
}
