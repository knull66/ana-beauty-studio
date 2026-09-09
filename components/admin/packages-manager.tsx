"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import {
  createPackage,
  deletePackage,
  updatePackage,
} from "@/lib/actions/packages";
import { isExampleId } from "@/lib/examples";
import { formatDuration, formatPrice } from "@/lib/format";
import type { ServicePackage } from "@/lib/types";

type FormState = {
  name: string;
  description: string;
  price: string;
  duration_minutes: string;
  is_available: boolean;
  display_order: string;
};

const emptyForm: FormState = {
  name: "",
  description: "",
  price: "",
  duration_minutes: "",
  is_available: true,
  display_order: "0",
};

export function PackagesManager({
  packages,
}: {
  packages: ServicePackage[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editing, setEditing] = useState<ServicePackage | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ServicePackage | null>(null);

  function startCreate() {
    setEditing(null);
    setForm(emptyForm);
    setError(null);
  }

  function startEdit(item: ServicePackage) {
    setEditing(item);
    setForm({
      name: item.name,
      description: item.description,
      price: String(item.price),
      duration_minutes: item.duration_minutes ? String(item.duration_minutes) : "",
      is_available: item.is_available,
      display_order: String(item.display_order),
    });
    setError(null);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        duration_minutes: form.duration_minutes
          ? Number(form.duration_minutes)
          : null,
        is_available: form.is_available,
        display_order: Number(form.display_order) || 0,
      };

      const result = editing
        ? await updatePackage(editing.id, payload)
        : await createPackage(payload);

      if (!result.ok) {
        throw new Error(result.error);
      }

      startCreate();
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No se pudo guardar el paquete.",
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
      const result = await deletePackage(deleteTarget.id);

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
          : "No se pudo eliminar el paquete.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,320px)_1fr]">
      <form onSubmit={onSubmit} className="space-y-5">
        <h2 className="font-serif text-2xl">
          {editing ? "Editar paquete" : "Nuevo paquete"}
        </h2>
        <label className="block">
          <span className="text-[11px] uppercase tracking-[0.28em] text-muted">
            Nombre
          </span>
          <input
            required
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
            className="mt-2 w-full border-b border-line bg-transparent py-2 text-sm outline-none focus:border-gold"
          />
        </label>
        <label className="block">
          <span className="text-[11px] uppercase tracking-[0.28em] text-muted">
            Descripción
          </span>
          <textarea
            rows={4}
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            className="mt-2 w-full resize-y border-b border-line bg-transparent py-2 text-sm outline-none focus:border-gold"
          />
        </label>
        <label className="block">
          <span className="text-[11px] uppercase tracking-[0.28em] text-muted">
            Precio (USD)
          </span>
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(event) =>
              setForm((current) => ({ ...current, price: event.target.value }))
            }
            className="mt-2 w-full border-b border-line bg-transparent py-2 text-sm outline-none focus:border-gold"
          />
        </label>
        <label className="block">
          <span className="text-[11px] uppercase tracking-[0.28em] text-muted">
            Duración (minutos)
          </span>
          <input
            type="number"
            min="1"
            value={form.duration_minutes}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                duration_minutes: event.target.value,
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
        <label className="flex items-center gap-3 text-sm text-muted">
          <input
            type="checkbox"
            checked={form.is_available}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                is_available: event.target.checked,
              }))
            }
            className="accent-gold"
          />
          Visible en el sitio
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
            {pending ? "Guardando…" : editing ? "Actualizar" : "Crear"}
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
        {packages.length === 0 ? (
          <p className="border border-line px-4 py-10 text-center text-sm text-muted">
            Aún no hay paquetes.
          </p>
        ) : (
          packages.map((item) => (
            <article
              key={item.id}
              className="grid gap-4 border border-line p-5 md:grid-cols-[88px_1fr]"
            >
              {item.image_url ? (
                <div className="relative aspect-[4/5] overflow-hidden bg-surface">
                  <Image
                    src={item.image_url}
                    alt=""
                    fill
                    sizes="88px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="hidden md:block" />
              )}
              <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-serif text-2xl">{item.name}</h3>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-muted">
                    {item.is_available ? "Visible" : "Oculto"} · orden{" "}
                    {item.display_order}
                    {formatDuration(item.duration_minutes)
                      ? ` · ${formatDuration(item.duration_minutes)}`
                      : ""}
                  </p>
                </div>
                <p className="font-serif text-xl text-gold-soft">
                  {formatPrice(item.price)}
                </p>
              </div>
              {item.description ? (
                <p className="mt-3 text-sm leading-6 text-muted">
                  {item.description}
                </p>
              ) : null}
              <div className="mt-5 flex gap-5 text-[11px] uppercase tracking-[0.22em]">
                {isExampleId(item.id) ? (
                  <span className="text-muted">Ejemplo</span>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="text-gold-soft hover:text-gold"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(item)}
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
        title="Eliminar paquete"
        description="El servicio dejará de aparecer en el sitio. Esta acción no se puede deshacer."
        pending={pending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
