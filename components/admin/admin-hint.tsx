"use client";

import { useLanguage } from "@/components/language-provider";

export function AdminHint({ kind }: { kind: "home" | "portfolio" | "packages" }) {
  const { dictionary } = useLanguage();
  const message =
    kind === "home"
      ? dictionary.admin.examples
      : kind === "portfolio"
        ? dictionary.admin.portfolioExamples
        : dictionary.admin.packageExamples;

  return <p className="mt-4 text-sm text-muted">{message}</p>;
}
