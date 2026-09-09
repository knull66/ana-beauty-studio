"use client";

import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { useLanguage } from "@/components/language-provider";

export function LoginView({
  nextPath,
  configured,
}: {
  nextPath: string;
  configured: boolean;
}) {
  const { dictionary } = useLanguage();

  return (
    <AuthShell
      kicker={dictionary.auth.loginKicker}
      notice={configured ? null : dictionary.auth.configured}
    >
      <LoginForm nextPath={nextPath} configured={configured} />
    </AuthShell>
  );
}
