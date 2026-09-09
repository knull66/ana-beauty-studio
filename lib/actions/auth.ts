"use server";

import { redirect } from "next/navigation";
import { homeForUser, isAdminUser, mapAuthError } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

export type AuthState = {
  error: string | null;
  message: string | null;
};

function safeNextPath(path: string, admin: boolean) {
  if (admin) {
    return path.startsWith("/admin") ? path : "/admin";
  }

  if (path.startsWith("/account")) {
    return path;
  }

  return "/account";
}

export async function signIn(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  if (!isSupabaseConfigured()) {
    return { error: "configured", message: null };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "");

  if (!email || !password) {
    return { error: "missing", message: null };
  }

  let user: User | null = null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return { error: mapAuthError(error ?? new Error("login")), message: null };
    }

    user = data.user;
  } catch (error) {
    return { error: mapAuthError(error), message: null };
  }

  redirect(safeNextPath(nextPath, isAdminUser(user)));
}

export async function signUp(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  if (!isSupabaseConfigured()) {
    return { error: "configured", message: null };
  }

  const fullName = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!fullName || !email || !password || !confirm) {
    return { error: "missing", message: null };
  }

  if (password !== confirm) {
    return { error: "mismatch", message: null };
  }

  let user: User | null = null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: "client",
        },
      },
    });

    if (error) {
      return { error: mapAuthError(error, "register"), message: null };
    }

    if (!data.session || !data.user) {
      return { error: null, message: "confirmEmail" };
    }

    user = data.user;
  } catch (error) {
    return { error: mapAuthError(error, "register"), message: null };
  }

  redirect(homeForUser(user));
}

export async function signOut() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // Continue to the public site even if sign-out fails.
  }

  redirect("/");
}
