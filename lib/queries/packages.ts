import { isSupabaseConfigured } from "@/lib/env";
import { EXAMPLE_PACKAGES } from "@/lib/examples";
import { toErrorMessage } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import type { QueryResult, ServicePackage } from "@/lib/types";

function mapPackage(row: ServicePackage): ServicePackage {
  return {
    ...row,
    price: Number(row.price),
    duration_minutes:
      row.duration_minutes === null ? null : Number(row.duration_minutes),
    display_order: Number(row.display_order),
  };
}

export async function getServicePackages(options?: {
  availableOnly?: boolean;
}): Promise<QueryResult<ServicePackage[]>> {
  if (!isSupabaseConfigured()) {
    const data = options?.availableOnly
      ? EXAMPLE_PACKAGES.filter((item) => item.is_available)
      : EXAMPLE_PACKAGES;
    return { data, error: null };
  }

  try {
    const supabase = await createClient();
    let query = supabase
      .from("service_packages")
      .select(
        "id, name, description, price, duration_minutes, is_available, display_order, created_at, updated_at",
      )
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (options?.availableOnly) {
      query = query.eq("is_available", true);
    }

    const { data, error } = await query;

    if (error) {
      return { data: EXAMPLE_PACKAGES, error: error.message };
    }

    const packages = (data ?? []).map(mapPackage);
    return {
      data: packages.length > 0 ? packages : EXAMPLE_PACKAGES,
      error: null,
    };
  } catch (error) {
    return {
      data: EXAMPLE_PACKAGES,
      error: toErrorMessage(error, "No se pudieron cargar los paquetes."),
    };
  }
}

export async function getPublicPackages() {
  return getServicePackages({ availableOnly: true });
}
