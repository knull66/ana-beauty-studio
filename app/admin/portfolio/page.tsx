import { AdminHint } from "@/components/admin/admin-hint";
import { PortfolioManager } from "@/components/admin/portfolio-manager";
import { ErrorBanner } from "@/components/feedback";
import { isExampleId } from "@/lib/examples";
import { getPortfolioImages } from "@/lib/queries/portfolio";

export const metadata = {
  title: "Portfolio",
};

export default async function AdminPortfolioPage() {
  const { data, error } = await getPortfolioImages();
  const usingExamples = data.some((item) => isExampleId(item.id));

  return (
    <section>
      <p className="text-[11px] uppercase tracking-[0.42em] text-gold">
        Content
      </p>
      <h1 className="mt-3 font-serif text-4xl">Portfolio</h1>
      {error ? (
        <div className="mt-8">
          <ErrorBanner message={error} />
        </div>
      ) : null}
      {usingExamples ? <AdminHint kind="portfolio" /> : null}
      <div className="mt-10">
        <PortfolioManager images={data} />
      </div>
    </section>
  );
}
