import type { PortfolioImage, ServicePackage } from "@/lib/types";
import type { Locale } from "@/lib/i18n";

const now = "2026-01-01T00:00:00.000Z";

export const EXAMPLE_PORTFOLIO: PortfolioImage[] = [
  {
    id: "00000000-0000-4000-a000-000000000001",
    title: "Honey balayage",
    title_es: "Balayage miel",
    category: "Color",
    category_es: "Color",
    alt_text: "Honey blonde balayage with soft layers",
    alt_text_es: "Balayage rubio miel con capas suaves",
    storage_path: "examples/portfolio-01-balayage.jpg",
    public_url: "/examples/portfolio-01-balayage.jpg",
    display_order: 1,
    created_at: now,
    updated_at: now,
  },
  {
    id: "00000000-0000-4000-a000-000000000002",
    title: "Polished bob",
    title_es: "Bob pulido",
    category: "Cut",
    category_es: "Corte",
    alt_text: "Sleek brunette bob, precise and glossy",
    alt_text_es: "Corte bob castaño, liso y preciso",
    storage_path: "examples/portfolio-02-bob.jpg",
    public_url: "/examples/portfolio-02-bob.jpg",
    display_order: 2,
    created_at: now,
    updated_at: now,
  },
  {
    id: "00000000-0000-4000-a000-000000000003",
    title: "Dimensional copper",
    title_es: "Cobre dimensional",
    category: "Color",
    category_es: "Color",
    alt_text: "Copper color with caramel dimension",
    alt_text_es: "Color cobrizo con mechas carameladas",
    storage_path: "examples/portfolio-03-color.jpg",
    public_url: "/examples/portfolio-03-color.jpg",
    display_order: 3,
    created_at: now,
    updated_at: now,
  },
  {
    id: "00000000-0000-4000-a000-000000000004",
    title: "Bridal chignon",
    title_es: "Recogido de novia",
    category: "Bridal",
    category_es: "Novias",
    alt_text: "Low bridal chignon with soft tendrils",
    alt_text_es: "Recogido bajo de novia con tendrils suaves",
    storage_path: "examples/portfolio-04-novias.jpg",
    public_url: "/examples/portfolio-04-novias.jpg",
    display_order: 4,
    created_at: now,
    updated_at: now,
  },
  {
    id: "00000000-0000-4000-a000-000000000005",
    title: "Hollywood waves",
    title_es: "Ondas Hollywood",
    category: "Finish",
    category_es: "Acabado",
    alt_text: "Voluminous chestnut Hollywood waves",
    alt_text_es: "Ondas voluminosas en cabello castaño",
    storage_path: "examples/portfolio-05-ondas.jpg",
    public_url: "/examples/portfolio-05-ondas.jpg",
    display_order: 5,
    created_at: now,
    updated_at: now,
  },
  {
    id: "00000000-0000-4000-a000-000000000006",
    title: "Sculptural pixie",
    title_es: "Pixie escultural",
    category: "Cut",
    category_es: "Corte",
    alt_text: "Textured pixie with a precise silhouette",
    alt_text_es: "Corte pixie texturizado de perfil preciso",
    storage_path: "examples/portfolio-06-pixie.jpg",
    public_url: "/examples/portfolio-06-pixie.jpg",
    display_order: 6,
    created_at: now,
    updated_at: now,
  },
];

export const EXAMPLE_PACKAGES: ServicePackage[] = [
  {
    id: "00000000-0000-4000-a000-000000000101",
    name: "Signature cut",
    name_es: "Corte signature",
    description:
      "Consultation, precision cut, and finish. The silhouette as a starting point.",
    description_es:
      "Diagnóstico, corte de precisión y acabado. La silueta como punto de partida.",
    price: 95,
    duration_minutes: 60,
    is_available: true,
    display_order: 1,
    image_url: "/examples/portfolio-02-bob.jpg",
    created_at: now,
    updated_at: now,
  },
  {
    id: "00000000-0000-4000-a000-000000000102",
    name: "Dimensional color",
    name_es: "Color dimensional",
    description:
      "Balayage or highlights with a gloss seal. Depth without noise.",
    description_es:
      "Balayage o mechas con matiz y tratamiento de brillo. Resultado con profundidad.",
    price: 180,
    duration_minutes: 150,
    is_available: true,
    display_order: 2,
    image_url: "/examples/portfolio-03-color.jpg",
    created_at: now,
    updated_at: now,
  },
  {
    id: "00000000-0000-4000-a000-000000000103",
    name: "Bridal",
    name_es: "Novias",
    description:
      "Trial and event day. Updo or waves with a light, lasting hold.",
    description_es:
      "Prueba y día del evento. Recogido o waves con fijación ligera y duración.",
    price: 250,
    duration_minutes: 180,
    is_available: true,
    display_order: 3,
    image_url: "/examples/portfolio-04-novias.jpg",
    created_at: now,
    updated_at: now,
  },
  {
    id: "00000000-0000-4000-a000-000000000104",
    name: "Gloss treatment",
    name_es: "Tratamiento gloss",
    description:
      "Hydration and cuticle seal for a polished finish, without weight.",
    description_es:
      "Hidratación y sello de cutícula para un acabado pulido, sin peso.",
    price: 85,
    duration_minutes: 45,
    is_available: true,
    display_order: 4,
    image_url: "/examples/portfolio-05-ondas.jpg",
    created_at: now,
    updated_at: now,
  },
];

export function isExampleId(id: string) {
  return id.startsWith("00000000-0000-4000-a000-");
}

export function localized(
  locale: Locale,
  english: string,
  spanish?: string | null,
) {
  return locale === "es" && spanish ? spanish : english;
}
