import type { ReactNode } from "react";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { SplashScreen } from "@/components/splash-screen";
import { getUser, isAdminUser } from "@/lib/auth";
import { getStudioProfile } from "@/lib/queries/contacts";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [user, profile] = await Promise.all([getUser(), getStudioProfile()]);

  return (
    <SplashScreen>
      <SiteHeader
        signedIn={Boolean(user)}
        isAdmin={isAdminUser(user)}
        contacts={profile.contacts}
        settings={profile.settings}
      />
      <main>{children}</main>
      <SiteFooter contacts={profile.contacts} settings={profile.settings} />
    </SplashScreen>
  );
}
