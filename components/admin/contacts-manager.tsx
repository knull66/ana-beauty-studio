"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useLanguage } from "@/components/language-provider";
import {
  createContact,
  deleteContact,
  updateContact,
  updateStudioSettings,
} from "@/lib/actions/contacts";
import { CONTACT_KINDS, type ContactKind, type StudioContact, type StudioSettings } from "@/lib/types";

type FormState = {
  kind: ContactKind;
  label: string;
  value: string;
  display_order: string;
  is_visible: boolean;
  use_for_booking: boolean;
};

const emptyForm: FormState = {
  kind: "whatsapp",
  label: "",
  value: "",
  display_order: "0",
  is_visible: true,
  use_for_booking: true,
};

const VALUE_HINT: Record<ContactKind, string> = {
  email: "ana@studio.com",
  whatsapp: "+1 787 555 0000",
  instagram: "@anabeautystudio",
  phone: "+1 787 555 0000",
  address: "San Juan, PR",
  other: "https://",
};

export function ContactsManager({
  contacts,
  settings,
}: {
  contacts: StudioContact[];
  settings: StudioSettings;
}) {
  const router = useRouter();
  const { dictionary } = useLanguage();
  const copy = dictionary.adminContacts;
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editing, setEditing] = useState<StudioContact | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [settingsPending, setSettingsPending] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<StudioContact | null>(null);
  const [messages, setMessages] = useState({
    booking_message_en: settings.booking_message_en,
    booking_message_es: settings.booking_message_es,
  });

  function startCreate() {
    setEditing(null);
    setForm({
      ...emptyForm,
      use_for_booking: !contacts.some((item) => item.use_for_booking),
    });
    setError(null);
  }

  function startEdit(item: StudioContact) {
    setEditing(item);
    setForm({
      kind: item.kind,
      label: item.label,
      value: item.value,
      display_order: String(item.display_order),
      is_visible: item.is_visible,
      use_for_booking: item.use_for_booking,
    });
    setError(null);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    try {
      const payload = {
        kind: form.kind,
        label: form.label,
        value: form.value,
        display_order: Number(form.display_order) || 0,
        is_visible: form.is_visible,
        use_for_booking: form.kind === "whatsapp" && form.use_for_booking,
      };

      const result = editing
        ? await updateContact(editing.id, payload)
        : await createContact(payload);

      if (!result.ok) {
        throw new Error(result.error);
      }

      startCreate();
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : copy.saveError,
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
      const result = await deleteContact(deleteTarget.id);

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
        deleteError instanceof Error ? deleteError.message : copy.deleteError,
      );
    } finally {
      setPending(false);
    }
  }

  async function onSaveSettings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSettingsPending(true);
    setSettingsError(null);

    try {
      const result = await updateStudioSettings(messages);

      if (!result.ok) {
        throw new Error(result.error);
      }

      router.refresh();
    } catch (saveError) {
      setSettingsError(
        saveError instanceof Error ? saveError.message : copy.settingsError,
      );
    } finally {
      setSettingsPending(false);
    }
  }

  return (
    <div className="space-y-16">
      <form onSubmit={onSaveSettings} className="space-y-5 border-b border-line pb-12">
        <h2 className="font-serif text-2xl">{copy.bookingTitle}</h2>
        <p className="text-sm leading-6 text-muted">{copy.bookingHelp}</p>
        <label className="block">
          <span className="text-[11px] uppercase tracking-[0.28em] text-muted">
            {copy.messageEn}
          </span>
          <textarea
            rows={3}
            value={messages.booking_message_en}
            onChange={(event) =>
              setMessages((current) => ({
                ...current,
                booking_message_en: event.target.value,
              }))
            }
            className="mt-2 w-full resize-y border-b border-line bg-transparent py-2 text-sm outline-none focus:border-gold"
          />
        </label>
        <label className="block">
          <span className="text-[11px] uppercase tracking-[0.28em] text-muted">
            {copy.messageEs}
          </span>
          <textarea
            rows={3}
            value={messages.booking_message_es}
            onChange={(event) =>
              setMessages((current) => ({
                ...current,
                booking_message_es: event.target.value,
              }))
            }
            className="mt-2 w-full resize-y border-b border-line bg-transparent py-2 text-sm outline-none focus:border-gold"
          />
        </label>
        {settingsError ? (
          <p role="alert" className="text-sm text-gold-soft">
            {settingsError}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={settingsPending}
          className="border border-gold/40 px-5 py-2 text-[11px] uppercase tracking-[0.28em] text-gold-soft hover:border-gold disabled:opacity-40"
        >
          {settingsPending ? copy.saving : copy.saveMessage}
        </button>
      </form>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,320px)_1fr]">
        <form onSubmit={onSubmit} className="space-y-5">
          <h2 className="font-serif text-2xl">
            {editing ? copy.editContact : copy.newContact}
          </h2>
          <label className="block">
            <span className="text-[11px] uppercase tracking-[0.28em] text-muted">
              {copy.kind}
            </span>
            <select
              value={form.kind}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  kind: event.target.value as ContactKind,
                  use_for_booking:
                    event.target.value === "whatsapp"
                      ? current.use_for_booking
                      : false,
                }))
              }
              className="mt-2 w-full border-b border-line bg-transparent py-2 text-sm outline-none focus:border-gold"
            >
              {CONTACT_KINDS.map((kind) => (
                <option key={kind} value={kind} className="bg-background">
                  {copy.kinds[kind]}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-[11px] uppercase tracking-[0.28em] text-muted">
              {copy.label}
            </span>
            <input
              value={form.label}
              onChange={(event) =>
                setForm((current) => ({ ...current, label: event.target.value }))
              }
              placeholder={copy.labelHint}
              className="mt-2 w-full border-b border-line bg-transparent py-2 text-sm outline-none focus:border-gold"
            />
          </label>
          <label className="block">
            <span className="text-[11px] uppercase tracking-[0.28em] text-muted">
              {copy.value}
            </span>
            <input
              required
              value={form.value}
              onChange={(event) =>
                setForm((current) => ({ ...current, value: event.target.value }))
              }
              placeholder={VALUE_HINT[form.kind]}
              className="mt-2 w-full border-b border-line bg-transparent py-2 text-sm outline-none focus:border-gold"
            />
          </label>
          <label className="block">
            <span className="text-[11px] uppercase tracking-[0.28em] text-muted">
              {copy.order}
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
              checked={form.is_visible}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  is_visible: event.target.checked,
                }))
              }
              className="accent-gold"
            />
            {copy.visible}
          </label>
          {form.kind === "whatsapp" ? (
            <label className="flex items-center gap-3 text-sm text-muted">
              <input
                type="checkbox"
                checked={form.use_for_booking}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    use_for_booking: event.target.checked,
                  }))
                }
                className="accent-gold"
              />
              {copy.useForBooking}
            </label>
          ) : null}
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
              {pending ? copy.saving : editing ? copy.update : copy.create}
            </button>
            {editing ? (
              <button
                type="button"
                onClick={startCreate}
                disabled={pending}
                className="text-[11px] uppercase tracking-[0.28em] text-muted hover:text-gold-soft"
              >
                {copy.cancel}
              </button>
            ) : null}
          </div>
        </form>

        <div className="space-y-4">
          {contacts.length === 0 ? (
            <p className="border border-line px-4 py-10 text-center text-sm text-muted">
              {copy.empty}
            </p>
          ) : (
            contacts.map((item) => (
              <article key={item.id} className="border border-line p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-gold">
                      {copy.kinds[item.kind]}
                    </p>
                    <h3 className="mt-2 font-serif text-2xl">
                      {item.label || copy.kinds[item.kind]}
                    </h3>
                    <p className="mt-1 text-sm text-muted">{item.value}</p>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-muted">
                      {item.is_visible ? copy.visible : copy.hidden} · {copy.order}{" "}
                      {item.display_order}
                      {item.use_for_booking ? ` · ${copy.bookingBadge}` : ""}
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex gap-5 text-[11px] uppercase tracking-[0.22em]">
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="text-gold-soft hover:text-gold"
                  >
                    {copy.edit}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(item)}
                    className="text-muted hover:text-gold-soft"
                  >
                    {copy.remove}
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={copy.deleteTitle}
        description={copy.deleteBody}
        pending={pending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
