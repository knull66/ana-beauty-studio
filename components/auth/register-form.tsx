"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useLanguage } from "@/components/language-provider";
import { signUp, type AuthState } from "@/lib/actions/auth";
import type { Dictionary } from "@/lib/i18n";

const initialState: AuthState = { error: null, message: null };

function authCopy(dictionary: Dictionary, key: string | null) {
  if (!key) return null;
  const value = dictionary.auth[key as keyof Dictionary["auth"]];
  return typeof value === "string" ? value : key;
}

export function RegisterForm({ configured }: { configured: boolean }) {
  const { dictionary } = useLanguage();
  const [state, formAction, pending] = useActionState(signUp, initialState);
  const error = authCopy(dictionary, state.error);
  const message = authCopy(dictionary, state.message);

  return (
    <form action={formAction} className="mt-10 space-y-6">
      <label className="block">
        <span className="text-[11px] uppercase tracking-[0.28em] text-muted">
          {dictionary.auth.name}
        </span>
        <input
          name="name"
          type="text"
          autoComplete="name"
          required
          className="mt-2 w-full border-b border-line bg-transparent py-3 text-sm outline-none transition-colors focus:border-gold"
        />
      </label>
      <label className="block">
        <span className="text-[11px] uppercase tracking-[0.28em] text-muted">
          {dictionary.auth.email}
        </span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-2 w-full border-b border-line bg-transparent py-3 text-sm outline-none transition-colors focus:border-gold"
        />
      </label>
      <label className="block">
        <span className="text-[11px] uppercase tracking-[0.28em] text-muted">
          {dictionary.auth.password}
        </span>
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          className="mt-2 w-full border-b border-line bg-transparent py-3 text-sm outline-none transition-colors focus:border-gold"
        />
      </label>
      <label className="block">
        <span className="text-[11px] uppercase tracking-[0.28em] text-muted">
          {dictionary.auth.confirm}
        </span>
        <input
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          className="mt-2 w-full border-b border-line bg-transparent py-3 text-sm outline-none transition-colors focus:border-gold"
        />
      </label>
      {error ? (
        <p role="alert" className="text-sm text-gold-soft">
          {error}
        </p>
      ) : null}
      {message ? (
        <p role="status" className="text-sm text-gold-soft">
          {message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending || !configured}
        className="w-full border border-gold/40 py-3 text-[11px] uppercase tracking-[0.32em] text-gold-soft transition-colors hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-40"
      >
        {pending
          ? dictionary.auth.submittingRegister
          : dictionary.auth.submitRegister}
      </button>
      <p className="text-center text-[11px] uppercase tracking-[0.22em] text-muted">
        {dictionary.auth.hasAccount}{" "}
        <Link href="/login" className="text-gold-soft hover:text-gold">
          {dictionary.nav.login}
        </Link>
      </p>
    </form>
  );
}
