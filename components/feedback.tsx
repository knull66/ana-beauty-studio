export function ErrorBanner({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="border border-line bg-surface px-4 py-3 text-sm text-gold-soft"
    >
      {message}
    </p>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border border-line px-6 py-16 text-center">
      <p className="font-serif text-2xl text-gold-soft">{title}</p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
        {description}
      </p>
    </div>
  );
}
