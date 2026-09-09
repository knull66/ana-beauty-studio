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

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string };

export type QueryResult<T> = {
  data: T;
  error: string | null;
};
