import { RegisterView } from "@/components/auth/register-view";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return <RegisterView configured={isSupabaseConfigured()} />;
}
