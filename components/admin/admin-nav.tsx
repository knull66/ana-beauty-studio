"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/components/language-provider";
import { signOut } from "@/lib/actions/auth";
import { Wordmark } from "@/components/wordmark";

export function AdminNav() {
  const pathname = usePathname();
  const { dictionary } = useLanguage();
  const links = [
    { href: "/admin", label: dictionary.admin.overview },
    { href: "/admin/portfolio", label: dictionary.admin.portfolio },
    { href: "/admin/packages", label: dictionary.admin.packages },
  ];

  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-6 md:flex-row md:items-center md:justify-between">
        <Link href="/admin" aria-label="Ana Beauty Studio">
          <Wordmark compact />
        </Link>
        <nav className="flex flex-wrap items-center gap-6 text-[11px] uppercase tracking-[0.28em]">
          {links.map((link) => {
            const active =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  active ? "text-gold-soft" : "text-muted hover:text-gold-soft"
                }
              >
                {link.label}
              </Link>
            );
          })}
          <Link href="/" className="text-muted hover:text-gold-soft">
            {dictionary.admin.site}
          </Link>
          <LanguageToggle />
          <form action={signOut}>
            <button
              type="submit"
              className="text-muted transition-colors hover:text-gold-soft"
            >
              {dictionary.admin.signOut}
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
