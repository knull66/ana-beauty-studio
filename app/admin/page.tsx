import Link from "next/link";
import { AdminHint } from "@/components/admin/admin-hint";
import { ErrorBanner } from "@/components/feedback";
import { isExampleId } from "@/lib/examples";
import { getServicePackages } from "@/lib/queries/packages";
import { getPortfolioImages } from "@/lib/queries/portfolio";

export const metadata = {
  title: "Studio",
};

export default async function AdminHomePage() {
  const [portfolio, packages] = await Promise.all([
    getPortfolioImages(),
    getServicePackages(),
  ]);

  const queryError = portfolio.error || packages.error;
  const usingExamples =
    portfolio.data.some((item) => isExampleId(item.id)) ||
    packages.data.some((item) => isExampleId(item.id));
  const visiblePackages = packages.data.filter((item) => item.is_available)
    .length;

  return (
    <section>
      <p className="text-[11px] uppercase tracking-[0.42em] text-gold">Studio</p>
      <h1 className="mt-3 font-serif text-4xl">Overview</h1>
      {queryError ? (
        <div className="mt-8">
          <ErrorBanner message={queryError} />
        </div>
      ) : null}
      {usingExamples ? <AdminHint kind="home" /> : null}
      <dl className="mt-12 grid gap-px bg-line sm:grid-cols-3">
        <div className="bg-background px-6 py-8">
          <dt className="text-[11px] uppercase tracking-[0.28em] text-muted">
            Images
          </dt>
          <dd className="mt-3 font-serif text-4xl text-gold-soft">
            {portfolio.data.length}
          </dd>
        </div>
        <div className="bg-background px-6 py-8">
          <dt className="text-[11px] uppercase tracking-[0.28em] text-muted">
            Collections
          </dt>
          <dd className="mt-3 font-serif text-4xl text-gold-soft">
            {packages.data.length}
          </dd>
        </div>
        <div className="bg-background px-6 py-8">
          <dt className="text-[11px] uppercase tracking-[0.28em] text-muted">
            Visible
          </dt>
          <dd className="mt-3 font-serif text-4xl text-gold-soft">
            {visiblePackages}
          </dd>
        </div>
      </dl>
      <div className="mt-12 flex flex-wrap gap-8 text-[11px] uppercase tracking-[0.28em]">
        <Link href="/admin/portfolio" className="text-gold-soft hover:text-gold">
          Manage portfolio
        </Link>
        <Link href="/admin/packages" className="text-gold-soft hover:text-gold">
          Manage collections
        </Link>
        <Link href="/admin/contacts" className="text-gold-soft hover:text-gold">
          Manage contact
        </Link>
      </div>
    </section>
  );
}
