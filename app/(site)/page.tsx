import { Gallery } from "@/components/public/gallery";
import { Hero } from "@/components/public/hero";
import { PackagesSection } from "@/components/public/packages-section";
import { getPublicPackages } from "@/lib/queries/packages";
import { getPortfolioImages } from "@/lib/queries/portfolio";

export const revalidate = 60;

export default async function HomePage() {
  const [portfolio, packages] = await Promise.all([
    getPortfolioImages(),
    getPublicPackages(),
  ]);

  return (
    <>
      <Hero featured={portfolio.data[0]} />
      <Gallery images={portfolio.data} error={null} />
      <PackagesSection packages={packages.data} error={null} />
    </>
  );
}
