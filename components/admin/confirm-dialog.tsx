"use client";

import { useEffect, useId, useRef } from "react";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  pending?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Eliminar",
  pending = false,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    dialogRef.current?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape" && !pending) {
        onCancel();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, pending, onCancel]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="w-full max-w-sm border border-line bg-background p-8"
      >
        <h2 id={titleId} className="font-serif text-2xl">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
        <div className="mt-8 flex justify-end gap-6 text-[11px] uppercase tracking-[0.28em]">
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            className="text-muted hover:text-gold-soft disabled:opacity-40"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className="text-gold-soft hover:text-gold disabled:opacity-40"
          >
            {pending ? "Eliminando…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
