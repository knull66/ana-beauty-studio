import { ContactsManager } from "@/components/admin/contacts-manager";
import { ErrorBanner } from "@/components/feedback";
import { isMissingRelation } from "@/lib/contacts";
import { getStudioProfile } from "@/lib/queries/contacts";

export const metadata = {
  title: "Contact",
};

export default async function AdminContactsPage() {
  const { contacts, settings, error } = await getStudioProfile();
  const needsSql = isMissingRelation(error);

  return (
    <section>
      <p className="text-[11px] uppercase tracking-[0.42em] text-gold">
        Studio
      </p>
      <h1 className="mt-3 font-serif text-4xl">Contact</h1>
      {error ? (
        <div className="mt-8">
          <ErrorBanner
            message={
              needsSql
                ? "Run supabase/studio-contacts.sql in the Supabase SQL Editor, then refresh."
                : error
            }
          />
        </div>
      ) : null}
      <div className="mt-10">
        <ContactsManager contacts={contacts} settings={settings} />
      </div>
    </section>
  );
}
