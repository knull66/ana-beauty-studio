import { LoginView } from "@/components/auth/login-view";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata = {
  title: "Login",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const nextValue = params.next;
  const nextPath = Array.isArray(nextValue) ? nextValue[0] : nextValue;

  return (
    <LoginView
      nextPath={nextPath || ""}
      configured={isSupabaseConfigured()}
    />
  );
}
