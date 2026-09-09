import { redirect } from "next/navigation";
import { isAdminUser } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { toErrorMessage } from "@/lib/format";

export { isAdminEmail, isAdminUser, homeForUser, getAdminEmails } from "@/lib/admin";

export async function getUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireUser();

  if (!isAdminUser(user)) {
    redirect("/account");
  }

  return user;
}

export async function requireAdminForAction() {
  const user = await getUser();

  if (!user) {
    throw new Error("You need to sign in to continue.");
  }

  if (!isAdminUser(user)) {
    throw new Error("Only studio administrators can change this content.");
  }

  return user;
}

export function mapAuthError(error: unknown, kind: "login" | "register" = "login") {
  const message = toErrorMessage(error, "").toLowerCase();

  if (message.includes("invalid login")) {
    return "invalid";
  }

  if (message.includes("email not confirmed")) {
    return "unconfirmed";
  }

  if (message.includes("too many")) {
    return "tooMany";
  }

  if (
    message.includes("already registered") ||
    message.includes("already been registered")
  ) {
    return "alreadyRegistered";
  }

  return kind === "register" ? "registerGeneric" : "generic";
}
