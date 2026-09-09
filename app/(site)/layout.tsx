import type { ReactNode } from "react";
import { BookingProvider } from "@/components/public/booking-provider";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { SplashScreen } from "@/components/splash-screen";
import { getUser, isAdminUser } from "@/lib/auth";
import { getStudioProfile } from "@/lib/queries/contacts";
import { getPublicPackages } from "@/lib/queries/packages";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [user, profile, packages] = await Promise.all([
    getUser(),
    getStudioProfile(),
    getPublicPackages(),
  ]);

  return (
    <SplashScreen>
      <BookingProvider
        packages={packages.data}
        contacts={profile.contacts}
        settings={profile.settings}
      >
        <SiteHeader
          signedIn={Boolean(user)}
          isAdmin={isAdminUser(user)}
          contacts={profile.contacts}
        />
        <main>{children}</main>
        <SiteFooter contacts={profile.contacts} />
      </BookingProvider>
    </SplashScreen>
  );
}
