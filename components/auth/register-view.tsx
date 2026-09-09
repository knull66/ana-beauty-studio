"use client";

import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";
import { useLanguage } from "@/components/language-provider";

export function RegisterView({ configured }: { configured: boolean }) {
  const { dictionary } = useLanguage();

  return (
    <AuthShell
      kicker={dictionary.auth.registerKicker}
      notice={configured ? null : dictionary.auth.configured}
    >
      <RegisterForm configured={configured} />
    </AuthShell>
  );
}
