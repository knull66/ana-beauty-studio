import { isSupabaseConfigured } from "@/lib/env";
import { EXAMPLE_PORTFOLIO } from "@/lib/examples";
import { toErrorMessage } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import type { PortfolioImage, QueryResult } from "@/lib/types";

function mapImage(row: PortfolioImage): PortfolioImage {
  return {
    ...row,
    display_order: Number(row.display_order),
  };
}

export async function getPortfolioImages(): Promise<
  QueryResult<PortfolioImage[]>
> {
  if (!isSupabaseConfigured()) {
    return { data: EXAMPLE_PORTFOLIO, error: null };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("portfolio_images")
      .select(
        "id, title, category, alt_text, storage_path, public_url, display_order, created_at, updated_at",
      )
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      return { data: EXAMPLE_PORTFOLIO, error: error.message };
    }

    const images = (data ?? []).map(mapImage);
    return {
      data: images.length > 0 ? images : EXAMPLE_PORTFOLIO,
      error: null,
    };
  } catch (error) {
    return {
      data: EXAMPLE_PORTFOLIO,
      error: toErrorMessage(error, "No se pudo cargar el portafolio."),
    };
  }
}
