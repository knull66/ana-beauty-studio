import { ContactSection } from "@/components/public/contact-section";
import { Gallery } from "@/components/public/gallery";
import { Hero } from "@/components/public/hero";
import { PackagesSection } from "@/components/public/packages-section";
import { getStudioProfile } from "@/lib/queries/contacts";
import { getPublicPackages } from "@/lib/queries/packages";
import { getPortfolioImages } from "@/lib/queries/portfolio";

export const revalidate = 60;

export default async function HomePage() {
  const [portfolio, packages, profile] = await Promise.all([
    getPortfolioImages(),
    getPublicPackages(),
    getStudioProfile(),
  ]);

  return (
    <>
      <Hero images={portfolio.data} />
      <Gallery images={portfolio.data} error={null} />
      <PackagesSection packages={packages.data} error={null} />
      <ContactSection contacts={profile.contacts} />
    </>
  );
}
