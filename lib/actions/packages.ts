"use server";

import { revalidatePath } from "next/cache";
import { requireAdminForAction } from "@/lib/auth";
import { toErrorMessage } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";

type PackageInput = {
  name: string;
  description: string;
  price: number;
  duration_minutes: number | null;
  is_available: boolean;
  display_order: number;
};

function parseInput(input: PackageInput): PackageInput | string {
  const name = input.name.trim();
  const description = input.description.trim();
  const price = Number(input.price);
  const duration =
    input.duration_minutes === null || input.duration_minutes === undefined
      ? null
      : Number(input.duration_minutes);
  const display_order = Number.isFinite(input.display_order)
    ? Math.max(0, Math.trunc(input.display_order))
    : 0;

  if (!name) {
    return "El nombre del paquete es obligatorio.";
  }

  if (!Number.isFinite(price) || price < 0) {
    return "El precio no es válido.";
  }

  if (duration !== null && (!Number.isFinite(duration) || duration <= 0)) {
    return "La duración debe ser un número positivo.";
  }

  return {
    name,
    description,
    price,
    duration_minutes: duration,
    is_available: Boolean(input.is_available),
    display_order,
  };
}

export async function createPackage(
  input: PackageInput,
): Promise<ActionResult> {
  try {
    await requireAdminForAction();
    const parsed = parseInput(input);

    if (typeof parsed === "string") {
      return { ok: false, error: parsed };
    }

    const supabase = await createClient();
    const { error } = await supabase.from("service_packages").insert(parsed);

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/packages");
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: toErrorMessage(error, "No se pudo crear el paquete."),
    };
  }
}

export async function updatePackage(
  id: string,
  input: PackageInput,
): Promise<ActionResult> {
  try {
    await requireAdminForAction();

    if (!id) {
      return { ok: false, error: "Identificador inválido." };
    }

    const parsed = parseInput(input);

    if (typeof parsed === "string") {
      return { ok: false, error: parsed };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("service_packages")
      .update(parsed)
      .eq("id", id);

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/packages");
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: toErrorMessage(error, "No se pudo actualizar el paquete."),
    };
  }
}

export async function deletePackage(id: string): Promise<ActionResult> {
  try {
    await requireAdminForAction();

    if (!id) {
      return { ok: false, error: "Identificador inválido." };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("service_packages")
      .delete()
      .eq("id", id);

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/packages");
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: toErrorMessage(error, "No se pudo eliminar el paquete."),
    };
  }
}
