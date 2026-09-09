import { AdminHint } from "@/components/admin/admin-hint";
import { PackagesManager } from "@/components/admin/packages-manager";
import { ErrorBanner } from "@/components/feedback";
import { isExampleId } from "@/lib/examples";
import { getServicePackages } from "@/lib/queries/packages";

export const metadata = {
  title: "Collections",
};

export default async function AdminPackagesPage() {
  const { data, error } = await getServicePackages();
  const usingExamples = data.some((item) => isExampleId(item.id));

  return (
    <section>
      <p className="text-[11px] uppercase tracking-[0.42em] text-gold">
        Content
      </p>
      <h1 className="mt-3 font-serif text-4xl">Collections</h1>
      {error ? (
        <div className="mt-8">
          <ErrorBanner message={error} />
        </div>
      ) : null}
      {usingExamples ? <AdminHint kind="packages" /> : null}
      <div className="mt-10">
        <PackagesManager packages={data} />
      </div>
    </section>
  );
}
