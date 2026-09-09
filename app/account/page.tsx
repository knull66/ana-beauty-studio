import { AccountView } from "@/components/auth/account-view";
import { BookingProvider } from "@/components/public/booking-provider";
import { isAdminUser, requireUser } from "@/lib/auth";
import { getStudioProfile } from "@/lib/queries/contacts";
import { getPublicPackages } from "@/lib/queries/packages";

export const metadata = {
  title: "Account",
};

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const [user, packages, profile] = await Promise.all([
    requireUser(),
    getPublicPackages(),
    getStudioProfile(),
  ]);

  return (
    <BookingProvider
      packages={packages.data}
      contacts={profile.contacts}
      settings={profile.settings}
    >
      <AccountView
        email={user.email ?? ""}
        isAdmin={isAdminUser(user)}
        packages={packages.data}
      />
    </BookingProvider>
  );
}
