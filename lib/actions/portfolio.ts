"use server";

import { revalidatePath } from "next/cache";
import { requireAdminForAction } from "@/lib/auth";
import { PORTFOLIO_BUCKET } from "@/lib/constants";
import { toErrorMessage } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";

type PortfolioInput = {
  title: string;
  category: string;
  alt_text: string;
  storage_path: string;
  public_url: string;
  display_order: number;
};

function parseInput(input: PortfolioInput): PortfolioInput | string {
  const title = input.title.trim();
  const category = input.category.trim() || "General";
  const alt_text = input.alt_text.trim() || title;
  const storage_path = input.storage_path.trim();
  const public_url = input.public_url.trim();
  const display_order = Number.isFinite(input.display_order)
    ? Math.max(0, Math.trunc(input.display_order))
    : 0;

  if (!storage_path || !public_url) {
    return "Falta la imagen del portafolio.";
  }

  return { title, category, alt_text, storage_path, public_url, display_order };
}

export async function createPortfolioImage(
  input: PortfolioInput,
): Promise<ActionResult> {
  try {
    await requireAdminForAction();
    const parsed = parseInput(input);

    if (typeof parsed === "string") {
      return { ok: false, error: parsed };
    }

    const supabase = await createClient();
    const { error } = await supabase.from("portfolio_images").insert(parsed);

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/portfolio");
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: toErrorMessage(error, "No se pudo guardar la imagen."),
    };
  }
}

export async function updatePortfolioImage(
  id: string,
  input: PortfolioInput,
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
      .from("portfolio_images")
      .update(parsed)
      .eq("id", id);

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/portfolio");
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: toErrorMessage(error, "No se pudo actualizar la imagen."),
    };
  }
}

export async function deletePortfolioImage(
  id: string,
  storagePath: string,
): Promise<ActionResult> {
  try {
    await requireAdminForAction();

    if (!id) {
      return { ok: false, error: "Identificador inválido." };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("portfolio_images")
      .delete()
      .eq("id", id);

    if (error) {
      return { ok: false, error: error.message };
    }

    if (storagePath) {
      const { error: storageError } = await supabase.storage
        .from(PORTFOLIO_BUCKET)
        .remove([storagePath]);

      if (storageError) {
        return {
          ok: false,
          error: `Imagen eliminada de la galería, pero no del storage: ${storageError.message}`,
        };
      }
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/portfolio");
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: toErrorMessage(error, "No se pudo eliminar la imagen."),
    };
  }
}
