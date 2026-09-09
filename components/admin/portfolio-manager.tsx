"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  PORTFOLIO_BUCKET,
  PORTFOLIO_CATEGORIES,
} from "@/lib/constants";
import { isExampleId } from "@/lib/examples";
import {
  createPortfolioImage,
  deletePortfolioImage,
  updatePortfolioImage,
} from "@/lib/actions/portfolio";
import { createClient } from "@/lib/supabase/client";
import type { PortfolioImage } from "@/lib/types";

type FormState = {
  title: string;
  category: string;
  alt_text: string;
  display_order: string;
  file: File | null;
};

const emptyForm: FormState = {
  title: "",
  category: PORTFOLIO_CATEGORIES[0],
  alt_text: "",
  display_order: "0",
  file: null,
};

function fileExtension(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]+$/.test(fromName)) {
    return fromName;
  }

  return file.type.split("/")[1] || "jpg";
}

function isAcceptedImageType(type: string) {
  return (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(type);
}

async function uploadImage(file: File) {
  if (!isAcceptedImageType(file.type)) {
    throw new Error("Usa JPG, PNG, WebP o AVIF.");
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("La imagen no puede superar 8 MB.");
  }

  const supabase = createClient();
  const path = `${crypto.randomUUID()}.${fileExtension(file)}`;
  const { error } = await supabase.storage.from(PORTFOLIO_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });

  if (error) {
    throw new Error(error.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(PORTFOLIO_BUCKET).getPublicUrl(path);

  return { path, publicUrl };
}

async function removeStorageObject(path: string) {
  try {
    const supabase = createClient();
    await supabase.storage.from(PORTFOLIO_BUCKET).remove([path]);
  } catch {
    // Limpieza best-effort si falla el insert posterior.
  }
}

export function PortfolioManager({ images }: { images: PortfolioImage[] }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editing, setEditing] = useState<PortfolioImage | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PortfolioImage | null>(null);
  const fileInputKey = editing?.id ?? "new";

  function startCreate() {
    setEditing(null);
    setForm(emptyForm);
    setError(null);
  }

  function startEdit(image: PortfolioImage) {
    setEditing(image);
    setForm({
      title: image.title,
      category: image.category,
      alt_text: image.alt_text,
      display_order: String(image.display_order),
      file: null,
    });
    setError(null);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    let uploadedPath: string | null = null;

    try {
      let storage_path = editing?.storage_path ?? "";
      let public_url = editing?.public_url ?? "";

      if (form.file) {
        const uploaded = await uploadImage(form.file);
        uploadedPath = uploaded.path;
        storage_path = uploaded.path;
        public_url = uploaded.publicUrl;
      }

      if (!storage_path || !public_url) {
        throw new Error("Selecciona una imagen.");
      }

      const payload = {
        title: form.title,
        category: form.category,
        alt_text: form.alt_text,
        storage_path,
        public_url,
        display_order: Number(form.display_order) || 0,
      };

      const result = editing
        ? await updatePortfolioImage(editing.id, payload)
        : await createPortfolioImage(payload);

      if (!result.ok) {
        if (uploadedPath) {
          await removeStorageObject(uploadedPath);
        }
        throw new Error(result.error);
      }

      if (editing && form.file && editing.storage_path !== storage_path) {
        await removeStorageObject(editing.storage_path);
      }

      startCreate();
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No se pudo guardar la imagen.",
      );
    } finally {
      setPending(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    setPending(true);
    setError(null);

    try {
      const result = await deletePortfolioImage(
        deleteTarget.id,
        deleteTarget.storage_path,
      );

      if (!result.ok) {
        throw new Error(result.error);
      }

      if (editing?.id === deleteTarget.id) {
        startCreate();
      }

      setDeleteTarget(null);
      router.refresh();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "No se pudo eliminar la imagen.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,320px)_1fr]">
      <form onSubmit={onSubmit} className="space-y-5">
        <h2 className="font-serif text-2xl">
          {editing ? "Editar imagen" : "Nueva imagen"}
        </h2>
        <label className="block">
          <span className="text-[11px] uppercase tracking-[0.28em] text-muted">
            Título
          </span>
          <input
            value={form.title}
            onChange={(event) =>
              setForm((current) => ({ ...current, title: event.target.value }))
            }
            className="mt-2 w-full border-b border-line bg-transparent py-2 text-sm outline-none focus:border-gold"
          />
        </label>
        <label className="block">
          <span className="text-[11px] uppercase tracking-[0.28em] text-muted">
            Categoría
          </span>
          <select
            value={form.category}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                category: event.target.value,
              }))
            }
            className="mt-2 w-full border-b border-line bg-background py-2 text-sm outline-none focus:border-gold"
          >
            {PORTFOLIO_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
            {form.category &&
            !PORTFOLIO_CATEGORIES.includes(
              form.category as (typeof PORTFOLIO_CATEGORIES)[number],
            ) ? (
              <option value={form.category}>{form.category}</option>
            ) : null}
          </select>
        </label>
        <label className="block">
          <span className="text-[11px] uppercase tracking-[0.28em] text-muted">
            Texto alternativo
          </span>
          <input
            value={form.alt_text}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                alt_text: event.target.value,
              }))
            }
            className="mt-2 w-full border-b border-line bg-transparent py-2 text-sm outline-none focus:border-gold"
          />
        </label>
        <label className="block">
          <span className="text-[11px] uppercase tracking-[0.28em] text-muted">
            Orden
          </span>
          <input
            type="number"
            min="0"
            value={form.display_order}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                display_order: event.target.value,
              }))
            }
            className="mt-2 w-full border-b border-line bg-transparent py-2 text-sm outline-none focus:border-gold"
          />
        </label>
        <label className="block">
          <span className="text-[11px] uppercase tracking-[0.28em] text-muted">
            Archivo {editing ? "(opcional)" : ""}
          </span>
          <input
            key={fileInputKey}
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                file: event.target.files?.[0] ?? null,
              }))
            }
            className="mt-3 w-full text-sm text-muted file:mr-4 file:border file:border-line file:bg-transparent file:px-3 file:py-1 file:text-[11px] file:uppercase file:tracking-[0.2em] file:text-gold-soft"
          />
        </label>
        {error ? (
          <p role="alert" className="text-sm text-gold-soft">
            {error}
          </p>
        ) : null}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={pending}
            className="border border-gold/40 px-5 py-2 text-[11px] uppercase tracking-[0.28em] text-gold-soft hover:border-gold disabled:opacity-40"
          >
            {pending ? "Guardando…" : editing ? "Actualizar" : "Publicar"}
          </button>
          {editing ? (
            <button
              type="button"
              onClick={startCreate}
              disabled={pending}
              className="text-[11px] uppercase tracking-[0.28em] text-muted hover:text-gold-soft"
            >
              Cancelar
            </button>
          ) : null}
        </div>
      </form>

      <div className="space-y-4">
        {images.length === 0 ? (
          <p className="border border-line px-4 py-10 text-center text-sm text-muted">
            Aún no hay imágenes en el portafolio.
          </p>
        ) : (
          images.map((image) => (
            <article
              key={image.id}
              className="grid grid-cols-[88px_1fr] gap-4 border border-line p-3"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-surface">
                <Image
                  src={image.public_url}
                  alt={image.alt_text || image.title || ""}
                  fill
                  sizes="88px"
                  className="object-cover"
                />
              </div>
              <div className="flex min-w-0 flex-col justify-between">
                <div>
                  <p className="truncate font-serif text-xl">
                    {image.title || "Sin título"}
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-muted">
                    {image.category} · orden {image.display_order}
                  </p>
                </div>
                <div className="flex gap-5 text-[11px] uppercase tracking-[0.22em]">
                  {isExampleId(image.id) ? (
                    <span className="text-muted">Ejemplo</span>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => startEdit(image)}
                        className="text-gold-soft hover:text-gold"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(image)}
                        className="text-muted hover:text-gold-soft"
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Eliminar imagen"
        description="Se quitará del portafolio y del storage. Esta acción no se puede deshacer."
        pending={pending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
