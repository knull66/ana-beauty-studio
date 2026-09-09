import { AccountView } from "@/components/auth/account-view";
import { isAdminUser, requireUser } from "@/lib/auth";

export const metadata = {
  title: "Account",
};

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await requireUser();

  return (
    <AccountView
      email={user.email ?? ""}
      isAdmin={isAdminUser(user)}
    />
  );
}
