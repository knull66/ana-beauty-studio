import type { ReactNode } from "react";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { SplashScreen } from "@/components/splash-screen";
import { getUser, isAdminUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const user = await getUser();

  return (
    <SplashScreen>
      <SiteHeader signedIn={Boolean(user)} isAdmin={isAdminUser(user)} />
      <main>{children}</main>
      <SiteFooter />
    </SplashScreen>
  );
}
