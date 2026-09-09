import type { User } from "@supabase/supabase-js";

export function getAdminEmails() {
  const raw =
    process.env.ADMIN_EMAIL ??
    process.env.NEXT_PUBLIC_ADMIN_EMAIL ??
    "annaglopez79@gmail.com";

  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email?: string | null) {
  if (!email) {
    return false;
  }

  return getAdminEmails().includes(email.toLowerCase());
}

export function isAdminUser(user: User | null | undefined) {
  return Boolean(user && isAdminEmail(user.email));
}

export function homeForUser(user: User | null | undefined) {
  return isAdminUser(user) ? "/admin" : "/account";
}
